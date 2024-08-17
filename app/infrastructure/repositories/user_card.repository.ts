import FullCardInfoEntity from '#entities/full_card_info.entity'
import UserCardEntity from '#entities/user_card.entity'
import { UserCardRepositoryInterface } from '#repositories/repositories.interface'
import db from '@adonisjs/lucid/services/db'
import UserCard from '../models/user_card.model.js'

export default class UserCardRepository implements UserCardRepositoryInterface {
  /**
   * get cards set
   * @param limit - limit
   * @param offset - offset
   * @returns cards set
   */
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

  /**
   * get left cards in current set
   * @returns left cards in current set
   */
  async findLeftCardsInCurrentSet(): Promise<FullCardInfoEntity[]> {
    const output = await db.rawQuery(
      `SELECT 
        c.card_id, 
        c.name, 
        s.set_id, 
        c.set_name, 
        c.series, 
        c.rarity, 
        e.effect, 
        e.rarity_effect, 
        c.large_image_url, 
        c.small_image_url, 
        c.\`type\`, 
        c.subtype, 
        c.supertype
      FROM cards c
      LEFT JOIN effects e ON c.rarity = e.rarity
      LEFT JOIN settings s ON c.set_id = s.set_id
      WHERE s.set_id IS NOT NULL AND c.card_id NOT IN (
        SELECT uc.cardId
        LEFT JOIN cards c ON uc.card_id = c.card_id
        WHERE rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' ) AND uc.card_id IS NOT NULL
      ) ORDER BY c.rarity`
    )

    return output[0].map((card: any) => {
      return new FullCardInfoEntity(
        card.card_id,
        card.name,
        card.set_id,
        card.set_name,
        card.series,
        card.rarity,
        card.effect,
        card.rarity_effect,
        card.large_image_url,
        card.small_image_url,
        card.type,
        card.subtype,
        card.supertype
      )
    })
  }

  /**
   * get cards by discord id
   * @param discordId - discord id
   * @param offset - offset
   * @param limit - limit
   * @returns
   */
  async findByDiscordId(
    discordId: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<UserCardEntity[]> {
    const output = await db.rawQuery(`
            SELECT pseudo, u.discord_id, uc.card_id, c.rarity, large_image_url, small_image_url, \`type\`, subtype, supertype, effect, rarity_effect, set_id, series, is_reverse
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

  /**
   * get latest cards pulled
   * @returns latest cards pulled
   */
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

  /**
   * save pulled card
   * @param discordId - discord id
   * @param cardId - card id
   */
  async savePulledCard(discordId: string, cardId: string): Promise<void> {
    await UserCard.create({
      discordId,
      cardId: cardId,
      isReverse: false,
    })
  }
}
