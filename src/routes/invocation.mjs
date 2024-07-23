import { serverConfig } from '../../config.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { scarlet_violet } from '../data/drop.mjs';
import { sv6Card } from '../data/sv6.mjs';
import { Hash } from '../util/hash.mjs';

export class Invocation {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        if (!CheckAccess.checkPull(userInfo.last_time_pull)) {
            res.statusCode = 400;
            res.json({ message: 'Too soon' });
            return;
        }
        let discordId = Hash.decrypt(req.headers.sessionid, serverConfig.hash);

        let results = [];
        for (let dropRate of scarlet_violet.normal) {
            let rarity = this.getRandomRarity(dropRate);
            let card = this.getRandomCard(rarity);
            card.rarity = rarity;
            results.push(card);
        }

        this.saveInPull(discordId, results);
        this.savePullDateTime(discordId);
        res.json(results);
    }

    getRandomRarity(rates) {
        const totalRate = Object.values(rates).reduce(
            (acc, rate) => acc + rate,
            0
        );

        const randomNum = Math.random() * totalRate;

        let cumulativeRate = 0;
        for (const key in rates) {
            cumulativeRate += rates[key];
            if (randomNum < cumulativeRate) {
                return key;
            }
        }

        return 'common';
    }

    getRandomCard(rarity = 'common') {
        const cardsRarity = sv6Card[rarity];
        return cardsRarity[Math.floor(Math.random() * cardsRarity.length)];
    }

    async saveInPull(discordId, cards) {
        for (let card of cards) {
            dbConnect.queryDB(
                `INSERT INTO ptcg_cards (card_id, discord_id, rarity, image)
                VALUES (':card_id', ':discord_id', ':rarity', ':image')`,
                {
                    card_id: card.id,
                    image: card.images.large,
                    rarity: card.rarity,
                    discord_id: discordId,
                }
            );
        }
    }

    async savePullDateTime(discordId) {
        dbConnect.queryDB(
            `UPDATE ptcg_users SET last_time_pull=:lastTimePull WHERE discord_id=':discordId'`,
            {
                discordId,
                lastTimePull: Math.floor(Date.now() / 1000),
            }
        );
    }
}
