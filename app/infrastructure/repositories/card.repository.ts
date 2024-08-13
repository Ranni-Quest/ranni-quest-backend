import CardEntity from '#entities/card.entity'
import { CardRepositoryInterface } from '#repositories/repositories.interface'
import db from '@adonisjs/lucid/services/db'

export default class CardRepository implements CardRepositoryInterface {
  async findCardsSet(): Promise<CardEntity[]> {
    const output = await db
      .query()
      .select(
        'cards.card_id',
        'cards.name',
        'cards.set_id',
        'cards.set_name',
        'cards.series',
        'cards.rarity',
        'effects.effect',
        'effects.rarity_effect',
        'cards.large_image_url',
        'cards.small_image_url',
        'cards.type',
        'cards.subtype',
        'cards.supertype'
      )
      .from('cards')
      .join('effects', 'cards.rarity', '=', 'effects.rarity')
      .join('settings', 'cards.set_id', '=', 'settings.set_id')
      .whereNotNull('settings.series')
      .andWhereNotIn(
        'card_id',
        db
          .query()
          .select('user_cards.card_id')
          .from('user_cards')
          .join('cards', 'user_cards.card_id', '=', 'cards.card_id')
          .whereNotIn('cards.rarity', ['common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare'])
      )
      .orderBy('cards.rarity', 'desc')

    return output.map(
      (card) =>
        new CardEntity(
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
    )
  }
}
