import winston from 'winston';
export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} ${level} ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});
import { DatabaseManager } from './database/manager.mjs';
export const dbConnect = new DatabaseManager(logger);
await dbConnect.init();

const output = await dbConnect.queryDB(`
    SELECT distinct(cardId), rarity FROM pokemontcg.ptcg_cards where image = 'https://images.pokemontcg.io/sv1/114_hires.png' ORDER BY cardId;
    `);

import {
    scarletViolet,
    paradoxRift,
    // temporalForces,
    twilightMasquerade,
    RarityMovingEffect,
    RarityEffect,
} from './data/index.mjs';
for (let row of output) {
    let cardsSet = '';
    if (row.cardId.includes('sv1')) {
        cardsSet = scarletViolet;
    } else if (row.cardId.includes('sv4')) {
        cardsSet = paradoxRift;
    } else if (row.cardId.includes('sv5')) {
        cardsSet = temporalForces;
    } else if (row.cardId.includes('sv6')) {
        cardsSet = twilightMasquerade;
    } else {
        console.log('continue');
        continue;
    }
    console.log(row);
    for (let rarity of Object.keys(cardsSet)) {
        if (rarity === 'name') {
            continue;
        }
        for (let card of cardsSet[rarity]) {
            if (card.id === row.cardId) {
                card.effect = RarityMovingEffect[card.rarity];
                card.rarityEffect = RarityEffect[card.rarity];
                card.image = card.images.large;
                card.set = cardsSet.name.id;
                card.series = cardsSet.name.series;
                console.log(card.image);
                await dbConnect.query(
                    `
                UPDATE ptcg_cards set rarity=':rarity', image=':image', \`type\`=':type', subtype=':subtype', supertype=':supertype', effect=':effect', rarityEffect=':rarityEffect', \`set\`=':set', series=':series'
                WHERE cardId = ':cardId'`,
                    { ...card, cardId: card.id }
                );
            }
        }
    }
}

console.log('done 3');
