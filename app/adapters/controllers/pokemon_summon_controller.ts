import type { HttpContext } from '@adonisjs/core/http'

import GetSetting from '#usecases/get_setting'
import SummonPokemon from '#usecases/summon_pokemon'
import { checkSummon } from '#utils/check_access.util'
import { inject } from '@adonisjs/core'

@inject()
export default class SummonPokemonController {
  constructor(
    protected getSetting: GetSetting,
    protected summonPokemon: SummonPokemon
  ) {}
  async init({ auth, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }
    const settings = await this.getSetting.execute()

    if (!checkSummon(auth.user?.lastTimeSummon!, settings?.pullTimer!)) {
      return Response.json({ message: 'Too soon' }, { status: 425 })
    }

    return await this.summonPokemon.execute(settings)
  }
}
