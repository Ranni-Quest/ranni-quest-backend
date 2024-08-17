export default class PokemonInfoEntity {
  constructor(
    public pokemonId: number,
    public name: string,
    public status: string,
    public isShiny: boolean,
    public artwork: string,
    public sprite: string,

    public types: string[],
    public weaknesses: { [key: string]: number },
    public resistances: { [key: string]: number },
    public timestamp: number | null
  ) {}

  toArray(): any {
    return {
      pokemonId: this.pokemonId,
      name: this.name,
      status: this.status,
      isShiny: this.isShiny,
      artwork: this.artwork,
      sprite: this.sprite,
      types: this.types,
      weaknesses: this.weaknesses,
      resistances: this.resistances,
      timestamp: this.timestamp,
    }
  }
}
