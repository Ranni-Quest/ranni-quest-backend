export default class UserPokemonEntity {
  constructor(
    public id: number,
    public discordId: string,
    public pokemonId: number,
    public name: string,
    public isShiny: boolean,
    public sprite: string,
    public artwork: string,
    public types: string[],
    public weaknesses: { [key: string]: number },
    public resistances: { [key: string]: number },
    public timestamp: number
  ) {}
}
