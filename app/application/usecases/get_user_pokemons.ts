import UserPokemonRepository from '#repositories/user_pokemon.repository'
import { inject } from '@adonisjs/core'
import { GetUserPokemonsInterface } from './usercases.interface.js'
import PokemonInfoEntity from '#entities/pokemon_info.entity'

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
