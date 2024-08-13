import UserCardEntity from '#entities/user_card.entity'
import { UserCardRepositoryInterface } from '#repositories/repositories.interface'
import UserCardInterface from '#usecases/interfaces/user_cards.interface'
import db from '@adonisjs/lucid/services/db'
import UserCard from '../models/user_card.model.js'

export default class UserCardRepository implements UserCardRepositoryInterface {
  async findByDiscordId(
    discordId: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<UserCardEntity[]> {
    const output = await db.rawQuery(`
            SELECT  uc.card_id, c.rarity, large_image_url, small_image_url, \`type\`, subtype, supertype, effect, rarity_effect, set_id, series, is_reverse
            FROM user_cards uc
            LEFT JOIN cards c ON uc.card_id = c.card_id
            LEFT JOIN effects e ON c.rarity = e.rarity
            WHERE discord_id = '${discordId}'
            ORDER BY CASE 
                WHEN e.rarity_effect = 'rainbow' then 1
                WHEN e.rarity_effect = 'gold' then 2
                WHEN e.rarity_effect = 'silver' then 3
                WHEN c.rarity = 'rare' then 4
                WHEN e.rarity_effect = 'none' then 5
            END, uc.card_id ASC
            LIMIT ${limit}
            OFFSET ${offset}`)

    let count = 1
    return output[0].map((userCard: any) => {
      count++
      return new UserCardEntity(
        userCard.card_id,
        userCard.discord_id,
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

  async findLatestCardsPulled(): Promise<UserCardInterface[]> {
    return (await db
      .query()
      .select(
        'users.pseudo',
        'cards.card_id',
        'cards.rarity',
        'cards.large_image_url as largeImageUrl',
        'cards.type',
        'cards.subtype',
        'cards.supertype',
        'effects.effect',
        'effects.rarity_effect as rarityEffect',
        'cards.set_id',
        'cards.series'
      )
      .from('user_cards')
      .join('cards', 'user_cards.card_id', '=', 'cards.card_id')
      .join('effects', 'cards.rarity', '=', 'effects.rarity')
      .join('users', 'user_cards.discord_id', '=', 'users.discord_id')
      .whereNotIn('cards.rarity', ['common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare'])
      .andWhereNotNull('user_cards.card_id')
      .orderBy('user_cards.id', 'desc')
      .limit(10)) as unknown as UserCardInterface[]
  }

  async savePulledCard(discordId: string, cardId: string): Promise<void> {
    await UserCard.create({
      discordId,
      cardId: cardId,
      isReverse: false,
    })
  }
}
