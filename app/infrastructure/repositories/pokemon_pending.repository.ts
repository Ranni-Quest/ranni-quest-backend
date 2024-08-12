import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import PokemonPending from '../models/pokemon_pending.model.js'
import {
  PokemonPendingRepositoryInterface,
  RepositoryInterface,
} from '#repositories/repositories.interface'

export default class PokemonPendingRepository
  implements PokemonPendingRepositoryInterface, RepositoryInterface
{
  query(): typeof PokemonPending {
    return PokemonPending
  }

  async findByDiscordIdAndPokemonId(
    discordId: string,
    pokemonId: number
  ): Promise<PokemonPendingEntity> {
    const pendingPokemon = await PokemonPending.query()
      .where('discordId', discordId)
      .andWhere('pokemonId', pokemonId)
      .first()

    if (!pendingPokemon) throw new Error('Pokemon not found')

    return new PokemonPendingEntity(
      pendingPokemon.id,
      pendingPokemon.discordId,
      pendingPokemon.pokemonId,
      pendingPokemon.name,
      pendingPokemon.isShiny
    )
  }

  async createUserPokemon(discordId: string, pokemonInfo: any): Promise<void> {
    await PokemonPending.create({ discordId, ...pokemonInfo })
  }
}
