import PokemonPendingEntity from '#entities/pokemon_pending.entity'
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
    pendingPokemon: PokemonPendingEntity,
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

  async keepUserPokemon(discordId: string, pendingPokemon: PokemonPendingEntity): Promise<void> {
    const userPokemonCount = await this.userPokemonRepository.countByDiscordId(discordId)

    if (userPokemonCount >= 6) {
      throw new Error('User already has 6 pokemons')
    }

    await this.userPokemonRepository.createUserPokemon(discordId, {
      pokemonId: pendingPokemon.pokemonId,
      name: pendingPokemon.name,
      isShiny: pendingPokemon.isShiny,
      artwork: pendingPokemon.artwork,
      sprite: pendingPokemon.sprite,
    })
  }
}
