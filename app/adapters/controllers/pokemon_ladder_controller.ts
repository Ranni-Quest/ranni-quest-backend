import PokemonInfoEntity from '#entities/pokemon_info.entity'
import GetPokemonLadderUseCase from '#usecases/get_pokemon_ladder'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PokemonLadderController {
  constructor(private readonly getPokemonLadderUseCase: GetPokemonLadderUseCase) {}

  async init({
    auth,
    response,
  }: HttpContext): Promise<{ [key: string]: PokemonInfoEntity[] } | void> {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    return await this.getPokemonLadderUseCase.execute()
  }
}
