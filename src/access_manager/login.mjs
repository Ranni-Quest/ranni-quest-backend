import { serverConfig } from '../../../config/config.mjs';
import { backendServer, dbConnect, logger } from '../app.mjs';
import { UserActionLogger } from '../database/user_action_logger.mjs';
import { Hash } from '../util/hash.mjs';

export class LogIn {
    discordId = '';
    userInfo = {};

    async init(req, res) {
        backendServer.post('/api/login', async (req, res) => {
            try {
                await this._main(req, res);
            } catch (error) {
                console.log(error);
                res.statusCode = 400;
            }
        });
    }

    async _main(req, res) {
        const config = serverConfig.public;
        let sessionId = null;

        if (!req.body?.sessionId) {
            res.json(null);
            return;
        }

        sessionId = req.body.sessionId;

        await this._getUserInfo(sessionId);
        if (!this.discordId && !Object.keys(this.userInfo).length) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorize' });
            logger.info('failed to Login ' + sessionId);
            return;
        }

        UserActionLogger.info(
            'connection',
            this.discordId,
            `User Agent: ${req.headers['user-agent']}`
        );

        // req.session.user = this.userInfo;

        logger.info('Login ' + this.discordId + sessionId);
        res.setHeader('Content-Type', 'application/json');
        res.json(this.userInfo);
    }

    async _getUserInfo(sessionId) {
        try {
            const discordId = Hash.decrypt(sessionId, serverConfig.hash);
            if (!discordId) {
                return;
            }
            logger.info(
                `SELECT *
                FROM ptcg_users
                WHERE discordId = :discordId`,
                discordId
            );
            const res = await dbConnect.queryDB(
                `SELECT *
                FROM ptcg_users
                WHERE discordId = :discordId`,
                { discordId }
            );

            console.log(res);

            this.discordId = res[0].discordId;
            this.userInfo = res[0] || null;
        } catch (error) {
            // logger.error(error.message);
            // logger.error(error.stack);
            this.discordId = '';
            this.userInfo = {};
        }
    }
}
