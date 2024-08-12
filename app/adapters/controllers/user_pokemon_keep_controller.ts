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

    const { pokemonId } = request.body as unknown as { pokemonId: number }
    const discordId = auth.user?.discordId
    const output = await this.getUserPokemonPending.execute(discordId!, pokemonId)

    if (!output) {
      response.status(400).json({ message: 'Bad request' })
      return response
    }

    return this.keepUserPokemon.execute(discordId!, pokemonId)
  }
}
