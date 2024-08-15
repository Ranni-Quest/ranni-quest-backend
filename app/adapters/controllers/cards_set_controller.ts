import GetCardsSet from '#usecases/get_cards_set'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CardsSetController {
  constructor(private getCardsSet: GetCardsSet) {}

  async init({ auth, response, request }: HttpContext) {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const { limit, offset } = request.qs()
    return await this.getCardsSet.execute(limit, offset)
  }
}
