import CardEntity from '#entities/card.entity'
import CardRepository from '#repositories/card.repository'
import { PullService } from '#services/pull.service'
import { CardsSetType } from '#types/cards_set.type'
import { BoosterRarityType } from '#types/rarities.type'
import { inject } from '@adonisjs/core'
import { PullCardsInterface } from './usercases.interface.js'

@inject()
export default class PullCards implements PullCardsInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(discordId: string): Promise<CardEntity[]> {
    const boosterRarity: BoosterRarityType = await PullService.getRandomDrop()
    const cardsSet: CardsSetType = PullService.formatCardsSet(
      await this.cardRepository.findCardsSet()
    )
    const pulledCards = await PullService.pullCards(boosterRarity, cardsSet)

    PullService.savePulledCards(discordId, pulledCards)
    PullService.savePullTimestamp(discordId)

    return pulledCards
  }
}
