import CardEntity from '#entities/card.entity'
import PokemonDropRateEntity from '#entities/pokemon_drop_rate.entity'
import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import SettingEntity from '#entities/setting.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import CardInterface from '../../application/usecases/interfaces/card.interface.js'

export interface BoosterRarityRateRepositoryInterface {}
export interface CardDropRateRepositoryInterface {}
export interface CardDropRateRepositoryInterface {}

export interface CardRepositoryInterface {
  findCardsSet(): Promise<CardEntity[]>
}

export interface EffectRepositoryInterface {}

export interface LogRepositoryInterface {}

export interface PokemonDropRateRepositoryInterface {
  findSummonDropRates(): Promise<PokemonDropRateEntity[]>
}

export interface PokemonPendingRepositoryInterface {
  findByDiscordIdAndPokemonId(
    discordId: string,
    pokemonId: number
  ): Promise<PokemonPendingEntity | null>
  upsertPokemon(discordId: string, pokemonInfo: any): Promise<void>
}

export interface SettingRepositoryInterface {
  getSetting(): Promise<SettingEntity>
}

export interface UserCardRepositoryInterface {
  findByDiscordId(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]>
  findLatestCardsPulled(): Promise<CardInterface[]>
}

export interface UserPokemonRepositoryInterface {
  findByDiscordId(discordId: string): Promise<UserPokemonEntity[]>
}

export interface UserRepositoryInterface {}
