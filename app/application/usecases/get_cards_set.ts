import CardRepository from '#repositories/card.repository'
import { inject } from '@adonisjs/core'
import UserCardInterface from './interfaces/user_cards.interface.js'
import { GetCardsSetInterface } from './usercases.interface.js'

@inject()
export default class GetCardsSet implements GetCardsSetInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(limit: number = 20, offset: number = 0): Promise<UserCardInterface[]> {
    return await this.cardRepository.findCardsSet(limit, offset)
  }
}
