import UserCardEntity from '#entities/user_card.entity'
import UserCardRepository from '#repositories/user_card.repository'
import { GetLatestCardsPulledInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetLatestCardsPulled implements GetLatestCardsPulledInterface {
  constructor(protected userCardsRepository: UserCardRepository) {}

  /**
   * Get latest cards pulled
   * @returns latest cards pulled
   */
  async execute(): Promise<UserCardEntity[]> {
    return await this.userCardsRepository.findLatestCardsPulled()
  }
}
