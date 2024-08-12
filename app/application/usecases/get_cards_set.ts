import CardEntity from '#entities/card.entity'
import CardRepository from '#repositories/card.repository'
import { inject } from '@adonisjs/core'
import { GetCardsSetInterface } from './usercases.interface.js'

@inject()
export default class GetCardsSet implements GetCardsSetInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(): Promise<CardEntity[]> {
    return await this.cardRepository.findCardsSet()
  }
}
