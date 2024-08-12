/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const OAuthProviderCallbacksController = () =>
  import('#controllers/oauth_provider_callbacks_controller')
const OAuthProviderRedirectsController = () =>
  import('#controllers/oauth_provider_redirects_controller')
const LatestCardPulledsController = () => import('#controllers/latest_card_pulleds_controller')
const PullCardsController = () => import('#controllers/pull_cards_controller')
const PokemonSummonController = () => import('#controllers/pokemon_summon_controller')
const UserCardsController = () => import('#controllers/user_cards_controller')
const UserPokemonsController = () => import('#controllers/user_pokemons_controller')
const UserPokemonKeepController = () => import('#controllers/user_pokemon_keep_controller')
const LoginController = () => import('#controllers/login_controller')
import router from '@adonisjs/core/services/router'

router
  .get('/api/:provider/callback', [OAuthProviderCallbacksController, 'init'])
  .where('provider', /discord/)

router
  .get('/api/:provider/redirect', [OAuthProviderRedirectsController, 'init'])
  .where('provider', /discord/)

router.post('/api/login', [LoginController, 'init'])

router.get('/api/cards/pull/latest', [LatestCardPulledsController, 'init'])

router.post('/api/cards/pull', [PullCardsController, 'init'])

router.post('/api/pokemons/summon', [PokemonSummonController, 'init'])

router.get('/api/users/cards', [UserCardsController, 'init'])

router.get('/api/users/pokemons', [UserPokemonsController, 'init'])

router.post('/api/users/pokemons/keep', [UserPokemonKeepController, 'init'])
