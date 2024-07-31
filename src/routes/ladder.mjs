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
            SELECT pseudo, c.cardId, c.rarity, largeImage, c.\`type\`, c.subtype, c.supertype, e.effect, e.rarityEffect, c.setId, c.series
            FROM ptcg_users_cards uc
            LEFT JOIN ptcg_cards c ON uc.cardId = c.cardId
            LEFT JOIN ptcg_effect e ON c.rarity = e.rarity
            LEFT JOIN ptcg_users u ON uc.discordId = u.discordId
            WHERE c.rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' ) AND uc.cardId is NOT NULL
            ORDER BY uc.id DESC 
            LIMIT 6;`);
    }
}
