import PokemonInfoEntity from '#entities/pokemon_info.entity'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import { GetUserPokemonsInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetUserPokemons implements GetUserPokemonsInterface {
  constructor(private userPokemonRepository: UserPokemonRepository) {}

  /**
   * Get user pokemons
   * @param discordId - discord id
   * @returns user pokemons
   */
  async execute(discordId: string): Promise<PokemonInfoEntity[]> {
    return this.userPokemonRepository.findByDiscordId(discordId)
  }
}
