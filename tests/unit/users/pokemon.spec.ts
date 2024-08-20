import PokemonInfoEntity from '#entities/pokemon_info.entity'
import {
  PokemonDropRateRepositoryMock,
  PokemonPendingRepositoryMock,
  SettingRepositoryMock,
  UserPokemonRepositoryMock,
  UserRepositoryMock,
} from '#tests/mock/repositories.mock'
import KeepUserPokemon from '#usecases/keep_user_pokemon'
import SummonPokemon from '#usecases/summon_pokemon'
import { test } from '@japa/runner'
import assert from 'node:assert'

test('summon pokemon', async () => {
  const summonPokemon = new SummonPokemon(
    new PokemonDropRateRepositoryMock(),
    new PokemonPendingRepositoryMock(),
    new UserPokemonRepositoryMock(),
    new UserRepositoryMock()
  )
  const setting = await new SettingRepositoryMock().getSetting()

  const res = await summonPokemon.execute(setting, 'discord-id')

  assert.deepEqual(res, {
    pokemonId: 112,
    name: 'Rhinoféros',
    status: 'common',
    isShiny: false,
    artwork:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/112.png',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png',
    types: ['ground', 'rock'],
    weaknesses: { water: 4, grass: 4, fighting: 2, ice: 2, ground: 2, steel: 2 },
    resistances: {
      normal: 0.5,
      fire: 0.5,
      electric: 0,
      poison: 0.25,
      flying: 0.5,
      rock: 0.5,
    },
    timestamp: 0,
  })
})

test('action pokemon', async () => {
  const actionPokemon = new KeepUserPokemon(
    new UserPokemonRepositoryMock(),
    new PokemonPendingRepositoryMock()
  )

  const res = await actionPokemon.execute(
    'discord-id',
    new PokemonInfoEntity(
      112,
      'Rhinoféros',
      'common',
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
  )

  assert.equal(res, true)
})
