import PokemonInfoEntity from '#entities/pokemon_info.entity'
import PokemonDropRate from '#models/pokemon_drop_rate.model'
import { defense } from '#services/pokemon_type_relation.service'
import type { PokemonInfoResponse, PokemonSpeciesResponse } from '#types/pokeapi_response'
import type { PokemonRarityType } from '#types/rarities.type'
import type { TypeName } from '#types/type_name.type'

export default class PokemonService {
  /**
   * get random pokemon id from summonDropsRates and pokemonStatus
   * @param summonDropsRates
   * @param pokemonStatus
   * @returns
   */
  static async getPokemonId(
    alreadySummoned: number[],
    summonDropsRates: Array<PokemonDropRate>,
    pokemonStatus: PokemonRarityType
  ) {
    let index = summonDropsRates.findIndex(
      (summonDropRate) => summonDropRate.rarity === pokemonStatus
    )

    let pokemonIds = summonDropsRates[index].pokemons

    for (const alreadySummonedId of alreadySummoned) {
      index = pokemonIds.indexOf(alreadySummonedId)
      if (index > -1) {
        pokemonIds.splice(index, 1)
      }
    }

    return pokemonIds[Math.floor(Math.random() * pokemonIds.length)]
  }

  /**
   * get random shiny rate
   * @param shinyRate
   * @returns
   */
  static isShiny(shinyRate: number = 0.05) {
    const rate = Math.random()
    return rate < shinyRate ? true : false
  }

  /**
   * get random pokemon rarity from summonDropsRate
   * @param summonDropsRate
   * @returns
   */
  static getRandomPokemonRarity(summonDropsRate: Array<PokemonDropRate>): PokemonRarityType {
    const rate = Math.random()
    for (let summonDropRate of summonDropsRate) {
      if (summonDropRate.dropRate > rate) {
        return summonDropRate.rarity as PokemonRarityType
      }
    }

    return 'common'
  }

  /**
   * get french name from pokemonId
   * @param pokemonId
   * @returns
   */
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

  /**
   * get pokemon types from pokemonId
   * @param pokemonId
   * @returns
   */
  static async getPokemonTypes(pokemonId: number): Promise<TypeName[]> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    const { types } = (await response.json()) as PokemonInfoResponse
    return types.map(({ type }) => type.name as TypeName)
  }

  /**
   * calculate weaknesses
   * @param pokemonTypes
   * @returns
   */
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

  /**
   * calculate resistances
   * @param pokemonTypes
   * @returns
   */
  static calculatResistances(pokemonTypes: TypeName[]) {
    const weaknesses = PokemonService.calculatType(pokemonTypes)

    for (const weakness of Object.keys(weaknesses)) {
      if (weaknesses[weakness] >= 1) {
        delete weaknesses[weakness]
      }
    }

    return weaknesses
  }

  /**
   * calculate weaknesses
   * @param pokemonTypes
   * @returns
   */
  static calculateWeaknesses(pokemonTypes: TypeName[]) {
    const weaknesses = PokemonService.calculatType(pokemonTypes)

    for (const weakness of Object.keys(weaknesses)) {
      if (weaknesses[weakness] <= 1) {
        delete weaknesses[weakness]
      }
    }

    return weaknesses
  }

  /**
   * generate pokemon info
   * @param name
   * @param status
   * @param isShiny
   * @param pokemonId
   * @param types
   * @returns
   */
  static generatePokemonInfo(
    name: string,
    status: PokemonRarityType,
    isShiny: boolean,
    pokemonId: number,
    types: TypeName[]
  ): PokemonInfoEntity {
    return new PokemonInfoEntity(
      pokemonId,
      name,
      status,
      isShiny,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
      types,
      PokemonService.calculateWeaknesses(types),
      PokemonService.calculatResistances(types),
      0
    )
  }
}
