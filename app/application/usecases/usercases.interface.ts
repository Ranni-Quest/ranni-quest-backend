import CardEntity from '#entities/card.entity'
import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import SettingEntity from '#entities/setting.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import PokemonInterface from './interfaces/pokemon.interface.js'
import UserCardInterface from './interfaces/user_cards.interface.js'

export interface GetCardsSetInterface {
  execute(): Promise<UserCardInterface[]>
}

export interface GetLatestCardsPulledInterface {
  execute(): Promise<UserCardInterface[]>
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
  execute(
    discordId: string,
    pendingPokemon: PokemonPendingEntity,
    pokemonIdToReplace: number
  ): Promise<boolean>
}

export interface PullCardsInterface {
  execute(discordId: string): Promise<CardEntity[]>
}

export interface SummonPokemonInterface {
  execute(setting: SettingEntity, discordId: string): Promise<PokemonInterface>
}
