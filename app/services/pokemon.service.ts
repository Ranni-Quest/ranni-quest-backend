import { TypeName } from '#usecases/types/type_name.type'
import PokemonDropRate from '../infrastructure/models/pokemon_drop_rate.model.js'
import { PokemonRarityType } from '../types/rarities.type.js'
import { defense } from './pokemon_type_relation.js'

interface PokemonSpeciesResponse {
  name: string
  names: Array<{ language: { name: string }; name: string }>
}

interface PokemonInfoResponse {
  types: Array<{ type: { name: string } }>
}

export default class PokemonService {
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

  static async getPokemonTypes(pokemonId: number): Promise<TypeName[]> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    const { types } = (await response.json()) as PokemonInfoResponse
    return types.map(({ type }) => type.name as TypeName)
  }

  static calculatType(pokemonTypes: TypeName[]) {
    const weaknesses: { [key: string]: number } = {}

    for (const typeName of pokemonTypes) {
      for (const attackType of Object.keys(defense)) {
        if (!Object.keys(weaknesses).includes(attackType)) {
          weaknesses[attackType] = 1
        }
        weaknesses[attackType] *= defense[typeName][attackType]
      }
    }

    return weaknesses
  }

  static calculatResistances(pokemonTypes: TypeName[]) {
    const weaknesses = PokemonService.calculatType(pokemonTypes)

    for (const weakness of Object.keys(weaknesses)) {
      if (weaknesses[weakness] >= 1) {
        delete weaknesses[weakness]
      }
    }

    return weaknesses
  }

  static calculateWeaknesses(pokemonTypes: TypeName[]) {
    const weaknesses = PokemonService.calculatType(pokemonTypes)

    for (const weakness of Object.keys(weaknesses)) {
      if (weaknesses[weakness] <= 1) {
        delete weaknesses[weakness]
      }
    }

    return weaknesses
  }
}
