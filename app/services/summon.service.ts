import PokemonDropRate from '../infrastructure/models/pokemon_drop_rate.model.js'
import { PokemonRarityType } from '../types/rarities.type.js'

interface PokemonSpeciesResponse {
  name: string
  names: Array<{ language: { name: string }; name: string }>
}

export default class SummonService {
  static async getPokemonId(
    summonDropsRates: Array<PokemonDropRate>,
    pokemonStatus: PokemonRarityType
  ) {
    const index = summonDropsRates.findIndex(
      (summonDropRate) => summonDropRate.rarity === pokemonStatus
    )

    const pokemondIds = summonDropsRates[index].pokemons

    return pokemondIds[Math.floor(Math.random() * pokemondIds.length)]
  }

  static async getFrenchName(pokemonId: number) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    const jsonResponse = (await response.json()) as PokemonSpeciesResponse
    const { name, names } = jsonResponse

    for (let { language, name: nameInLanguage } of names) {
      if (language.name === 'fr') {
        return nameInLanguage
      }
    }

    return name
  }

  static isShiny(shinyRate: number = 0.05) {
    const rate = Math.random()
    return rate < shinyRate ? true : false
  }

  static getRandomPokemonRarity(summonDropsRate: Array<PokemonDropRate>): PokemonRarityType {
    const rate = Math.random()
    for (let summonDropRate of summonDropsRate) {
      if (summonDropRate.dropRate > rate) {
        return summonDropRate.rarity as PokemonRarityType
      }
    }

    return 'commun'
  }
}
