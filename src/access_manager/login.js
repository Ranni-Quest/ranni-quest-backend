import { serverConfig } from '../../config';
import { backendServer, dbConnect, logger } from '../app';
import { UserActionLogger } from '../database/user_action_logger';

export class LogIn {
    discordId = '';
    userInfo = {};

    async init(req, res) {
        backendServer.post('/login', async (req, res) => {
            try {
                await this._main(req, res);
            } catch (err) {
                console.log(error);
                res.statusCode = 400;
            }
        });
    }

    async _main(req, res) {
        console.log('Login');

        const config = serverConfig.public;

        if (config.server === 'MyServer' || config.server === 'localhost')
            this.discordId = '';
        else {
            if (!req.headers?.session) {
                res.json(null);
                return;
            }

            this.discordId = req.headers.sm_user;
        }

        await this._getUserInfo();

        UserActionLogger.info(
            'connection',
            this.discordId,
            `User Agent: ${req.headers['user-agent']}`
        );

        req.session.user = this.userInfo;

        res.setHeader('Content-Type', 'application/json');
        res.json(this.userInfo);
    }

    async _getUserInfo() {
        try {
            const res = await dbConnect.queryDB(
                `SELECT discordId, pseudo
                FROM ptcg_users
                WHERE discordId = :discordId`,
                { discordId: this.discordId }
            );

            this.userInfo = res[0] || null;
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);
            return null;
        }
    }
}
