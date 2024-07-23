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
            `SELECT discordId, pseudo
            FROM ptcg_users
            WHERE discordId = :discordId`,
            { discordId: discordId }
        );
        let result = Object.values(JSON.parse(JSON.stringify(await output)));
        return `${result.length}` == '1';
    }
}
