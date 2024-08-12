import GetUserPokemonPending from '#usecases/get_user_pokemon_pending'
import KeepUserPokemon from '#usecases/keep_user_pokemon'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserPokemonKeepController {
  constructor(
    protected keepUserPokemon: KeepUserPokemon,
    protected getUserPokemonPending: GetUserPokemonPending
  ) {}

  async init({ auth, request, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const { pokemonIdToKeep, pokemonIdToReplace } = request.body as unknown as {
      pokemonIdToKeep: number
      pokemonIdToReplace: number
    }
    const discordId = auth.user?.discordId
    const pokemonPending = await this.getUserPokemonPending.execute(discordId!, pokemonIdToKeep)

    if (!pokemonPending) {
      response.status(400).json({ message: 'Bad request' })
      return response
    }

    return this.keepUserPokemon.execute(discordId!, pokemonPending, pokemonIdToReplace)
  }
}
