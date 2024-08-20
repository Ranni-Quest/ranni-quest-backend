import FullCardInfoEntity from '#entities/full_card_info.entity'
import PokemonInfoEntity from '#entities/pokemon_info.entity'
import UserCardEntity from '#entities/user_card.entity'
import CardDropRate from '#models/card_drop_rate.model'
import PokemonDropRate from '#models/pokemon_drop_rate.model'
import PokemonPending from '#models/pokemon_pending.model'
import Setting from '#models/setting.model'
import CardDropRateRepository from '#repositories/card_drop_rate.repository'
import PokemonDropRateRepository from '#repositories/pokemon_drop_rate.repository'
import PokemonPendingRepository from '#repositories/pokemon_pending.repository'
import SettingRepository from '#repositories/setting.repository'
import UserRepository from '#repositories/user.repository'
import UserCardRepository from '#repositories/user_card.repository'
import UserPokemonRepository from '#repositories/user_pokemon.repository'
import type { BoosterRarityType } from '#types/rarities.type'

export class CardDropRateRepositoryMock implements CardDropRateRepository {
  async findCardsDropRate(boosterRarity: BoosterRarityType): Promise<CardDropRate[]> {
    return [
      {
        series: 'series',
        rarity: boosterRarity,
        values: {
          rare: 0,
          common: 1,
          uncommon: 0,
          hyper_rare: 0,
          shiny_rare: 0,
          ultra_rare: 0,
          double_rare: 0,
          shiny_ultra_rare: 0,
          illustration_rare: 0,
          special_illustration_rare: 0,
          illustration_rare_chromatic: 0,
        },
      },
      {
        series: 'series',
        rarity: boosterRarity,
        values: {
          rare: 0,
          common: 1,
          uncommon: 0,
          hyper_rare: 0,
          shiny_rare: 0,
          ultra_rare: 0,
          double_rare: 0,
          shiny_ultra_rare: 0,
          illustration_rare: 0,
          special_illustration_rare: 0,
          illustration_rare_chromatic: 0,
        },
      },
      {
        series: 'series',
        rarity: boosterRarity,
        values: {
          rare: 0,
          common: 0,
          uncommon: 1,
          hyper_rare: 0,
          shiny_rare: 0,
          ultra_rare: 0,
          double_rare: 0,
          shiny_ultra_rare: 0,
          illustration_rare: 0,
          special_illustration_rare: 0,
          illustration_rare_chromatic: 0,
        },
      },
      {
        series: 'series',
        rarity: boosterRarity,
        values: {
          rare: 0,
          common: 0,
          uncommon: 1,
          hyper_rare: 0,
          shiny_rare: 0,
          ultra_rare: 0,
          double_rare: 0,
          shiny_ultra_rare: 0,
          illustration_rare: 0,
          special_illustration_rare: 0,
          illustration_rare_chromatic: 0,
        },
      },
      {
        series: 'series',
        rarity: boosterRarity,
        values: {
          rare: 1,
          common: 0,
          uncommon: 0,
          hyper_rare: 0.013,
          shiny_rare: 0.3,
          ultra_rare: 0.0236,
          double_rare: 0.0606,
          shiny_ultra_rare: 0.02,
          illustration_rare: 0.046,
          special_illustration_rare: 0.0056,
          illustration_rare_chromatic: 0.0348,
        },
      },
    ] as CardDropRate[]
  }
}

export class PokemonDropRateRepositoryMock implements PokemonDropRateRepository {
  async findSummonDropRates(): Promise<PokemonDropRate[]> {
    return [
      {
        rarity: 'commun',
        dropRate: 1,
        pokemons: [112],
      },
    ] as PokemonDropRate[]
  }
}

export class PokemonPendingRepositoryMock implements PokemonPendingRepository {
  query(): typeof PokemonPending {
    return PokemonPending
  }

  async findByDiscordIdAndPokemonId(
    _discordId: string,
    _pokemonId: number
  ): Promise<PokemonInfoEntity> {
    return new PokemonInfoEntity(
      112,
      'Rhinoféros',
      'commun',
      false,
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/112.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png',
      ['ground', 'rock'],
      { water: 4, grass: 4, fighting: 2, ice: 2, ground: 2, steel: 2 },
      {
        normal: 0.5,
        fire: 0.5,
        electric: 0,
        poison: 0.25,
        flying: 0.5,
        rock: 0.5,
      },
      0
    )
  }

  async upsertPokemonPending(_discordId: string, _pokemonInfo: PokemonInfoEntity): Promise<void> {}
}

export class SettingRepositoryMock implements SettingRepository {
  async getSetting(): Promise<Setting> {
    return {
      series: 'series',
      setId: 'set_id',
      setUrl: 'set_url',
      pullTimer: 1800,
      summonTimer: 600,
      shinyDropRate: 0,
    } as Setting
  }
}

export class UserCardRepositoryMock implements UserCardRepository {
  async findCardsSet(_limit: number = 20, _offset: number = 0): Promise<UserCardEntity[]> {
    return [
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
    ]
  }

  async findLeftCardsInCurrentSet(): Promise<FullCardInfoEntity[]> {
    return [
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
    ]
  }

  async findByDiscordId(
    _discordId: string,
    _offset: number,
    _limit: number
  ): Promise<UserCardEntity[]> {
    return [
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
    ]
  }

  async findLatestCardsPulled(): Promise<UserCardEntity[]> {
    return [
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
    ]
  }

  async savePulledCard(_discordId: string, _cardId: string): Promise<void> {}
}

export class UserPokemonRepositoryMock implements UserPokemonRepository {
  async findByDiscordId(_discordId: string): Promise<PokemonInfoEntity[]> {
    return [
      new PokemonInfoEntity(
        112,
        'Rhinoféros',
        'commun',
        false,
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/112.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png',
        ['ground', 'rock'],
        { water: 4, grass: 4, fighting: 2, ice: 2, ground: 2, steel: 2 },
        {
          normal: 0.5,
          fire: 0.5,
          electric: 0,
          poison: 0.25,
          flying: 0.5,
          rock: 0.5,
        },
        0
      ),
    ]
  }

  async upsertPokemon(_discordId: string, _pokemonId: number): Promise<void> {}

  async countByDiscordId(_discordId: string): Promise<number> {
    return 1
  }

  async createUserPokemon(_discordId: string, _pokemonInfo: PokemonInfoEntity): Promise<void> {}

  async updateUserPokemon(
    _discordId: string,
    _pokemonIdToReplace: number,
    _pokemonInfo: PokemonInfoEntity
  ): Promise<void> {}

  async findAll(): Promise<{ [key: string]: PokemonInfoEntity[] }> {
    return {}
  }
}

export class UserRepositoryMock implements UserRepository {
  async savePullTimestamp(_discordId: string): Promise<void> {}

  async saveSummonTimestamp(_discordId: string): Promise<void> {}
}
