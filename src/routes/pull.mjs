import { serverConfig } from '../../../config/config.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { scarlet_violet } from '../data/card_frop_rate.mjs';
import { sv5Cards as cardsSet } from '../data/index.mjs';
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
        const pullRarity = this.getRandomDrop();
        for (let dropRate of scarlet_violet[pullRarity]) {
            let card = await this.getRandomCard(dropRate);
            results.push(card);
        }

        this.saveInPull(discordId, results);
        this.savePullDateTime(discordId);
        res.json(results);
    }

    getRandomDrop() {
        const drops = {
            god: 0.001,
            hell: 0.002,
            normal: 99.999,
        };
        const rate = Math.random();
        if (drops.god > rate) {
            return 'god';
        } else if (drops.hell > rate) {
            return 'hell';
        }

        return 'normal';
    }

    async getRandomCard(dropRate, i = 0) {
        let rarity = 'rare';
        if (i !== 2) {
            rarity = this.getRandomRarity(dropRate);
        }

        const cardsRarity = cardsSet[rarity];
        const card =
            cardsRarity[Math.floor(Math.random() * cardsRarity.length)];

        const isAlreadySummoned = await dbConnect.queryDB(
            `SELECT DISTINCT(cardId)
            FROM ptcg_cards
            WHERE cardId LIKE ':cardId%' AND rarity NOT IN ('commun', 'uncommon', 'rare')`,
            { cardId: card.id }
        );

        if (JSON.parse(JSON.stringify(isAlreadySummoned)).length >= 1) {
            this.getRandomCard(dropRate, i++);
        }

        card.rarity = rarity;

        return card;
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
