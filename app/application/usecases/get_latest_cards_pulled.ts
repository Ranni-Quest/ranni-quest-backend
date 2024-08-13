import UserCardRepository from '#repositories/user_card.repository'
import { inject } from '@adonisjs/core'
import UserCardInterface from './interfaces/user_cards.interface.js'
import { GetLatestCardsPulledInterface } from './usercases.interface.js'

@inject()
export default class GetLatestCardsPulled implements GetLatestCardsPulledInterface {
  constructor(protected userCardsRepository: UserCardRepository) {}

  async execute(): Promise<UserCardInterface[]> {
    return await this.userCardsRepository.findLatestCardsPulled()
  }
}
