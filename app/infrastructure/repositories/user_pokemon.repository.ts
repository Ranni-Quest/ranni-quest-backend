import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import { UserPokemonRepositoryInterface } from '#repositories/repositories.interface'
import PokemonService from '#services/pokemon.service'
import BasePokemonInterface from '#usecases/interfaces/base_pokemon.interface'
import db from '@adonisjs/lucid/services/db'
import UserPokemon from '../models/user_pokemon.model.js'

export default class UserPokemonRepository implements UserPokemonRepositoryInterface {
  async findByDiscordId(discordId: string): Promise<UserPokemonEntity[]> {
    const userPokemons = await UserPokemon.query().where('discordId', discordId)
    const output = []
    for (const userPokemon of userPokemons) {
      const types = await PokemonService.getPokemonTypes(userPokemon.pokemonId)
      const weaknesses = PokemonService.calculateWeaknesses(types)
      const resistances = PokemonService.calculateWeaknesses(types)

      output.push(
        new UserPokemonEntity(
          userPokemon.pokemonId,
          userPokemon.discordId,
          userPokemon.pokemonId,
          userPokemon.name,
          userPokemon.isShiny,
          userPokemon.sprite,
          userPokemon.artwork,
          types,
          weaknesses,
          resistances,
          userPokemon.timestamp ?? Math.floor(Date.now() / 1000)
        )
      )
    }
    return output
  }

  async upsertPokemon(discordId: string, pokemonId: number): Promise<void> {
    await UserPokemon.updateOrCreate({ discordId }, { discordId, pokemonId })
  }

  async countByDiscordId(discordId: string): Promise<number> {
    const output = await db
      .query()
      .count('* as total')
      .from('user_pokemons')
      .where('discord_id', discordId)
      .first()
    return output.total
  }

  async createUserPokemon(discordId: string, pokemonInfo: BasePokemonInterface): Promise<void> {
    await UserPokemon.updateOrCreate(
      { discordId, pokemonId: pokemonInfo.pokemonId },
      { discordId, ...pokemonInfo }
    )
  }

  async updateUserPokemon(
    discordId: string,
    pokemonIdToReplace: number,
    pokemonInfo: PokemonPendingEntity
  ): Promise<void> {
    await UserPokemon.updateOrCreate(
      { discordId, pokemonId: pokemonIdToReplace },
      { ...pokemonInfo.toArray() }
    )
  }
}
