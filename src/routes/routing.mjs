import { SignIn } from '../access_manager/signin.mjs';
import { backendServer } from '../app.mjs';
import { Hash } from '../util/hash.mjs';
import { Invocation } from './invocation.mjs';

export class Routing {
    static async init(logger) {
        backendServer.get('/discord/oauth', async (req, res) => {
            logger.info('sign in ');
            SignIn.init(req, res);
        });

        backendServer.post('/invocation', async (req, res) => {
            await new Invocation().init(req, res);
        });
    }
}
