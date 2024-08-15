import PokemonPendingEntity from '#entities/pokemon_pending.entity'
import {
  PokemonPendingRepositoryInterface,
  RepositoryInterface,
} from '#repositories/repositories.interface'
import BasePokemonInterface from '#usecases/interfaces/base_pokemon.interface'
import PokemonPending from '../models/pokemon_pending.model.js'

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
    const pendingPokemon = await PokemonPending.findBy({ discordId, pokemonId })

    if (!pendingPokemon) throw new Error('Pokemon not found')

    return new PokemonPendingEntity(
      pendingPokemon.id,
      pendingPokemon.discordId,
      pendingPokemon.pokemonId,
      pendingPokemon.name,
      pendingPokemon.isShiny,
      pendingPokemon.artwork,
      pendingPokemon.sprite
    )
  }

  async upsertPokemonPending(discordId: string, pokemonInfo: BasePokemonInterface): Promise<void> {
    await PokemonPending.updateOrCreate({ discordId }, { discordId, ...pokemonInfo })
  }
}
