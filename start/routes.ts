/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router
  .get('/api/:provider/callback', [
    () => import('#controllers/oauth_provider_callbacks_controller'),
    'init',
  ])
  .where('provider', /discord/)

router
  .get('/api/:provider/redirect', [
    () => import('#controllers/oauth_provider_redirects_controller'),
    'init',
  ])
  .where('provider', /discord/)

router.post('/api/login', [() => import('#controllers/login_controller'), 'init'])

router.get('/api/cards/pull/latest', [
  () => import('#controllers/latest_card_pulleds_controller'),
  'init',
])

router.get('/api/cards/set', [() => import('#controllers/cards_set_controller'), 'init'])

router.post('/api/cards/pull', [() => import('#controllers/pull_cards_controller'), 'init'])

router.post('/api/pokemons/summon', [
  () => import('#controllers/pokemon_summon_controller'),
  'init',
])

router.get('/api/pokemons/ladder', [() => import('#controllers/pokemon_ladder_controller'), 'init'])

router.get('/api/users/cards', [() => import('#controllers/user_cards_controller'), 'init'])

router.get('/api/users/pokemons', [() => import('#controllers/user_pokemons_controller'), 'init'])

router.post('/api/users/pokemons/pending/action', [
  () => import('#controllers/user_pokemon_action_controller'),
  'init',
])
