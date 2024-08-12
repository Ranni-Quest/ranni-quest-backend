import CardEntity from '#entities/card.entity'
import BoosterRarityRate from '#models/booster_rarity_rate.model'
import User from '#models/user.model'
import UserCard from '#models/user_card.model'
import { CardsSetType } from '#types/cards_set.type'
import { BoosterRarityType, CardRarityType } from '#types/rarities.type'
import CardService from './card.service.js'

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

export class PullService {
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

  static async pullCards(boosterRarity: BoosterRarityType, cardsSet: CardsSetType) {
    let summonedCards: Array<CardEntity> = []
    const cardsDropRate = await CardService.getCardsDropRate(boosterRarity)

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
    const rarity = PullService.getRandomRarity(sortedCardDropRates, cardsSet)
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
    console.log(rate, sortedCardDropRates)
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

  static async savePulledCards(discordId: string, pulledCards: Array<CardEntity>) {
    for (const card of pulledCards) {
      await UserCard.create({
        discordId,
        cardId: card.cardId,
        isReverse: false,
      })
    }
  }

  static async savePullTimestamp(discordId: string) {
    // log
    await User.updateOrCreate(
      {
        discordId,
      },
      {
        lastTimePull: Math.floor(Date.now() / 1000),
      }
    )
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
