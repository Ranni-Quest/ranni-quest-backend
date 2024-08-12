import UserPokemonEntity from '#entities/user_pokemon.entity'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import { inject } from '@adonisjs/core'
import { GetUserPokemonsInterface } from './usercases.interface.js'

@inject()
export default class GetUserPokemons implements GetUserPokemonsInterface {
  constructor(private userPokemonRepository: UserPokemonRepository) {}

  async execute(discordId: string): Promise<UserPokemonEntity[]> {
    return this.userPokemonRepository.findByDiscordId(discordId)
  }
}
