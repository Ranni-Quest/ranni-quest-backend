export default class PokemonPendingEntity {
  constructor(
    public id: number,
    public discordId: string,
    public pokemonId: number,
    public name: string,
    public isShiny: boolean
  ) {}

  toArray(): { discordId: string; pokemonId: number; name: string; isShiny: boolean } {
    return {
      discordId: this.discordId,
      pokemonId: this.pokemonId,
      name: this.name,
      isShiny: this.isShiny,
    }
  }
}
