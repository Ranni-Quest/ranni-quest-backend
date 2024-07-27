import { dbConnect } from '../app.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';
import { serverConfig } from '../../../config/config.mjs';
import { dropRate } from '../data/pokemon_drop_rate.mjs';

export class Summon {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        if (!(await CheckAccess.checkSummon(userInfo.discordId))) {
            res.statusCode = 400;
            res.json({ message: 'Too soon' });
            return;
        }

        const pokemonStatus = this.getRandomPokemonStatus();
        const alreadySummoned = JSON.parse(
            JSON.stringify(await this.getPokemonAlreadySummon())
        ).map((pokemon) => pokemon.pokemonId);

        const pokemonId = this.getRandomPokemonId(
            alreadySummoned,
            dropRate[pokemonStatus].pokemons
        );

        const name = await this.getFrenchName(pokemonId);

        this.upsertPokemonPending(userInfo.discordId, { pokemonId, name });

        const isShiny = this.isShiny();

        res.json({
            name,
            status: pokemonStatus,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
        });
    }

    isShiny() {
        const probabilityFor001 = serverConfig.app.shinyOod;
        return Math.random() < probabilityFor001 ? 1 : 0;
    }

    getRandomPokemonStatus() {
        const rate = Math.random();
        if (dropRate.fabulous.rate > rate) {
            return 'fabulous';
        } else if (dropRate.legendary.rate > rate) {
            return 'legendary';
        } else if (dropRate.subLegendary.rate > rate) {
            return 'subLegendary';
        }

        return 'commun';
    }

    getRandomPokemonId(alreadySummoned, pokemondIds, i = 0) {
        if (i === 2) {
            pokemondIds = dropRate.commun.pokemons;
        }

        const pokemonId =
            pokemondIds[Math.floor(Math.random() * pokemondIds.length)];

        return alreadySummoned.includes(pokemonId)
            ? this.getRandomPokemonId(alreadySummoned, pokemondIds, i++)
            : pokemonId;
    }

    async getPokemonAlreadySummon() {
        return await dbConnect.queryDB(
            `SELECT pokemonId
            FROM ptcg_pokemon`
        );
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

    async upsertPokemonPending(discordId, pokemon) {
        await dbConnect.queryDB(
            `INSERT INTO ptcg_pending_pokemon
            (discordId, pokemonId, name)
            VALUES (':discordId' , :pokemonId, ':name')
            ON DUPLICATE KEY UPDATE
            discordId=':discordId', pokemonId=':pokemonId', name=':name'`,
            { discordId, ...pokemon }
        );

        dbConnect.queryDB(
            `UPDATE ptcg_users SET lastTimeSummon=:lastTimeSummon WHERE discordId=':discordId'`,
            {
                discordId,
                lastTimeSummon: Math.floor(Date.now() / 1000),
            }
        );
    }
}
