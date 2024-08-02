import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';

export class MyCards {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        const output = await this.getMyCards(
            userInfo.discordId,
            req.query?.offset ?? 0
        );
        res.json(await output);
    }

    async getMyCards(discordId, offset = 0) {
        return await dbConnect.queryDB(
            `
            SELECT  uc.cardId, c.rarity, largeImage, c.\`type\`, c.subtype, c.supertype, e.effect, e.rarityEffect, c.setId, c.series
            FROM ptcg_users_cards uc
            LEFT JOIN ptcg_cards c ON uc.cardId = c.cardId
            LEFT JOIN ptcg_effect e ON c.rarity = e.rarity
            WHERE discordId = ':discordId'
            ORDER BY CASE 
                WHEN e.rarityEffect = 'rainbow' then 1
                WHEN e.rarityEffect = 'gold' then 2
                WHEN e.rarityEffect = 'silver' then 3
                WHEN e.rarityEffect = 'none' then 4
            END, uc.cardId ASC
            LIMIT 20
            OFFSET :offset`,
            { discordId, offset }
        );
    }
}
