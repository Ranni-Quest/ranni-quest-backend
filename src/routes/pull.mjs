import { serverConfig } from '../../../config/config.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import {
    cardsSet,
    RarityEffect,
    cardsDrop,
    RarityMovingEffect,
} from '../data/index.mjs';
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

        let alreadySummoned = await dbConnect.queryDB(
            `SELECT DISTINCT(cardId)
            FROM ptcg_cards
            WHERE rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' )`
        );

        alreadySummoned = JSON.parse(JSON.stringify(alreadySummoned)).map(
            (card) => card.cardId
        );

        let results = [];
        const pullRarity = this.getRandomDrop();

        for (let dropRate of cardsDrop[pullRarity]) {
            let items = Object.keys(dropRate).map(function (key) {
                return [key, dropRate[key]];
            });

            items = items.sort(function (first, second) {
                return first[1] - second[1];
            });

            let card = await this.getRandomCard(alreadySummoned, items);
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

    async getRandomCard(alreadySummoned, dropRate, i = 0) {
        let rarity = 'rare';
        if (i !== 2) {
            rarity = this.getRandomRarity(dropRate);
        }

        const cardsRarity = cardsSet[rarity];
        let card = cardsRarity[Math.floor(Math.random() * cardsRarity.length)];

        if (alreadySummoned.includes(card.id)) {
            i++;
            card = await this.getRandomCard(alreadySummoned, dropRate, i);
        }

        card.effect = RarityMovingEffect[rarity];
        card.rarityEffect = RarityEffect[rarity];
        card.image = card.images.large;
        card.set = cardsSet.name.name;
        card.series = cardsSet.name.series;

        return card;
    }

    getRandomRarity(dropRates) {
        const rate = Math.random();
        for (const dropRate of dropRates) {
            if (!Object.keys(cardsSet).includes(dropRate[0])) {
                continue;
            }

            if (rate < dropRate[1]) {
                return dropRate[0];
            }
        }

        return 'common';
    }

    async saveInPull(discordId, cards) {
        for (let card of cards) {
            dbConnect.queryDB(
                `INSERT INTO ptcg_cards (cardId, discordId, rarity, image, type, supertype, effect, rarityEffect, series)
                VALUES (':cardId', ':discordId', ':rarity', ':image', :type, ':supertype', ':effect', ':rarityEffect', ':series')
                ON DUPLICATE KEY UPDATE
                image=':image'`,
                {
                    discordId: discordId,
                    cardId: card.id,
                    image: card.images.large,
                    type: card.types?.length > 0 ? `'${card.types[0]}'` : null,
                    ...card,
                }
            );
        }
    }

    async savePullDateTime(discordId) {
        await dbConnect.queryDB(
            `UPDATE ptcg_users SET lastTimePull=:lastTimePull WHERE discordId=':discordId'`,
            {
                discordId,
                lastTimePull: Math.floor(Date.now() / 1000),
            }
        );
    }
}
