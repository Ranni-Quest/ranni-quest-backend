import PokemonInfoEntity from './pokemon_info.entity.js'

export default class UserPokemonsEntity {
  constructor(
    public discordId: string,
    public pseudo: string,
    public pokemons: PokemonInfoEntity[]
  ) {}
}
