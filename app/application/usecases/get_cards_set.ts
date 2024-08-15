import CardRepository from '#repositories/card.repository'
import { inject } from '@adonisjs/core'
import { GetCardsSetInterface } from './usercases.interface.js'
import UserCardEntity from '#entities/user_card.entity'

@inject()
export default class GetCardsSet implements GetCardsSetInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(limit: number = 20, offset: number = 0): Promise<UserCardEntity[]> {
    return await this.cardRepository.findCardsSet(limit, offset)
  }
}
