import { dbConnect } from '../app.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { UserActionLogger } from '../database/user_action_logger.mjs';

export class Summon {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }
        const settings = await this.getSettings();

        if (
            !(await CheckAccess.checkSummon(
                userInfo.discordId,
                settings.summonTimer
            ))
        ) {
            res.statusCode = 400;
            res.json({ message: 'Too soon' });
            return;
        }

        const summonDropsRate = await this.getSummonDropsRate();
        const pokemonStatus = this.getRandomPokemonStatus(summonDropsRate);
        const alreadySummoned = (await this.getPokemonAlreadySummon()).map(
            (pokemon) => pokemon.pokemonId
        );
        const index = summonDropsRate.findIndex(
            (summonDropRate) => summonDropRate.rarity === pokemonStatus
        );

        const pokemonId = this.getRandomPokemonId(
            alreadySummoned,
            summonDropsRate[index].pokemons
        );

        const name = await this.getFrenchName(pokemonId);
        const isShiny = this.isShiny(settings.shinyOod);

        this.upsertPokemonPending(userInfo.discordId, {
            pokemonId,
            name,
            isShiny,
        });

        res.json({
            name,
            status: pokemonStatus,
            isShiny: isShiny ? true : false,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
        });
    }

    isShiny(shinyOod) {
        const rate = Math.random();
        return rate < shinyOod ? 1 : 0;
    }

    getRandomPokemonStatus(summonDropsRate) {
        const rate = Math.random();
        for (let summonDropRate of summonDropsRate) {
            if (summonDropRate.rate > rate) {
                return summonDropRate.rarity;
            }
        }

        return 'commun';
    }

    getRandomPokemonId(alreadySummoned, pokemondIds) {
        return pokemondIds[Math.floor(Math.random() * pokemondIds.length)];
    }

    async getSummonDropsRate() {
        return this.parseQuery(
            await dbConnect.queryDB(
                `SELECT *
                from ptcg_pokemon_drop_rate`
            )
        );
    }

    async getPokemonAlreadySummon() {
        return this.parseQuery(
            await dbConnect.queryDB(
                `SELECT pokemonId
                FROM ptcg_pokemon`
            )
        );
    }

    async getSettings() {
        return this.parseQuery(
            await dbConnect.queryDB(`
                SELECT * 
                FROM ptcg_settings`)
        )[0];
    }

    async getFrenchName(pokemonId) {
        let speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
        );
        speciesResponse = await speciesResponse.json();
        for (let name of await speciesResponse.names) {
            if (name.language.name === 'fr') {
                return name.name;
            }
        }

        return await speciesResponse.json().name;
    }

    parseQuery(output) {
        return JSON.parse(JSON.stringify(output));
    }

    async upsertPokemonPending(discordId, pokemon) {
        await dbConnect.queryDB(
            `INSERT INTO ptcg_pending_pokemon
            (discordId, pokemonId, name, isShiny)
            VALUES (':discordId' , :pokemonId, ':name', ':isShiny')
            ON DUPLICATE KEY UPDATE
            discordId=':discordId', pokemonId=':pokemonId', name=':name', isShiny=:isShiny`,
            { discordId, ...pokemon }
        );

        UserActionLogger.info('summon', discordId, ``);

        dbConnect.queryDB(
            `UPDATE ptcg_users SET lastTimeSummon=:lastTimeSummon WHERE discordId=':discordId'`,
            {
                discordId,
                lastTimeSummon: Math.floor(Date.now() / 1000),
            }
        );
    }
}
