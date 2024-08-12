import Card from '#models/card.model'
import CardDropRate from '#models/card_drop_rate.model'
import UserCard from '#models/user_card.model'
import { BoosterRarityType } from '../types/rarities.type.js'

export default class CardService {
  static async getCardsSet(): Promise<Card[]> {
    return await Card.query()
      .join('effects', 'cards.rarity', '=', 'effects.rarity')
      .join('settings', 'cards.set_id', '=', 'settings.set_id')
      .whereNotNull('settings.series')
      .andWhereNotIn(
        'card_id',
        UserCard.query()
          .select('user_cards.card_id')
          .from('user_cards')
          .join('cards', 'user_cards.card_id', '=', 'cards.card_id')
          .whereNotIn('cards.rarity', ['common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare'])
      )
      .orderBy('rarity', 'desc')
    // return await prisma.$queryRaw`SELECT *
    //             FROM cards c
    //             LEFT JOIN effects e ON c.rarity = e.rarity
    //             LEFT JOIN settings s ON c.setId = s.setId
    //             WHERE s.setId IS NOT NULL AND c.cardId NOT IN (
    //                 SELECT uc.cardId
    //                             FROM userscards uc
    //                             LEFT JOIN cards c ON uc.cardId = c.cardId
    //                             WHERE rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' ) AND uc.cardId IS NOT NULL
    //             ) ORDER BY c.rarity`
  }

  static async getCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]> {
    return await CardDropRate.query()
      .select('series', 'rarity', 'values')
      .join('settings', 'card_drop_rates.series', '=', 'settings.series')
      .whereNotNull('settings.series')
      .andWhere('rarity', boosterRarity)
      .orderBy('RAND()')
    // return await await prisma.$queryRaw`SELECT s.series, rarity, \`values\`
    //         FROM carddroprates r
    //         LEFT JOIN settings s ON r.series = s.series
    //         WHERE s.series IS NOT NULL AND rarity=${boosterRarity}
    //         ORDER BY RAND()`
  }
}
