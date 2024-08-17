import { PokemonDropRateRepositoryInterface } from '#repositories/repositories.interface'
import PokemonDropRate from '../models/pokemon_drop_rate.model.js'

export default class PokemonDropRateRepository implements PokemonDropRateRepositoryInterface {
  /**
   * get summon drop rates
   * @returns summon drop rates
   */
  async findSummonDropRates(): Promise<PokemonDropRate[]> {
    return await PokemonDropRate.query().orderBy('drop_rate', 'asc')
  }
}
