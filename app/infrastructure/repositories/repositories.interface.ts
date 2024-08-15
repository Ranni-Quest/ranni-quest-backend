import PokemonDropRateEntity from '#entities/pokemon_drop_rate.entity'
import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import SettingEntity from '#entities/setting.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import CardDropRate from '#models/card_drop_rate.model'
import { BoosterRarityType } from '#types/rarities.type'
import { BaseModel } from '@adonisjs/lucid/orm'

export interface RepositoryInterface {
  query(): typeof BaseModel
}

export interface BoosterRarityRateRepositoryInterface {}
export interface CardDropRateRepositoryInterface {
  findCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]>
}

export interface CardRepositoryInterface {}

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
  upsertPokemonPending(
    discordId: string,
    pokemonInfo: {
      pokemonId: number
      name: string
      isShiny: boolean
    }
  ): Promise<void>
}

export interface SettingRepositoryInterface {
  getSetting(): Promise<SettingEntity>
}

export interface UserCardRepositoryInterface {
  findCardsSet(): Promise<UserCardEntity[]>
  findByDiscordId(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]>
  findLatestCardsPulled(): Promise<UserCardEntity[]>
  savePulledCard(discordId: string, cardId: string): Promise<void>
}

export interface UserPokemonRepositoryInterface {
  findByDiscordId(discordId: string): Promise<UserPokemonEntity[]>
  upsertPokemon(discordId: string, pokemonId: number): Promise<void>
}

export interface UserRepositoryInterface {
  savePullTimestamp(discordId: string): Promise<void>
}
