import UserCardEntity from '#entities/user_card.entity'
import { CardRepositoryInterface } from '#repositories/repositories.interface'
import UserCardInterface from '#usecases/interfaces/user_cards.interface'
import db from '@adonisjs/lucid/services/db'

export default class CardRepository implements CardRepositoryInterface {
  async findCardsSet(limit: number = 20, offset: number = 0): Promise<UserCardInterface[]> {
    const output = await db.rawQuery(`SELECT  
          u.pseudo, 
          uc.card_id, 
          c.rarity, 
          c.large_image_url, 
          c.small_image_url, 
          c.\`type\`, 
          c.subtype, 
          c.supertype, 
          e.effect, 
          e.rarity_effect, 
          s.set_id, 
          s.series
      FROM user_cards uc
      LEFT JOIN cards c ON uc.card_id = c.card_id
      LEFT JOIN effects e ON c.rarity = e.rarity
      LEFT JOIN users u ON uc.discord_id = u.discord_id
      LEFT JOIN settings s ON c.set_id = s.set_id
      WHERE s.set_id = c.set_id AND c.rarity NOT IN ('common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare')

      UNION

      SELECT 
        NULL AS pseudo, 
          c.card_id, 
          c.rarity, 
          c.large_image_url, 
          c.small_image_url, 
          c.\`type\`, 
          c.subtype, 
          c.supertype, 
          e.effect, 
          e.rarity_effect, 
          s.set_id, 
          s.series
      FROM cards c
      LEFT JOIN effects e ON c.rarity = e.rarity
      LEFT JOIN settings s ON c.set_id = s.set_id
      WHERE s.set_id = c.set_id AND c.rarity IN ('common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare')

      ORDER BY CAST(SUBSTRING_INDEX(card_id, '-', -1) AS UNSIGNED)
      LIMIT ${limit} OFFSET ${offset};`)

    return output[0].map((userCard: any) => {
      return new UserCardEntity(
        userCard.card_id,
        userCard.discord_id,
        userCard.pseudo,
        userCard.is_reverse,
        userCard.rarity,
        userCard.large_image_url,
        userCard.small_image_url,
        userCard.type,
        userCard.subtype,
        userCard.supertype,
        userCard.effect,
        userCard.rarity_effect,
        userCard.setId,
        userCard.series
      )
    })
  }
}
