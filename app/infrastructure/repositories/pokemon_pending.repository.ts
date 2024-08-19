import PokemonInfoEntity from '#entities/pokemon_info.entity'
import PokemonPending from '#models/pokemon_pending.model'
import {
  PokemonPendingRepositoryInterface,
  RepositoryInterface,
} from '#repositories/repositories.interface'
import PokemonService from '#services/pokemon.service'

export default class PokemonPendingRepository
  implements PokemonPendingRepositoryInterface, RepositoryInterface
{
  /**
   * @returns PokemonPendingModel
   */
  query(): typeof PokemonPending {
    return PokemonPending
  }

  /**
   * get pokemon pending by discord id and pokemon id
   * @param discordId - discord id
   * @param pokemonId - pokemon id
   * @returns pokemonInfoEntity
   */
  async findByDiscordIdAndPokemonId(
    discordId: string,
    pokemonId: number
  ): Promise<PokemonInfoEntity> {
    const pendingPokemon = await PokemonPending.findBy({ discordId, pokemonId })

    if (!pendingPokemon) throw new Error('Pokemon not found')

    return PokemonService.generatePokemonInfo(
      pendingPokemon.name,
      pendingPokemon.status,
      pendingPokemon.isShiny,
      pendingPokemon.pokemonId,
      pendingPokemon.types
    )
  }

  /**
   * upsert pokemon pending
   * @param discordId - discord id
   * @param pokemonInfo - pokemon info
   */
  async upsertPokemonPending(discordId: string, pokemonInfo: PokemonInfoEntity): Promise<void> {
    await PokemonPending.updateOrCreate(
      { discordId },
      {
        discordId,
        ...pokemonInfo.toArray(),
        types: JSON.stringify(pokemonInfo.types),
        weaknesses: JSON.stringify(pokemonInfo.weaknesses),
        resistances: JSON.stringify(pokemonInfo.resistances),
      }
    )
  }
}
