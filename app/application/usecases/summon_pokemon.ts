import SettingEntity from '#entities/setting.entity'
import PokemonDropRateRepository from '#repositories/pokemon_drop_rate.repository'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import UserRepository from '#repositories/user.repository'
import PokemonService from '#services/pokemon.service'
import { inject } from '@adonisjs/core'
import PokemonDropRate from '../../infrastructure/models/pokemon_drop_rate.model.js'
import PokemonInterface from './interfaces/pokemon.interface.js'
import { SummonPokemonInterface } from './usercases.interface.js'

@inject()
export default class SummonPokemon implements SummonPokemonInterface {
  constructor(
    protected pokemonDropRateRepository: PokemonDropRateRepository,
    protected pokemonPendingRepository: PokemonPendingRepository,
    protected userRepository: UserRepository
  ) {}

  async execute(setting: SettingEntity, discordId: string): Promise<PokemonInterface> {
    const summonDropsRates =
      (await this.pokemonDropRateRepository.findSummonDropRates()) as Array<PokemonDropRate>
    const status = PokemonService.getRandomPokemonRarity(summonDropsRates)
    const pokemonId = await PokemonService.getPokemonId(summonDropsRates, status)
    const name = await PokemonService.getFrenchName(pokemonId)
    const isShiny = PokemonService.isShiny(setting?.shinyDropRate)
    const types = await PokemonService.getPokemonTypes(pokemonId)
    const pokemonInfo = {
      name,
      status,
      isShiny,
      id: pokemonId,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
      artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
      types,
      weaknesses: PokemonService.calculateWeaknesses(types),
      resistances: PokemonService.calculatResistances(types),
      timestamp: 0,
    }

    this.pokemonPendingRepository.upsertPokemonPending(discordId, {
      pokemonId,
      name,
      isShiny,
      artwork: pokemonInfo.artwork,
      sprite: pokemonInfo.sprite,
    })
    // this.userRepository.saveSummonTimestamp(discordId)

    return pokemonInfo
  }
}
