import FullCardInfoEntity from '#entities/full_card_info.entity'
import type { CardDropRatesValueInterface } from '#entities/interfaces/card_drop_rate_value.interface'
import BoosterRarityRate from '#models/booster_rarity_rate.model'
import CardDropRate from '#models/card_drop_rate.model'
import type { CardsSetType } from '#types/cards_set.type'
import type { BoosterRarityType, CardRarityType } from '#types/rarities.type'

export class CardService {
  /**
   * Get a random rarity from the booster drop rate
   * @param boosterRarityDropRates - drop rate of all rarities
   * @returns - A random rarity
   */
  static getRandomRarityBooster(boosterRarityDropRates: BoosterRarityRate[]): BoosterRarityType {
    const probability = Math.random()

    for (const rarity of boosterRarityDropRates) {
      if (rarity.dropRate > probability) {
        return rarity.name as BoosterRarityType
      }
    }

    return 'normal' as BoosterRarityType
  }

  /**
   * Pull random cards from the cards set
   * @param cardsSet - Cards of the current set
   * @param cardsDropRate - drop rate of all cards
   * @returns - Array of random cards
   */
  static pullCards(cardsSet: CardsSetType, cardsDropRate: CardDropRate[]): FullCardInfoEntity[] {
    let pulledCards: FullCardInfoEntity[] = []

    for (let rarityRate of cardsDropRate) {
      let card = this.getRandomCard(rarityRate.values as CardDropRatesValueInterface, cardsSet)
      pulledCards.push(card)
    }

    return pulledCards
  }

  /**
   * Get a random card from the cards set
   * @param cardDropRates - drop rate of one rarity cards
   * @param currentCardsSet - Cards of the current set
   * @returns - A random card
   */
  static getRandomCard(
    cardDropRates: CardDropRatesValueInterface,
    currentCardsSet: CardsSetType
  ): FullCardInfoEntity {
    let sortedCardDropRates: Array<[CardRarityType, number]> = Object.entries(
      cardDropRates
    ) as Array<[CardRarityType, number]>
    sortedCardDropRates = sortedCardDropRates.sort((a, b) => a[1] - b[1])

    const cards = currentCardsSet[CardService.getRandomRarity(sortedCardDropRates, currentCardsSet)]

    if (cards?.length === 0 || !cards) {
      throw 'CardService.pullCards: No card'
    }

    return cards[Math.floor(Math.random() * cards.length)]
  }

  /**
   * Get a random rarity from the cards set
   * @param cardDropRates - drop rate of all cards
   * @param cardsSet - Cards of the current set
   * @returns - A random rarity
   */
  static getRandomRarity(
    cardDropRates: Array<[CardRarityType, number]>,
    cardsSet: CardsSetType
  ): CardRarityType {
    const rate = Math.random()

    for (const cardRarity of cardDropRates) {
      if (!Object.keys(cardsSet).includes(cardRarity[0]) || cardsSet[cardRarity[0]]?.length === 0) {
        continue
      }

      if (rate < cardRarity[1]) {
        return cardRarity[0]
      }
    }

    return 'common'
  }

  /**
   * Format the cards set sorted by rarity
   * @param outputCardsSet - Cards of the current set
   * @returns - The formatted cards set
   */
  static formatCardsSet(outputCardsSet: FullCardInfoEntity[]): CardsSetType {
    let cardsSet: CardsSetType = {}

    for (let card of outputCardsSet) {
      if (!Object.keys(cardsSet).includes(card.rarity as CardRarityType)) {
        cardsSet[card.rarity as CardRarityType] = []
      }

      cardsSet[card.rarity as CardRarityType]?.push(card)
    }

    return cardsSet
  }
}
