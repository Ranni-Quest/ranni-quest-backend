import CardEntity from '#entities/card.entity'
import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import SettingEntity from '#entities/setting.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import CardInterface from './interfaces/card.interface.js'
import PokemonInterface from './interfaces/pokemon.interface.js'

export interface GetCardsSetInterface {
  execute(): Promise<CardEntity[]>
}

export interface GetLatestCardsPulledInterface {
  execute(): Promise<CardInterface[]>
}

export interface GetSettingInterface {
  execute(): Promise<SettingEntity>
}

export interface GetUserCardsInterface {
  execute(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]>
}

export interface GetUserPokemonPendingInterface {
  execute(discordId: string, pokemonId: number): Promise<PokemonPendingEntity>
}
export interface GetUserPokemonsInterface {
  execute(discordId: string): Promise<UserPokemonEntity[]>
}

export interface KeepUserPokemonInterface {
  execute(discordId: string, keep: number): Promise<PokemonPendingEntity | null>
}

export interface PullCardsInterface {
  execute(discordId: string): Promise<CardEntity[]>
}

export interface SummonPokemonInterface {
  execute(setting: SettingEntity): Promise<PokemonInterface>
}
