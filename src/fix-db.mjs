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

import { RarityEffect, RarityMovingEffect } from './data/index.mjs';

const addEffect = () => {
    for (let rarity of Object.keys(RarityMovingEffect)) {
        dbConnect.queryDB(
            `
            INSERT INTO ptcg_effect (type, rarity, effect) VALUES (':type', ':rarity', ':effect')`,
            {
                type: 'moving',
                rarity,
                effect: RarityMovingEffect[rarity],
            }
        );
    }

    console.log('done effect');
};

import {
    scarletViolet,
    scarletVioletBlackStarPromos,
    paldeaEvolved,
    scarletVioletEnergies,
    obsidianFlames,
    cardsSet as sv151,
    paradoxRift,
    paldeanFates,
    temporalForces,
    twilightMasquerade,
    swshBlackStarPromos,
    swordShield,
    rebelClash,
    darknessAblaze,
    championSPath,
    vividVoltage,
    shiningFates,
    shiningFatesShinyVault,
    battleStyles,
    chillingReign,
    evolvingSkies,
    celebrationsClassicCollection,
    fusionStrike,
    brilliantStars,
    brilliantStarsTrainerGallery,
    astralRadiance,
    astralRadianceTrainerGallery,
    pokmonGo,
    lostOrigin,
    lostOriginTrainerGallery,
    silverTempest,
    silverTempestTrainerGallery,
    crownZenith,
    crownZenithGalarianGallery,
} from './data/index.mjs';

const sets = [
    scarletViolet,
    scarletVioletBlackStarPromos,
    paldeaEvolved,
    scarletVioletEnergies,
    obsidianFlames,
    sv151, // sv151
    paradoxRift,
    paldeanFates,
    temporalForces,
    twilightMasquerade,
    swshBlackStarPromos,
    swordShield,
    rebelClash,
    darknessAblaze,
    championSPath,
    vividVoltage,
    shiningFates,
    shiningFatesShinyVault,
    battleStyles,
    chillingReign,
    evolvingSkies,
    celebrationsClassicCollection,
    fusionStrike,
    brilliantStars,
    brilliantStarsTrainerGallery,
    astralRadiance,
    astralRadianceTrainerGallery,
    pokmonGo,
    lostOrigin,
    lostOriginTrainerGallery,
    silverTempest,
    silverTempestTrainerGallery,
    crownZenith,
    crownZenithGalarianGallery,
];

const addCard = () => {
    for (let set of sets) {
        for (let rarity of Object.keys(set)) {
            if (rarity === 'name') {
                continue;
            }
            for (let card of set[rarity]) {
                dbConnect.queryDB(
                    `
                    INSERT INTO ptcg_cards (cardId, \`name\`, setId, setName , series, rarity, largeImage, smallImage, \`type\`, subtype, supertype ) 
                    VALUES (':cardId', ":name", ':setId', ':setName', ':series', ':rarity', ':largeImage', ':smallImage', ':type', ':subtype', ':supertype')
                    ON DUPLICATE KEY UPDATE cardId=':cardId'`,
                    {
                        ...card,
                        cardId: card.id,
                        setId: set.name.id,
                        setName: set.name.name,
                        series: set.name.series,
                        largeImage: card.images.large,
                        smallImage: card.images.small,
                        type: card.type ? card.type.toLowerCase() : null,
                        subtype: card.subtype
                            ? card.subtype.toLowerCase()
                            : null,
                        supertype: card.supertype
                            ? card.supertype.toLowerCase()
                            : null,
                    }
                );
            }
        }
    }

    console.log('done addCard');
};

import {
    cardsDrop as scarletPurpleDrop,
    swordAndShieldDrop,
} from './data/index.mjs';

const addDropRates = () => {
    for (let rarity of Object.keys(swordAndShieldDrop)) {
        for (let dropRateOrder of swordAndShieldDrop[rarity].keys()) {
            dbConnect.queryDB(
                `
                INSERT INTO ptcg_card_drop_rate (series, rarity, \`values\`, \`order\`) VALUES (':series', ':rarity', ':values', :order)`,
                {
                    series: 'swordAndShield',
                    rarity,
                    values: JSON.stringify(
                        swordAndShieldDrop[rarity][dropRateOrder]
                    ),
                    order: dropRateOrder + 1,
                }
            );
        }
    }
    console.log('done addDropRates');
};

import { pokemonDropRate } from './data/index.mjs';

const addPokemon = () => {
    for (let rarity of Object.keys(pokemonDropRate)) {
        dbConnect.queryDB(
            `
            INSERT INTO ptcg_pokemon_drop_rate (rarity, rate, pokemons ) VALUES (':rarity', :rate, ':pokemons')`,
            {
                rate: pokemonDropRate[rarity].rate,
                pokemons: JSON.stringify(pokemonDropRate[rarity].pokemons),
                rarity,
            }
        );
    }
    console.log('done addDropRates');
};

addPokemon();
