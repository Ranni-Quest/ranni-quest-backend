// import type { HttpContext } from '@adonisjs/core/http'

import GetSetting from '#usecases/get_setting'
import PullCards from '#usecases/pull_cards'
import { checkPull } from '#utils/check_access.util'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PullCardsController {
  constructor(
    private pullCards: PullCards,
    private getSetting: GetSetting
  ) {}

  async init({ auth, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const settings = await this.getSetting.execute()

    if (!checkPull(auth.user?.lastTimePull!, settings?.pullTimer!)) {
      return response.status(425).json({ message: 'Too soon' })
    }

    const { discordId } = auth.user!

    return await this.pullCards.execute(discordId)
  }
}
