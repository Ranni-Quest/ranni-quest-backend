import UserCardEntity from '#entities/user_card.entity'
import UserCardRepository from '#repositories/user_card.repository'

export class FakeUserCardRepository implements UserCardRepository {
  async findCardsSet(limit: number = 20, offset: number = 0): Promise<UserCardEntity[]> {
    return [
      {
        cardId: 'card_id-1',
        discordId: 'discord_id-1',
        pseudo: 'pseudo-1',
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
      {
        cardId: 'card_id-2',
        discordId: 'discord_id-2',
        pseudo: 'pseudo-2',
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
      {
        cardId: 'card_id-3',
        discordId: null,
        pseudo: null,
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
    ]
  }

  async findByDiscordId(
    discordId: string,
    offset: number,
    limit: number
  ): Promise<UserCardEntity[]> {
    return [
      {
        cardId: 'card_id-1',
        discordId: 'discord_id',
        pseudo: 'pseudo',
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
      {
        cardId: 'card_id-2',
        discordId: 'discord_id',
        pseudo: 'pseudo',
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
    ]
  }

  async findLatestCardsPulled(): Promise<UserCardEntity[]> {
    return [
      {
        cardId: 'card_id-1',
        discordId: 'discord_id',
        pseudo: 'pseudo',
        isReverse: false,
        rarity: 'rarity',
        largeImageUrl: 'large_image_url',
        smallImageUrl: 'small_image_url',
        type: 'type',
        subtype: 'subtype',
        supertype: 'supertype',
        effect: 'effect',
        rarityEffect: 'rarity_effect',
        setId: 'set_id',
        series: 'series',
      },
    ]
  }

  async savePulledCard(discordId: string, cardId: string): Promise<void> {}
}
