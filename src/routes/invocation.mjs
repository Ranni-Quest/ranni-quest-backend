import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { scarlet_violet } from '../data/drop.mjs';
import { sv6Card } from '../data/sv6.mjs';

export class Invocation {
    async init(req, res) {
        if (!(await CheckAccess.init(req, res))) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        let results = [];
        for (let dropRate of scarlet_violet.normal) {
            let rarity = this.getRandomRarity(dropRate);
            let card = this.getRandomCard(rarity);
            card.rarity = rarity;
            results.push(card);
        }

        this.saveInPull(req.headers.sesssionid, results);
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
                    discordId,
                }
            );
        }
    }
}
