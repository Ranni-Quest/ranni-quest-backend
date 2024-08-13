export default class PokemonPendingEntity {
  constructor(
    public id: number,
    public discordId: string,
    public pokemonId: number,
    public name: string,
    public isShiny: boolean,
    public artwork: string,
    public sprite: string
  ) {}

  toArray(): {
    discordId: string
    pokemonId: number
    name: string
    isShiny: boolean
    artwork: string
    sprite: string
  } {
    return {
      discordId: this.discordId,
      pokemonId: this.pokemonId,
      name: this.name,
      isShiny: this.isShiny,
      artwork: this.artwork,
      sprite: this.sprite,
    }
  }
}
