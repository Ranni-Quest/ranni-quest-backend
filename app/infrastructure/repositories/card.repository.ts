import CardEntity from '#entities/card.entity'
import Card from '#models/card.model'
import UserCard from '#models/user_card.model'
import { CardRepositoryInterface } from '#repositories/repositories.interface'

export default class CardRepository implements CardRepositoryInterface {
  async findCardsSet(): Promise<CardEntity[]> {
    const output = await Card.query()
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

    return output.map(
      (card) =>
        new CardEntity(
          card.id,
          card.cardId,
          card.name,
          card.setId,
          card.setName,
          card.series,
          card.rarity,
          card.largeImageUrl,
          card.smallImageUrl,
          card.type,
          card.subtype,
          card.supertype
        )
    )
  }
}
