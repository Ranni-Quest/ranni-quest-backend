import UserPokemonEntity from '#entities/user_pokemon.entity'
import UserPokemon from '#models/user_pokemon.model'
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
}
