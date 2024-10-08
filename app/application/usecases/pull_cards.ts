import FullCardInfoEntity from '#entities/full_card_info.entity'
import BoosterRarityRate from '#models/booster_rarity_rate.model'
import CardDropRate from '#models/card_drop_rate.model'
import CardDropRateRepository from '#repositories/card_drop_rate.repository'
import UserRepository from '#repositories/user.repository'
import UserCardRepository from '#repositories/user_card.repository'
import { CardService } from '#services/card.service'
import type { CardsSetType } from '#types/cards_set.type'
import type { BoosterRarityType } from '#types/rarities.type'
import { PullCardsInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class PullCards implements PullCardsInterface {
  constructor(
    protected cardDropRateRepository: CardDropRateRepository,
    protected userRepository: UserRepository,
    protected userCardRepository: UserCardRepository
  ) {}

  /**
   * generate booster rarity
   * get cards left in current set
   * pull x random cards
   * @param discordId - discord id
   * @returns pulled cards
   */
  async execute(discordId: string): Promise<FullCardInfoEntity[]> {
    const boosterRarityDropRates: BoosterRarityRate[] = await BoosterRarityRate.query().orderBy(
      'dropRate',
      'asc'
    )
    const boosterRarity: BoosterRarityType =
      CardService.getRandomRarityBooster(boosterRarityDropRates)
    const cardsDropRate: CardDropRate[] =
      await this.cardDropRateRepository.findCardsDropRate(boosterRarity)

    const leftCardsInCurrentSet: FullCardInfoEntity[] =
      await this.userCardRepository.findLeftCardsInCurrentSet()
    const cardsSet: CardsSetType = CardService.formatCardsSet(leftCardsInCurrentSet)

    const pulledCards: FullCardInfoEntity[] = CardService.pullCards(cardsSet, cardsDropRate)

    this.userRepository.savePullTimestamp(discordId)

    for (let card of pulledCards) {
      await this.userCardRepository.savePulledCard(discordId, card.cardId)
    }

    return pulledCards
  }
}
