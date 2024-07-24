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
                const userInfo = await this._main(req, res);
                if (!userInfo) {
                    logger.info('failed to Login ' + !req.body?.sessionId);
                    res.statusCode = 401;
                    res.json({ message: 'Unauthorize' });
                    return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.json(this.userInfo);
            } catch (error) {
                console.log(error);
                res.statusCode = 401;
                res.json({ message: 'Unauthorize' });
                return;
            }
        });
    }

    async _main(req, res) {
        res.set('Cache-Control', 'no-store');
        let sessionId = null;

        logger.info(` ???? ${!req.body?.sessionId}`);
        if (!req.body?.sessionId) {
            return false;
        }

        sessionId = req.body.sessionId;

        await this._getUserInfo(sessionId);

        logger.info(
            `pazorijaozêijr ${!this.discordId} ${!Object.keys(this.userInfo)
                .length}`
        );

        if (!this.discordId && !Object.keys(this.userInfo).length) {
            return false;
        }

        UserActionLogger.info(
            'connection',
            this.discordId,
            `User Agent: ${req.headers['user-agent']}`
        );

        // logger.info('Login ' + this.discordId + sessionId);
    }

    async _getUserInfo(sessionId) {
        try {
            const discordId = Hash.decrypt(sessionId, serverConfig.hash);
            if (!discordId) {
                return;
            }
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
