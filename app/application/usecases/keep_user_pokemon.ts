import PokemonInfoEntity from '#entities/pokemon_info.entity'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import { inject } from '@adonisjs/core'
import { KeepUserPokemonInterface } from './usercases.interface.js'

@inject()
export default class KeepUserPokemon implements KeepUserPokemonInterface {
  constructor(
    protected userPokemonRepository: UserPokemonRepository,
    protected pokemonPendingRepository: PokemonPendingRepository
  ) {}

  /**
   * Check if the user really summon pokemon and keep it
   * @param discordId
   * @param keep
   * @returns
   */
  async execute(
    discordId: string,
    pendingPokemon: PokemonInfoEntity,
    pokemonIdToReplace: number | null = null
  ): Promise<boolean> {
    if (!pokemonIdToReplace) {
      try {
        await this.keepUserPokemon(discordId, pendingPokemon)
      } catch (error) {
        console.log(error)
        return false
      }
    } else {
      await this.userPokemonRepository.updateUserPokemon(
        discordId,
        pokemonIdToReplace,
        pendingPokemon
      )
    }

    return true
  }

  /**
   * Keep user pokemon
   * @param discordId - discord id
   * @param pendingPokemon - pending pokemon
   */
  async keepUserPokemon(discordId: string, pendingPokemon: PokemonInfoEntity): Promise<void> {
    const userPokemonCount = await this.userPokemonRepository.countByDiscordId(discordId)

    if (userPokemonCount >= 6) {
      throw new Error('User already has 6 pokemons')
    }

    await this.userPokemonRepository.createUserPokemon(discordId, pendingPokemon)
  }
}
