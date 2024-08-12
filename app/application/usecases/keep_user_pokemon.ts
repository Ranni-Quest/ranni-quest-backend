import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import { inject } from '@adonisjs/core'
import { KeepUserPokemonInterface } from './usercases.interface.js'

@inject()
export default class KeepUserPokemon implements KeepUserPokemonInterface {
  constructor(private pokemonPendingRepository: PokemonPendingRepository) {}

  async execute(discordId: string, keep: number): Promise<PokemonPendingEntity | null> {
    const pendingPokemon = await this.pokemonPendingRepository.findByDiscordIdAndPokemonId(
      discordId,
      keep
    )
    if (!pendingPokemon) return null
    await this.pokemonPendingRepository.upsertPokemon(discordId, pendingPokemon)
    return pendingPokemon
  }
}
