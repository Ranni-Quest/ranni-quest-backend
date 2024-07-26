import { serverConfig } from '../../../config/config.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { scarlet_violet } from '../data/drop.mjs';
import { sv1Cards as cardsSet } from '../data/index.mjs';
import { Hash } from '../util/hash.mjs';

export class Pull {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        if (!CheckAccess.checkPull(userInfo.lastTimePull)) {
            res.statusCode = 400;
            res.json({ message: 'Too soon' });
            return;
        }

        let discordId = Hash.decrypt(req.headers.sessionid, serverConfig.hash);

        let results = [];
        for (let dropRate of scarlet_violet[this.getRandomDrop()]) {
            let rarity = this.getRandomRarity(dropRate);
            let card = this.getRandomCard(rarity);
            card.rarity = rarity;
            results.push(card);
        }

        this.saveInPull(discordId, results);
        this.savePullDateTime(discordId);
        res.json(results);
    }

    getRandomDrop() {
        const drops = {
            hell: 0.001,
            god: 0.001,
            normal: 99.999,
        };
        const totalWeight = Object.values(drops).reduce(
            (acc, value) => acc + value,
            0
        );

        const random = Math.random() * totalWeight;

        // Determine which drop to return based on the random number
        let cumulativeWeight = 0;
        for (const [key, weight] of Object.entries(drops)) {
            cumulativeWeight += weight;
            if (random < cumulativeWeight) {
                return key;
            }
        }
        return 'normal';
    }

    getRandomRarity(rates) {
        const totalRate = Object.values(rates).reduce(
            (acc, rate) => acc + rate,
            0
        );

        const randomNum = Math.random() * totalRate;

        let cumulativeRate = 0;
        for (const key in rates) {
            if (!Object.keys(cardsSet).includes(key)) {
                continue;
            }

            cumulativeRate += rates[key];
            if (randomNum < cumulativeRate) {
                return key;
            }
        }

        return 'common';
    }

    getRandomCard(rarity = 'common') {
        const cardsRarity = cardsSet[rarity];
        return cardsRarity[Math.floor(Math.random() * cardsRarity.length)];
    }

    async saveInPull(discordId, cards) {
        for (let card of cards) {
            dbConnect.queryDB(
                `INSERT INTO ptcg_cards (cardId, discordId, rarity, image)
                VALUES (':cardId', ':discordId', ':rarity', ':image')`,
                {
                    cardId: card.id,
                    image: card.images.large,
                    rarity: card.rarity,
                    discordId: discordId,
                }
            );
        }
    }

    async savePullDateTime(discordId) {
        dbConnect.queryDB(
            `UPDATE ptcg_users SET lastTimePull=:lastTimePull WHERE discordId=':discordId'`,
            {
                discordId,
                lastTimePull: Math.floor(Date.now() / 1000),
            }
        );
    }
}
