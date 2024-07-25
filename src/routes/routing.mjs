import { SignIn } from '../access_manager/signin.mjs';
import { backendServer } from '../app.mjs';
import { Invocation } from './invocation.mjs';
import { Ladder } from './ladder.mjs';
import { MyCards } from './my_cards.mjs';

export class Routing {
    static async init(logger) {
        backendServer.get('/api/discord/oauth', async (req, res) => {
            res.set('Cache-Control', 'no-store');
            logger.info('sign in ');
            SignIn.init(req, res);
        });

        backendServer.post('/api/invocation', async (req, res) => {
            res.set('Cache-Control', 'no-store');
            await new Invocation().init(req, res);
        });

        backendServer.get('/api/ladder', async (req, res) => {
            await new Ladder().init(req, res);
        });

        backendServer.get('/api/users/cards', async (req, res) => {
            await new MyCards().init(req, res);
        });
    }
}
