import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import { inject } from '@adonisjs/core'
import { GetUserPokemonPendingInterface } from './usercases.interface.js'

@inject()
export default class GetUserPokemonPending implements GetUserPokemonPendingInterface {
  constructor(private readonly pokemonPendingRepository: PokemonPendingRepository) {}

  async execute(discordId: string, pokemonId: number): Promise<PokemonPendingEntity> {
    return await this.pokemonPendingRepository.findByDiscordIdAndPokemonId(discordId, pokemonId)
  }
}
