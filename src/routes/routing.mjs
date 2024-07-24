import { SignIn } from '../access_manager/signin.mjs';
import { backendServer } from '../app.mjs';
import { Hash } from '../util/hash.mjs';
import { Invocation } from './invocation.mjs';

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
    }
}
