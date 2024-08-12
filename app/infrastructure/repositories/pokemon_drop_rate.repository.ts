import PokemonDropRateEntity from '#entities/pokemon_drop_rate.entity'
import PokemonDropRate from '../models/pokemon_drop_rate.model.js'
import { PokemonDropRateRepositoryInterface } from '#repositories/repositories.interface'

export default class PokemonDropRateRepository implements PokemonDropRateRepositoryInterface {
  async findSummonDropRates(): Promise<PokemonDropRateEntity[]> {
    const output = await PokemonDropRate.findManyBy({})
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
