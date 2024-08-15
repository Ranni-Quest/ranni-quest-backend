import CardEntity from '#entities/card.entity'
import CardDropRate from '#models/card_drop_rate.model'
import { CardsSetType } from '#types/cards_set.type'
import { BoosterRarityType, CardRarityType } from '#types/rarities.type'
import BoosterRarityRate from '../infrastructure/models/booster_rarity_rate.model.js'

interface CardDropRatesValueInterface {
  rare: number
  common: number
  uncommon: number
  hyper_rare: number
  ultra_rare: number
  double_rare: number
  illustration_rare: number
  special_illustration_rare: number
  illustration_rare_chromatic: 0
}

export class CardService {
  static async getRandomDrop(): Promise<BoosterRarityType> {
    const boosterRarityDropRates = await BoosterRarityRate.query().orderBy('dropRate', 'asc')

    const probability = Math.random()

    for (const rarity of boosterRarityDropRates) {
      if (rarity.dropRate > probability) {
        return rarity.name as BoosterRarityType
      }
    }

    return 'normal' as BoosterRarityType
  }

  static async pullCards(cardsSet: CardsSetType, cardsDropRate: CardDropRate[]) {
    let summonedCards: Array<CardEntity> = []

    for (let rarityRate of cardsDropRate) {
      let card = await this.getRandomCard(
        rarityRate.values as CardDropRatesValueInterface,
        cardsSet
      )
      summonedCards.push(card)
    }

    return summonedCards
  }

  static async getRandomCard(
    cardDropRates: CardDropRatesValueInterface,
    cardsSet: CardsSetType
  ): Promise<CardEntity> {
    let sortedCardDropRates: Array<[CardRarityType, number]> = Object.entries(
      cardDropRates
    ) as Array<[CardRarityType, number]>
    sortedCardDropRates = sortedCardDropRates.sort((a, b) => a[1] - b[1])
    const rarity = CardService.getRandomRarity(sortedCardDropRates, cardsSet)
    const cardsRarity = cardsSet[rarity]

    if (cardsRarity?.length === 0 || !cardsRarity) {
      throw 'No card'
    }

    let card = cardsRarity[Math.floor(Math.random() * cardsRarity.length)]

    return card
  }

  static getRandomRarity(
    sortedCardDropRates: Array<[CardRarityType, number]>,
    cardsSet: CardsSetType
  ): CardRarityType {
    const rate = Math.random()

    for (const cardRarity of sortedCardDropRates) {
      if (!Object.keys(cardsSet).includes(cardRarity[0]) || cardsSet[cardRarity[0]]?.length === 0) {
        continue
      }

      if (rate < cardRarity[1]) {
        return cardRarity[0]
      }
    }

    return 'common'
  }

  static formatCardsSet(outputCardsSet: CardEntity[]): CardsSetType {
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
