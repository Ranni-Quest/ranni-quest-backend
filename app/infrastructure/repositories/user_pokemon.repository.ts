import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import UserPokemon from '../models/user_pokemon.model.js'
import { UserPokemonRepositoryInterface } from '#repositories/repositories.interface'

export default class UserPokemonRepository implements UserPokemonRepositoryInterface {
  async findByDiscordId(discordId: string): Promise<UserPokemonEntity[]> {
    const userPokemons = await UserPokemon.query().where('discordId', discordId)
    return userPokemons.map(
      (userPokemon) =>
        new UserPokemonEntity(
          userPokemon.id,
          userPokemon.discordId,
          userPokemon.pokemonId,
          userPokemon.name,
          userPokemon.isShiny,
          userPokemon.sprite,
          userPokemon.artwork
        )
    )
  }

  async upsertPokemon(discordId: string, pokemonId: number): Promise<void> {
    await UserPokemon.updateOrCreate({ discordId }, { discordId, pokemonId })
  }

  async countByDiscordId(discordId: string): Promise<number> {
    const output = (await UserPokemon.query()
      .count('* as total')
      .where('discordId', discordId)) as unknown as [{ total: number }]
    return output[0].total
  }

  async createUserPokemon(discordId: string, pokemonInfo: any): Promise<void> {
    await UserPokemon.create({ discordId, ...pokemonInfo })
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
