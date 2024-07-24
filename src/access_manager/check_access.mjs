import { serverConfig } from '../../config.mjs';
import { dbConnect } from '../app.mjs';
import { Hash } from '../util/hash.mjs';
import { sanitize } from '../util/string.mjs';

export class CheckAccess {
    static async init(req, res, func) {
        let discordId = Hash.decrypt(req.headers.sessionid, serverConfig.hash);

        discordId = sanitize(discordId);

        if (!discordId) {
            return false;
        }

        const output = await dbConnect.queryDB(
            `SELECT *
            FROM ptcg_users
            WHERE discordId = :discordId`,
            { discordId }
        );
        return output[0] ?? false;
    }

    static checkPull(lastTimePull) {
        return 14400 <= Math.floor(Date.now() / 1000) - (lastTimePull ?? 0);
    }
}
