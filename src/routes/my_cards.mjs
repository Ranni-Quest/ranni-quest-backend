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
                WHEN c.rarity = 'special_illustration_rare' then 1
                WHEN c.rarity = 'rare_secret' then 1
				WHEN c.rarity = 'hyper_rare' then 2
                WHEN c.rarity = 'rare_rainbow' then 2
                WHEN c.rarity = 'ultra_rare' then 3
                WHEN c.rarity = 'rare_holo_vmax' then 3
                WHEN c.rarity = 'illustration_rare_chromatic' then 4
                WHEN c.rarity = 'rare_holo_v' then 4 
                WHEN c.rarity = 'illustration_rare' then 5
                WHEN c.rarity = 'rare_ultra' then 5 
                WHEN c.rarity = 'double_rare' then 6
                WHEN c.rarity = 'amazing_rare' then 6
                WHEN c.rarity = 'rare' then 7
                WHEN c.rarity = 'rare_holo' then 7
                WHEN c.rarity = 'uncommon' then 8
                WHEN c.rarity = 'common' then 9
            END, uc.cardId ASC
            LIMIT 20
            OFFSET :offset`,
            { discordId, offset }
        );
    }
}
