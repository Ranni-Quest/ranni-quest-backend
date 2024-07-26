import { SignIn } from '../access_manager/signin.mjs';
import { backendServer } from '../app.mjs';
import { Pull } from './pull.mjs';
import { Ladder } from './ladder.mjs';
import { MyCards } from './my_cards.mjs';
import { Summon } from './summon.mjs';
import { KeepPokemon } from './keep_pokemon.mjs';
import { PokemonOwn } from './pokemon_own.mjs';

export class Routing {
    static async init(logger) {
        backendServer.get('/api/discord/oauth', async (req, res) => {
            res.set('Cache-Control', 'no-store');
            logger.info('sign in ');
            SignIn.init(req, res);
        });

        backendServer.post('/api/invocation', async (req, res) => {
            res.set('Cache-Control', 'no-store');
            await new Pull().init(req, res);
        });

        backendServer.get('/api/ladder', async (req, res) => {
            await new Ladder().init(req, res);
        });

        backendServer.get('/api/users/cards', async (req, res) => {
            await new MyCards().init(req, res);
        });

        backendServer.post('/api/summon', async (req, res) => {
            await new Summon().init(req, res);
        });

        backendServer.post('/api/users/pokemon/keep', async (req, res) => {
            await new KeepPokemon().init(req, res);
        });

        backendServer.get('/api/users/pokemon', async (req, res) => {
            await new PokemonOwn().init(req, res);
        });
    }
}
