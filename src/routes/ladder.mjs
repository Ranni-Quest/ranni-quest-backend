import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';

export class Ladder {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }
        const output = await this.getLadder();
        res.json(await output);
    }

    async getLadder() {
        return await dbConnect.queryDB(`
            SELECT pseudo, cardId, rarity, image, type, supertype, effect
            FROM ptcg_cards c
            LEFT JOIN ptcg_users u ON c.discordId = u.discordId
            WHERE rarity != 'common' AND rarity != 'uncommon' AND rarity != 'rare' 
            ORDER BY id DESC 
            LIMIT 6;`);
    }
}
