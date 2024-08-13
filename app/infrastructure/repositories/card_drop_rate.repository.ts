import CardDropRate from '#models/card_drop_rate.model'
import { CardDropRateRepositoryInterface } from '#repositories/repositories.interface'
import { BoosterRarityType } from '#types/rarities.type'

export default class CardDropRateRepository implements CardDropRateRepositoryInterface {
  async findCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]> {
    return await CardDropRate.query()
      .select('card_drop_rates.series', 'card_drop_rates.rarity', 'card_drop_rates.values')
      .join('settings', 'card_drop_rates.series', '=', 'settings.series')
      .whereNotNull('settings.series')
      .andWhere('rarity', boosterRarity)
    // return await await prisma.$queryRaw`SELECT s.series, rarity, \`values\`
    //         FROM carddroprates r
    //         LEFT JOIN settings s ON r.series = s.series
    //         WHERE s.series IS NOT NULL AND rarity=${boosterRarity}
    //         ORDER BY RAND()`
  }
}
