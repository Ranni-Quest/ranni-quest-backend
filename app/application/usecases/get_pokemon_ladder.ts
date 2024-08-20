import PokemonInfoEntity from '#entities/pokemon_info.entity'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import { inject } from '@adonisjs/core'

@inject()
export default class GetPokemonLadderUseCase {
  constructor(private readonly userPokemonRepository: UserPokemonRepository) {}

  async execute(): Promise<{ [key: string]: PokemonInfoEntity[] }> {
    return await this.userPokemonRepository.findAll()
  }
}
