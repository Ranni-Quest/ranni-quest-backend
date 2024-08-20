import PokemonInfoEntity from '#entities/pokemon_info.entity'
import PokemonDropRate from '#models/pokemon_drop_rate.model'
import Setting from '#models/setting.model'
import PokemonDropRateRepository from '#repositories/pokemon_drop_rate.repository'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import UserRepository from '#repositories/user.repository'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import PokemonService from '#services/pokemon.service'
import { SummonPokemonInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class SummonPokemon implements SummonPokemonInterface {
  constructor(
    protected pokemonDropRateRepository: PokemonDropRateRepository,
    protected pokemonPendingRepository: PokemonPendingRepository,
    protected userPokemonRepository: UserPokemonRepository,
    protected userRepository: UserRepository
  ) {}

  /**
   * Summon pokemon
   * @param setting - setting
   * @param discordId - discord id
   * @returns pokemon info
   */
  async execute(setting: Setting, discordId: string): Promise<PokemonInfoEntity> {
    const summonDropsRates =
      (await this.pokemonDropRateRepository.findSummonDropRates()) as Array<PokemonDropRate>
    const outputSummoned = await this.userPokemonRepository.query().query().select('pokemon_id')
    const alreadySummoned: number[] = outputSummoned.map((pokemon) =>
      Number.parseInt(pokemon.pokemonId as unknown as string, 10)
    )
    const status = PokemonService.getRandomPokemonRarity(summonDropsRates)
    const pokemonId = await PokemonService.getPokemonId(alreadySummoned, summonDropsRates, status)
    const name = await PokemonService.getFrenchName(pokemonId)
    const isShiny = PokemonService.isShiny(setting?.shinyDropRate)
    const types = await PokemonService.getPokemonTypes(pokemonId)
    const pokemonInfo = PokemonService.generatePokemonInfo(name, status, isShiny, pokemonId, types)

    this.pokemonPendingRepository.upsertPokemonPending(discordId, pokemonInfo)
    this.userRepository.saveSummonTimestamp(discordId)

    return pokemonInfo
  }
}
