import { CheckAccess } from '../access_manager/check_access.mjs';
import { dbConnect } from '../app.mjs';
import { UserActionLogger } from '../database/user_action_logger.mjs';

export class KeepPokemon {
    async init(req, res) {
        const userInfo = await CheckAccess.init(req, res);
        if (!userInfo) {
            res.statusCode = 401;
            res.json({ message: 'Unauthorized' });
            return;
        }

        const pokemonInfo = await CheckAccess.checkPendingPokemon(
            userInfo.discordId
        );

        if (!Object.keys(pokemonInfo).length) {
            res.statusCode = 404;
            res.json({ message: 'Bad request' });
            return;
        }

        const pokemon = {
            pokemonId: pokemonInfo.pokemonId,
            name: pokemonInfo.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
                pokemonInfo.isShiny ? 'shiny/' : ''
            }${pokemonInfo.pokemonId}.png`,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                pokemonInfo.isShiny ? 'shiny/' : ''
            }${pokemonInfo.pokemonId}.png`,
            isShiny: pokemonInfo.isShiny,
        };

        this.keepPokemon(userInfo.discordId, pokemon);

        res.json(pokemon);
    }

    async keepPokemon(discordId, pokemonData) {
        await dbConnect.queryDB(
            `INSERT INTO ptcg_pokemon
            (discordId, pokemonId, name, isShiny, sprite, image)
            VALUES (':discordId' , :pokemonId, ':name', :isShiny, ':sprite', ':image')
            ON DUPLICATE KEY UPDATE
            discordId=':discordId', pokemonId=:pokemonId, name=':name', isShiny=:isShiny, sprite=':sprite', image=':image'`,
            {
                discordId,
                ...pokemonData,
            }
        );

        UserActionLogger.info('keep', this.discordId, pokemonData.name);

        await dbConnect.queryDB(
            `DELETE FROM ptcg_pending_pokemon
            WHERE discordId=':discordId'`,
            {
                discordId,
            }
        );
    }
}
