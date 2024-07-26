import { dbConnect } from '../app.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';

export class PokemonOwn {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        const output = await this.getPokemon(userInfo.discordId);

        res.json(await output);
    }

    async getPokemon(discordId) {
        const output = await dbConnect.queryDB(
            `
                SELECT * 
                FROM ptcg_pokemon
                WHERE discordId = ':discordId'`,
            { discordId }
        );
        return (await output[0]) ?? {};
    }
}
