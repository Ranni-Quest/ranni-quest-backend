import UserCardEntity from '#entities/user_card.entity'
import { UserCardRepositoryInterface } from '#repositories/repositories.interface'
import UserCardInterface from '#usecases/interfaces/user_cards.interface'
import db from '@adonisjs/lucid/services/db'
import UserCard from '../models/user_card.model.js'

export default class UserCardRepository implements UserCardRepositoryInterface {
  async findByDiscordId(
    discordId: string,
    offset: number = 0,
    limit: number = 10
  ): Promise<UserCardEntity[]> {
    const output = await UserCard.query().where('discord_id', discordId).offset(offset).limit(limit)

    return output.map(
      (userCard) =>
        new UserCardEntity(userCard.id, userCard.cardId, userCard.discordId, userCard.isReverse)
    )
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
