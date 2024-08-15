import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import { inject } from '@adonisjs/core'

@inject()
export default class ReleaseUserPokemon {
  constructor(protected pokemonPendingRepository: PokemonPendingRepository) {}

  async execute(pokemonId: number, discordId: string) {
    await this.pokemonPendingRepository
      .query()
      .query()
      .where('id', pokemonId)
      .andWhere('discordId', discordId)
      .delete()
  }
}
