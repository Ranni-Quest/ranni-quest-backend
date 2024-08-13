import SettingEntity from '#entities/setting.entity'
import PokemonDropRateRepository from '#repositories/pokemon_drop_rate.repository'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import UserRepository from '#repositories/user.repository'
import SummonService from '#services/summon.service'
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
    const pokemonRarity = SummonService.getRandomPokemonRarity(summonDropsRates)
    const pokemonId = await SummonService.getPokemonId(summonDropsRates, pokemonRarity)
    const name = await SummonService.getFrenchName(pokemonId)
    const isShiny = SummonService.isShiny(setting?.shinyDropRate)

    this.pokemonPendingRepository.createUserPokemon(discordId, pokemonId)
    this.userRepository.savePullTimestamp(discordId)

    return {
      name,
      status: pokemonRarity,
      isShiny: isShiny ? true : false,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        isShiny ? 'shiny/' : ''
      }${pokemonId}.png`,
    }
  }
}
