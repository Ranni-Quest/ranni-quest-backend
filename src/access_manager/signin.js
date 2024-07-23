import { backendServer, dbConnect, logger } from '../app';

export class SignIn {
    async init(res, req) {
        try {
            backendServer.post('/signin', async (req, res) => {
                // implement discord OAUTH
                const userInfo = {
                    discordId: 375311049022242818,
                    pseudo: 'Arcsene',
                };

                const response = await dbConnect.queryDB(
                    `INSERT INTP ptcg_user (discordId, pseudo)
                VALUES (:discordId, :pseudo)`,
                    userInfo
                );

                res.json({ message: 'OK' });
                return;
            });
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);

            res.statusCode = 500;
            res.json({ message: 'Failed to connect to discord' });
            return null;
        }
    }
}
