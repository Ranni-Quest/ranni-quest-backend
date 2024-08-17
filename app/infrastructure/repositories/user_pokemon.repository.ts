import PokemonInfoEntity from '#entities/pokemon_info.entity'
import { UserPokemonRepositoryInterface } from '#repositories/repositories.interface'
import PokemonService from '#services/pokemon.service'
import db from '@adonisjs/lucid/services/db'
import UserPokemon from '../models/user_pokemon.model.js'

export default class UserPokemonRepository implements UserPokemonRepositoryInterface {
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
      { discordId, ...pokemonInfo.toArray() }
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
      { ...pokemonInfo.toArray() }
    )
  }
}
