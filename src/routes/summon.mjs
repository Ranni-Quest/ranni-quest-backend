import { dbConnect } from '../app.mjs';
import { CheckAccess } from '../access_manager/check_access.mjs';

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

        const pokemonIds = await this.getPokemonAlreadySummon();

        const pokemonId = this.getRandomPokemonId(pokemonIds);

        const name = await this.getFrenchName(pokemonId);
        this.upsertPokemonPending(userInfo.discordId, { pokemonId, name });

        const isShiny = Math.floor(Math.random());

        res.json({
            name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                isShiny ? 'shiny/' : ''
            }${pokemonId}.png`,
        });
    }

    getRandomPokemonId(pokemonIds) {
        const pokemonId = Math.floor(Math.random() * 889);

        return pokemonIds.includes(pokemonId)
            ? this.getRandomPokemonId(pokemonIds)
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
