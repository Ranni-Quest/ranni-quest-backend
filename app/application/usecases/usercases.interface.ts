import FullCardInfoEntity from '#entities/full_card_info.entity'
import PokemonInfoEntity from '#entities/pokemon_info.entity'
import UserCardEntity from '#entities/user_card.entity'
import UserPokemonEntity from '#entities/user_pokemon.entity'
import Setting from '#models/setting.model'

export interface GetCardsSetInterface {
  execute(): Promise<UserCardEntity[]>
}

export interface GetLatestCardsPulledInterface {
  execute(): Promise<UserCardEntity[]>
}

export interface GetSettingInterface {
  execute(): Promise<Setting>
}

export interface GetUserCardsInterface {
  execute(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]>
}

export interface GetUserPokemonPendingInterface {
  execute(discordId: string, pokemonId: number): Promise<PokemonInfoEntity>
}
export interface GetUserPokemonsInterface {
  execute(discordId: string): Promise<UserPokemonEntity[]>
}

export interface KeepUserPokemonInterface {
  execute(
    discordId: string,
    pendingPokemon: PokemonInfoEntity,
    pokemonIdToReplace: number
  ): Promise<boolean>
}

export interface PullCardsInterface {
  execute(discordId: string): Promise<FullCardInfoEntity[]>
}

export interface SummonPokemonInterface {
  execute(setting: Setting, discordId: string): Promise<PokemonInfoEntity>
}
