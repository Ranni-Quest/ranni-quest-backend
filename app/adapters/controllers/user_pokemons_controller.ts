import GetUserPokemons from '#usecases/get_user_pokemons'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserPokemonsController {
  constructor(protected getUserPokemons: GetUserPokemons) {}

  async init({ auth, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const discordId = auth.user?.discordId
    const output = await this.getUserPokemons.execute(discordId!)

    return output
  }
}
