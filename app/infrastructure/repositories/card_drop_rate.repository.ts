import CardDropRate from '#models/card_drop_rate.model'
import { CardDropRateRepositoryInterface } from '#repositories/repositories.interface'
import { BoosterRarityType } from '#types/rarities.type'

export default class CardDropRateRepository implements CardDropRateRepositoryInterface {
  /**
   * get cards drop rate
   * @param boosterRarity - booster rarity
   * @returns cards drop rate
   */
  async findCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]> {
    return await CardDropRate.query()
      .select('card_drop_rates.series', 'card_drop_rates.rarity', 'card_drop_rates.values')
      .join('settings', 'card_drop_rates.series', '=', 'settings.series')
      .whereNotNull('settings.series')
      .andWhere('rarity', boosterRarity)
  }
}
