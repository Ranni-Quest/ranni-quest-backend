import UserCardEntity from '#entities/user_card.entity'
import UserCardRepository from '#repositories/user_card.repository'
import { GetUserCardsInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetUserCards implements GetUserCardsInterface {
  constructor(private readonly userCardRepository: UserCardRepository) {}

  /**
   * Get user cards
   * @param discordId - discord id
   * @param offset - offset
   * @param limit - limit
   * @returns user cards
   */
  async execute(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]> {
    return await this.userCardRepository.findByDiscordId(discordId, offset, limit)
  }
}
