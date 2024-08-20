import PokemonInfoEntity from '#entities/pokemon_info.entity'
import GetSetting from '#usecases/get_setting'
import SummonPokemon from '#usecases/summon_pokemon'
import { checkSummon } from '#utils/check_access.util'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SummonPokemonController {
  constructor(
    protected getSetting: GetSetting,
    protected summonPokemon: SummonPokemon
  ) {}

  async init({ auth, response }: HttpContext): Promise<PokemonInfoEntity | void> {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const settings = await this.getSetting.execute()

    if (!checkSummon(auth.user?.lastTimeSummon!, settings?.summonTimer!)) {
      return response.status(425).json({ message: 'Too soon' })
    }

    return await this.summonPokemon.execute(settings, auth.user?.discordId!)
  }
}
