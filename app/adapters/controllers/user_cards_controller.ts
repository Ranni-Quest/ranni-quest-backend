import UserCardEntity from '#entities/user_card.entity'
import GetUserCards from '#usecases/get_user_cards'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserCardsController {
  constructor(protected getUserCards: GetUserCards) {}

  async init({ auth, request, response }: HttpContext): Promise<UserCardEntity[] | void> {
    if (!(await auth.check())) {
      return response.status(401).json({ authenticated: false })
    }

    const { limit, offset } = request.qs()
    const discordId = auth.user?.discordId

    return await this.getUserCards.execute(discordId!, offset, limit)
  }
}
