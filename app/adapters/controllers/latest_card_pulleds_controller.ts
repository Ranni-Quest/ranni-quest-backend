import GetLatestCardsPulled from '#usecases/get_latest_cards_pulled'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LatestCardPulledsController {
  constructor(private readonly getLatestCardsPulled: GetLatestCardsPulled) {}
  async init({ auth, response }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    return await this.getLatestCardsPulled.execute()
  }
}
