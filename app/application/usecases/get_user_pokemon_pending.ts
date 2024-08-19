import PokemonInfoEntity from '#entities/pokemon_info.entity'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import { GetUserPokemonPendingInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetUserPokemonPending implements GetUserPokemonPendingInterface {
  constructor(private readonly pokemonPendingRepository: PokemonPendingRepository) {}

  /**
   * Get user pokemon pending
   * @param discordId - discord id
   * @param pokemonId - pokemon id
   * @returns user pokemon pending
   */
  async execute(discordId: string, pokemonId: number): Promise<PokemonInfoEntity> {
    return await this.pokemonPendingRepository.findByDiscordIdAndPokemonId(discordId, pokemonId)
  }
}
