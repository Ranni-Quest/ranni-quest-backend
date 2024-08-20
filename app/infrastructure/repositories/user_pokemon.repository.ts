import PokemonInfoEntity from '#entities/pokemon_info.entity'
import UserPokemon from '#models/user_pokemon.model'
import {
  RepositoryInterface,
  UserPokemonRepositoryInterface,
} from '#repositories/repositories.interface'
import PokemonService from '#services/pokemon.service'
import db from '@adonisjs/lucid/services/db'

export default class UserPokemonRepository
  implements UserPokemonRepositoryInterface, RepositoryInterface
{
  query(): typeof UserPokemon {
    return UserPokemon
  }

  /**
   * get pokemon by discord id
   * @param discordId - discord id
   * @returns pokemon
   */
  async findByDiscordId(discordId: string): Promise<PokemonInfoEntity[]> {
    const userPokemons = await UserPokemon.query().where('discordId', discordId)
    const output = []

    for (const userPokemon of userPokemons) {
      const types = await PokemonService.getPokemonTypes(userPokemon.pokemonId)
      const weaknesses = PokemonService.calculateWeaknesses(types)
      const resistances = PokemonService.calculateWeaknesses(types)

      output.push(
        new PokemonInfoEntity(
          userPokemon.pokemonId,
          userPokemon.name,
          userPokemon.status,
          userPokemon.isShiny,
          userPokemon.artwork,
          userPokemon.sprite,
          types,
          weaknesses,
          resistances,
          userPokemon.timestamp ?? Math.floor(Date.now() / 1000)
        )
      )
    }

    return output
  }

  /**
   * upsert pokemon
   * @param discordId - discord id
   * @param pokemonId - pokemon id
   */
  async upsertPokemon(discordId: string, pokemonId: number): Promise<void> {
    await UserPokemon.updateOrCreate({ discordId }, { discordId, pokemonId })
  }

  /**
   * count pokemon by discord id
   * @param discordId - discord id
   * @returns count
   */
  async countByDiscordId(discordId: string): Promise<number> {
    const output = await db
      .query()
      .count('* as total')
      .from('user_pokemons')
      .where('discord_id', discordId)
      .first()
    return output.total
  }

  /**
   * create user pokemon
   * @param discordId - discord id
   * @param pokemonInfo - pokemon info
   */
  async createUserPokemon(discordId: string, pokemonInfo: PokemonInfoEntity): Promise<void> {
    await UserPokemon.updateOrCreate(
      { discordId, pokemonId: pokemonInfo.pokemonId },
      {
        discordId,
        ...pokemonInfo.toArray(),
        types: JSON.stringify(pokemonInfo.types),
        weaknesses: JSON.stringify(pokemonInfo.weaknesses),
        resistances: JSON.stringify(pokemonInfo.resistances),
      }
    )
  }

  /**
   * update user pokemon
   * @param discordId - discord id
   * @param pokemonIdToReplace - pokemon id to replace
   * @param pokemonInfo - pokemon info
   */
  async updateUserPokemon(
    discordId: string,
    pokemonIdToReplace: number,
    pokemonInfo: PokemonInfoEntity
  ): Promise<void> {
    await UserPokemon.updateOrCreate(
      { discordId, pokemonId: pokemonIdToReplace },
      {
        discordId,
        ...pokemonInfo.toArray(),
        types: JSON.stringify(pokemonInfo.types),
        weaknesses: JSON.stringify(pokemonInfo.weaknesses),
        resistances: JSON.stringify(pokemonInfo.resistances),
      }
    )
  }

  async findAll(): Promise<{ [key: string]: PokemonInfoEntity[] }> {
    const output = await db.rawQuery(`
      SELECT * 
      FROM user_pokemons up
      LEFT JOIN users u ON up.discord_id = u.discord_id
      ORDER BY u.last_time_summon DESC`)

    let userPokemons: { [key: string]: PokemonInfoEntity[] } = {}
    for (const userPokemon of output[0]) {
      if (!Object.keys(userPokemons).includes(userPokemon.pseudo)) {
        userPokemons[userPokemon.pseudo] = []
      }

      userPokemons[userPokemon.pseudo].push({
        pokemonId: userPokemon.pokemon_id,
        name: userPokemon.name,
        status: userPokemon.status,
        isShiny: userPokemon.is_shiny,
        artwork: userPokemon.artwork,
        sprite: userPokemon.sprite,
        types: userPokemon.types,
        weaknesses: userPokemon.weaknesses,
        resistances: userPokemon.resistances,
        timestamp: userPokemon.timestamp ?? Math.floor(Date.now() / 1000),
      } as PokemonInfoEntity)
    }
    return userPokemons
  }
}
