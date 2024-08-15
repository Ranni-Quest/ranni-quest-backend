import GetUserPokemonPending from '#usecases/get_user_pokemon_pending'
import KeepUserPokemon from '#usecases/keep_user_pokemon'
import ReleaseUserPokemon from '#usecases/release_user_pokemon'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserPokemonActionController {
  constructor(
    protected keepUserPokemon: KeepUserPokemon,
    protected releaseUserPokemon: ReleaseUserPokemon,
    protected getUserPokemonPending: GetUserPokemonPending
  ) {}

  async init({ auth, request, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const { pokemonIdToKeep, pokemonIdToReplace, action } = request.body()

    const discordId = auth.user?.discordId
    const pokemonPending = await this.getUserPokemonPending.execute(discordId!, pokemonIdToKeep)

    if (!pokemonPending) {
      response.status(400).json({ message: 'Bad request' })
      return response
    }

    if (action === 'release') {
      await this.releaseUserPokemon.execute(pokemonPending.id!, discordId!)
      return response.status(200).json({ message: 'deleted' })
    }
    if (await this.keepUserPokemon.execute(discordId!, pokemonPending, pokemonIdToReplace)) {
      return pokemonPending
    } else {
      return response.status(400).json({ message: 'Bad request' })
    }
  }
}
