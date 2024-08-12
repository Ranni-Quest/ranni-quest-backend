import CardEntity from '#entities/card.entity'
import CardDropRate from '#models/card_drop_rate.model'
import CardRepository from '#repositories/card.repository'
import CardDropRateRepository from '#repositories/card_drop_rate.repository'
import UserRepository from '#repositories/user.repository'
import UserCardRepository from '#repositories/user_card.repository'
import { PullService } from '#services/pull.service'
import { CardsSetType } from '#types/cards_set.type'
import { inject } from '@adonisjs/core'
import { PullCardsInterface } from './usercases.interface.js'

@inject()
export default class PullCards implements PullCardsInterface {
  constructor(
    protected cardRepository: CardRepository,
    protected cardDropRateRepository: CardDropRateRepository,
    protected userRepository: UserRepository,
    protected userCardRepository: UserCardRepository
  ) {}

  async execute(discordId: string): Promise<CardEntity[]> {
    const cardsDropRate: CardDropRate[] = await this.cardDropRateRepository.findCardsDropRate(
      await PullService.getRandomDrop()
    )
    const cardsSet: CardsSetType = PullService.formatCardsSet(
      await this.cardRepository.findCardsSet()
    )
    const pulledCards = await PullService.pullCards(cardsSet, cardsDropRate)

    this.userRepository.savePullTimestamp(discordId)

    for (let card of pulledCards) {
      await this.userCardRepository.savePulledCard(discordId, card.cardId)
    }

    this.userRepository.savePullTimestamp(discordId)

    return pulledCards
  }
}
