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
import PokemonService from '#services/pokemon.service'
import { BoosterRarityType } from '#types/rarities.type'

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
        rarity: 'subLegendary',
        dropRate: 0.03,
        pokemons: [
          144, 145, 146, 243, 244, 245, 377, 378, 379, 380, 381, 480, 481, 482, 485, 486, 488, 638,
          639, 640, 641, 642, 645, 772, 773, 785, 786, 787, 788, 793, 794, 795, 796, 797, 798, 799,
          800, 803, 804, 805, 806, 891, 892, 894, 895, 896, 897, 905, 1001, 1002, 1003, 1004, 1014,
          1015, 1016, 1017,
        ],
      },
    ] as PokemonDropRate[]
  }
}

export class PokemonPendingRepositoryMock implements PokemonPendingRepository {
  query(): typeof PokemonPending {
    return PokemonPending
  }

  async findByDiscordIdAndPokemonId(
    discordId: string,
    pokemonId: number
  ): Promise<PokemonInfoEntity> {
    return new PokemonInfoEntity(
      1,
      'name',
      'status',
      false,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/}1.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`,
      ['normal'],
      PokemonService.calculateWeaknesses(['normal']),
      PokemonService.calculatResistances(['normal']),
      0
    )
  }

  async upsertPokemonPending(discordId: string, pokemonInfo: PokemonInfoEntity): Promise<void> {}
}

export class SettingRepositoryMock implements SettingRepository {
  async getSetting(): Promise<Setting> {
    return {
      series: 'series',
      setId: 'set_id',
      setUrl: 'set_url',
      pullTimer: 1800,
      summonTimer: 600,
      shinyDropRate: 0.05,
    } as Setting
  }
}

export class UserCardRepositoryMock implements UserCardRepository {
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

  async findLeftCardsInCurrentSet(): Promise<FullCardInfoEntity[]> {
    return [
      {
        cardId: 'card_id-3',
        name: 'name',
        setId: 'set_id',
        setName: 'set_name',
        series: 'series',
        rarity: 'rarity',
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
    discordId: string,
    offset: number,
    limit: number
  ): Promise<UserCardEntity[]> {
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
    ]
  }

  async findLatestCardsPulled(): Promise<UserCardEntity[]> {
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
    ]
  }

  async savePulledCard(discordId: string, cardId: string): Promise<void> {}
}

export class UserPokemonRepositoryMock implements UserPokemonRepository {
  async findByDiscordId(discordId: string): Promise<PokemonInfoEntity[]> {
    return [
      new PokemonInfoEntity(
        1,
        'name',
        'status',
        false,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`,
        ['normal'],
        PokemonService.calculateWeaknesses(['normal']),
        PokemonService.calculatResistances(['normal']),
        0
      ),
    ]
  }

  async upsertPokemon(discordId: string, pokemonId: number): Promise<void> {}

  async countByDiscordId(discordId: string): Promise<number> {
    return 1
  }

  async createUserPokemon(discordId: string, pokemonInfo: PokemonInfoEntity): Promise<void> {}

  async updateUserPokemon(
    discordId: string,
    pokemonIdToReplace: number,
    pokemonInfo: PokemonInfoEntity
  ): Promise<void> {}
}

export class UserRepositoryMock implements UserRepository {
  async savePullTimestamp(discordId: string): Promise<void> {}

  async saveSummonTimestamp(discordId: string): Promise<void> {}
}
