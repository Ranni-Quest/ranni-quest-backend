import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import { inject } from '@adonisjs/core'

@inject()
export default class ReleaseUserPokemon {
  constructor(protected pokemonPendingRepository: PokemonPendingRepository) {}

  /**
   * Release user pokemon
   * @param pokemonId - pokemon id
   * @param discordId - discord id
   */
  async execute(pokemonId: number, discordId: string) {
    await this.pokemonPendingRepository
      .query()
      .query()
      .where('id', pokemonId)
      .andWhere('discordId', discordId)
      .delete()
  }
}
