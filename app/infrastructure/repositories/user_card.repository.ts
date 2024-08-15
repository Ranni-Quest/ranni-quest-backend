import UserCardEntity from '#entities/user_card.entity'
import { UserCardRepositoryInterface } from '#repositories/repositories.interface'
import db from '@adonisjs/lucid/services/db'
import UserCard from '../models/user_card.model.js'

export default class UserCardRepository implements UserCardRepositoryInterface {
  async findCardsSet(limit: number = 20, offset: number = 0): Promise<UserCardEntity[]> {
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

  async findByDiscordId(
    discordId: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<UserCardEntity[]> {
    const output = await db.rawQuery(`
            SELECT pseudo,u.discord_id, uc.card_id, c.rarity, large_image_url, small_image_url, \`type\`, subtype, supertype, effect, rarity_effect, set_id, series, is_reverse
            FROM user_cards uc
            LEFT JOIN cards c ON uc.card_id = c.card_id
            LEFT JOIN effects e ON c.rarity = e.rarity
            LEFT JOIN users u ON uc.discord_id = u.discord_id
            WHERE u.discord_id = '${discordId}'
            ORDER BY CASE 
                WHEN e.rarity_effect = 'rainbow' then 1
                WHEN e.rarity_effect = 'gold' then 2
                WHEN e.rarity_effect = 'silver' then 3
                WHEN c.rarity = 'rare' then 4
                WHEN e.rarity_effect = 'none' then 5
            END, uc.card_id ASC
            LIMIT ${limit}
            OFFSET ${offset}`)

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

  async findLatestCardsPulled(): Promise<UserCardEntity[]> {
    const output = await db.rawQuery(`
        SELECT pseudo, u.discord_id, uc.card_id, c.rarity, large_image_url, small_image_url, \`type\`, subtype, supertype, effect, rarity_effect, set_id, series, is_reverse
        FROM user_cards uc
        JOIN cards c ON uc.card_id = c.card_id
        JOIN effects e ON c.rarity = e.rarity
        JOIN users u ON uc.discord_id = u.discord_id
        WHERE c.rarity NOT IN ('common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare') AND uc.card_id IS NOT NULL
        ORDER BY uc.id DESC
        LIMIT 10;`)

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

  async savePulledCard(discordId: string, cardId: string): Promise<void> {
    await UserCard.create({
      discordId,
      cardId: cardId,
      isReverse: false,
    })
  }
}
