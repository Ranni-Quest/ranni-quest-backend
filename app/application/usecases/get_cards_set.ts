import UserCardEntity from '#entities/user_card.entity'
import UserCardRepository from '#repositories/user_card.repository'
import { GetCardsSetInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetCardsSet implements GetCardsSetInterface {
  constructor(private readonly userCardRepository: UserCardRepository) {}

  /**
   * Get cards set
   * @param limit
   * @param offset
   * @returns cards of the current set with user info if available
   */
  async execute(limit: number = 20, offset: number = 0): Promise<UserCardEntity[]> {
    return await this.userCardRepository.findCardsSet(limit, offset)
  }
}
