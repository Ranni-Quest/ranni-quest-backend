import { SignIn } from '../access_manager/signin.mjs';
import { backendServer } from '../app.mjs';
import { Hash } from '../util/hash.mjs';

export class Routing {
    static async init(logger) {
        backendServer.get('/discord/oauth', async (req, res) => {
            logger.info('sign in ');
            SignIn.init(req, res);
        });

        backendServer.get('/discord/redirect', async (req, res) => {
            logger.info('test');
            console.log(req.query);
            console.log(req.headers);
        });
    }
}
