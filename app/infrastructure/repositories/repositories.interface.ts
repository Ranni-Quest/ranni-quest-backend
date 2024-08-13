import CardEntity from '#entities/card.entity'
import PokemonDropRateEntity from '#entities/pokemon_drop_rate.entity'
import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import SettingEntity from '#entities/setting.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import CardDropRate from '#models/card_drop_rate.model'
import { BoosterRarityType } from '#types/rarities.type'
import UserCardInterface from '#usecases/interfaces/user_cards.interface'
import { BaseModel } from '@adonisjs/lucid/orm'

export interface RepositoryInterface {
  query(): typeof BaseModel
}

export interface BoosterRarityRateRepositoryInterface {}
export interface CardDropRateRepositoryInterface {
  findCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]>
}

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
  createUserPokemon(discordId: string, pokemonInfo: any): Promise<void>
}

export interface SettingRepositoryInterface {
  getSetting(): Promise<SettingEntity>
}

export interface UserCardRepositoryInterface {
  findByDiscordId(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]>
  findLatestCardsPulled(): Promise<UserCardInterface[]>
}

export interface UserPokemonRepositoryInterface {
  findByDiscordId(discordId: string): Promise<UserPokemonEntity[]>
  upsertPokemon(discordId: string, pokemonId: number): Promise<void>
}

export interface UserRepositoryInterface {
  savePullTimestamp(discordId: string): Promise<void>
}
