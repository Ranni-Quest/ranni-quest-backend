import UserCardRepository from '#repositories/user_card.repository'
import {
  CardDropRateRepositoryMock,
  UserCardRepositoryMock,
  UserRepositoryMock,
} from '#tests/mock/repositories.mock'
import PullCards from '#usecases/pull_cards'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import assert from 'node:assert'

test('GetCardsSet use case returns mock data', async () => {
  app.container.swap(UserCardRepository, () => {
    return new UserCardRepositoryMock()
  })

  const repository = await app.container.make(UserCardRepository)
  const result = await repository.findCardsSet(2, 0)

  assert.deepEqual(result, [
    {
      cardId: 'card_id-1',
      discordId: 'discord_id-1',
      pseudo: 'pseudo-1',
      isReverse: false,
      rarity: 'common',
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
      rarity: 'common',
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
      rarity: 'common',
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
  ])
})

test('Pull cards', async () => {
  const pullCards = new PullCards(
    new CardDropRateRepositoryMock(),
    new UserRepositoryMock(),
    new UserCardRepositoryMock()
  )

  const result = await pullCards.execute('discord_id-1')

  assert.deepEqual(result, [
    {
      cardId: 'card_id-3',
      name: 'name',
      setId: 'set_id',
      setName: 'set_name',
      series: 'series',
      rarity: 'common',
      effect: 'effect',
      rarityEffect: 'rarity_effect',
      largeImageUrl: 'large_image_url',
      smallImageUrl: 'small_image_url',
      type: 'type',
      subtype: 'subtype',
      supertype: 'supertype',
    },
    {
      cardId: 'card_id-3',
      name: 'name',
      setId: 'set_id',
      setName: 'set_name',
      series: 'series',
      rarity: 'common',
      effect: 'effect',
      rarityEffect: 'rarity_effect',
      largeImageUrl: 'large_image_url',
      smallImageUrl: 'small_image_url',
      type: 'type',
      subtype: 'subtype',
      supertype: 'supertype',
    },
    {
      cardId: 'card_id-3',
      name: 'name',
      setId: 'set_id',
      setName: 'set_name',
      series: 'series',
      rarity: 'common',
      effect: 'effect',
      rarityEffect: 'rarity_effect',
      largeImageUrl: 'large_image_url',
      smallImageUrl: 'small_image_url',
      type: 'type',
      subtype: 'subtype',
      supertype: 'supertype',
    },
    {
      cardId: 'card_id-3',
      name: 'name',
      setId: 'set_id',
      setName: 'set_name',
      series: 'series',
      rarity: 'common',
      effect: 'effect',
      rarityEffect: 'rarity_effect',
      largeImageUrl: 'large_image_url',
      smallImageUrl: 'small_image_url',
      type: 'type',
      subtype: 'subtype',
      supertype: 'supertype',
    },
    {
      cardId: 'card_id-3',
      name: 'name',
      setId: 'set_id',
      setName: 'set_name',
      series: 'series',
      rarity: 'common',
      effect: 'effect',
      rarityEffect: 'rarity_effect',
      largeImageUrl: 'large_image_url',
      smallImageUrl: 'small_image_url',
      type: 'type',
      subtype: 'subtype',
      supertype: 'supertype',
    },
  ])
})
