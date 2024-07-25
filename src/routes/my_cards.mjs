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
            req.headers?.offset ?? 0
        );
        res.json(await output);
    }

    async getMyCards(discordId, offset = 0) {
        return await dbConnect.queryDB(
            `
            SELECT cardId, image, rarity, effect
            FROM ptcg_cards
            WHERE discordId = ':discordId'
            ORDER BY CASE 
                WHEN rarity = 'speciale_illustration_rare' then 1
				WHEN rarity = 'hyper_rare' then 2
                WHEN rarity = 'ultra_rare' then 3
                WHEN rarity = 'illustration_rare_chromatic' then 4
                WHEN rarity = 'illustration_rare' then 5
                WHEN rarity = 'double_rare' then 6
                WHEN rarity = 'rare' then 7
                WHEN rarity = 'uncommon' then 8
                WHEN rarity = 'common' then 9
            END
            LIMIT 20
            OFFSET :offset`,
            { discordId, offset }
        );
    }
}
