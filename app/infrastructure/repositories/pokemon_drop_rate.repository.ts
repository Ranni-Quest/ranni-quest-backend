import PokemonDropRateEntity from '#entities/pokemon_drop_rate.entity'
import { PokemonDropRateRepositoryInterface } from '#repositories/repositories.interface'
import PokemonDropRate from '../models/pokemon_drop_rate.model.js'

export default class PokemonDropRateRepository implements PokemonDropRateRepositoryInterface {
  async findSummonDropRates(): Promise<PokemonDropRateEntity[]> {
    const output = await PokemonDropRate.query().orderBy('drop_rate', 'asc')
    return output.map(
      (pokemonDropRate) =>
        new PokemonDropRateEntity(
          pokemonDropRate.id,
          pokemonDropRate.rarity,
          pokemonDropRate.dropRate,
          pokemonDropRate.pokemons
        )
    )
  }
}
