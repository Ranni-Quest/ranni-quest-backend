import { serverConfig } from '../../../config/config.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { UserActionLogger } from '../database/user_action_logger.mjs';
import { Hash } from '../util/hash.mjs';

export class Pull {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }
        const settings = await this.getSettings();

        if (!CheckAccess.checkPull(userInfo.lastTimePull, settings.pullTimer)) {
            res.statusCode = 400;
            res.json({ message: 'Too soon' });
            return;
        }

        let discordId = Hash.decrypt(req.headers.sessionid, serverConfig.hash);
        let packRarity = this.getRandomDrop(await this.getPackRarityRates());
        let cardsSet = this.formatCardsSet(await this.getCardsSet());
        const summonedCards = await this.generateCards(packRarity, cardsSet);

        this.saveInPull(discordId, summonedCards);
        this.savePullDateTime(discordId);

        res.json(summonedCards);
    }

    getRandomDrop(packRarityRates) {
        const rate = Math.random();

        for (let rarity of packRarityRates) {
            if (rarity.rate > rate) {
                return rarity.name;
            }
        }
        return 'normal';
    }

    async generateCards(packRarity, cardsSet) {
        let summonedCards = [];
        const cardsDropRate = await this.getCardsDropRate(packRarity);
        for (let cardDropRates of cardsDropRate) {
            let card = await this.getRandomCard(cardDropRates, cardsSet);
            summonedCards.push(card);
        }

        return summonedCards;
    }

    async getRandomCard(cardDropRates, cardsSet) {
        const rarity = this.getRandomRarity(cardDropRates.values, cardsSet);

        const cardsRarity = cardsSet[rarity];

        let card = cardsRarity[Math.floor(Math.random() * cardsRarity.length)];

        return card;
    }

    getRandomRarity(cardDropRates, cardsSet) {
        const rate = Math.random();

        for (const cardRarity of Object.keys(cardDropRates)) {
            if (
                !Object.keys(cardsSet).includes(cardRarity) ||
                cardsSet[cardRarity]?.length === 0
            ) {
                continue;
            }

            if (rate < cardDropRates[cardRarity]) {
                return cardRarity;
            }
        }

        return 'common';
    }

    async getSettings() {
        return this.parseQuery(
            await dbConnect.queryDB(`
                SELECT * 
                FROM ptcg_settings`)
        )[0];
    }

    async getPackRarityRates() {
        return this.parseQuery(
            await dbConnect.queryDB(`
            SELECT *
            from ptcg_pull_rarity_rate
            ORDER BY rate ASC`)
        );
    }

    async getCardsDropRate(packRarity) {
        return this.parseQuery(
            await dbConnect.queryDB(
                `SELECT s.series, rarity, \`values\`
                FROM ptcg_card_drop_rate r
                LEFT JOIN ptcg_settings s ON r.series = s.series
                WHERE s.series IS NOT NULL AND rarity=':packRarity'
                ORDER BY RAND()`,
                { packRarity }
            )
        );
    }

    async getCardsSet() {
        return this.parseQuery(
            await dbConnect.queryDB(
                `SELECT * 
                FROM ptcg_cards c
                LEFT JOIN ptcg_effect e ON c.rarity = e.rarity
                LEFT JOIN ptcg_settings s ON c.setId = s.setId
                WHERE s.setId IS NOT NULL AND c.cardId NOT IN (
                    SELECT uc.cardId
                                FROM ptcg_users_cards uc
                                LEFT JOIN ptcg_cards c ON uc.cardId = c.cardId
                                WHERE rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' ) AND uc.cardId IS NOT NULL
                ) ORDER BY c.rarity`
            )
        );
    }

    parseQuery(output) {
        return JSON.parse(JSON.stringify(output));
    }

    formatCardsSet(outputCardsSet) {
        let cardsSet = {};
        for (let card of outputCardsSet) {
            if (!Object.keys(cardsSet).includes(card.rarity)) {
                cardsSet[card.rarity] = [];
            }

            cardsSet[card.rarity].push(card);
        }

        return cardsSet;
    }

    async saveInPull(discordId, cards) {
        for (let card of cards) {
            dbConnect.queryDB(
                `INSERT INTO ptcg_users_cards (discordId, cardId)
                VALUES (':discordId', ':cardId')
                ON DUPLICATE KEY UPDATE
                discordId=':discordId'`,
                {
                    discordId,
                    ...card,
                }
            );
        }
    }

    async savePullDateTime(discordId) {
        UserActionLogger.info('pull', this.discordId, ``);

        await dbConnect.queryDB(
            `UPDATE ptcg_users SET lastTimePull=:lastTimePull WHERE discordId=':discordId'`,
            {
                discordId,
                lastTimePull: Math.floor(Date.now() / 1000),
            }
        );
    }
}
