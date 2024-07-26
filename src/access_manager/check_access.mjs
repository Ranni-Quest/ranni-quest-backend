import { serverConfig } from '../../../config/config.mjs';
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
            WHERE discordId = ':discordId'`,
            { discordId }
        );
        return output[0] ?? false;
    }

    static checkPull(lastTimePull) {
        return (
            serverConfig.app.invocation <=
            Math.floor(Date.now() / 1000) - (lastTimePull ?? 0)
        );
    }

    static async checkSummon(discordId) {
        const output = await dbConnect.queryDB(
            `SELECT *
            FROM ptcg_users
            WHERE discordId = ':discordId'`,
            { discordId }
        );

        return (
            serverConfig.app.summon <=
            Math.floor(Date.now() / 1000) - (output[0].lastTimeSummon ?? 0)
        );
    }

    static async checkPendingPokemon(discordId, pokemonId) {
        const output = await dbConnect.queryDB(
            `SELECT *
            FROM ptcg_pending_pokemon
            WHERE discordId = ':discordId'`,
            { discordId, pokemonId }
        );

        return output[0] ?? {};
    }
}
