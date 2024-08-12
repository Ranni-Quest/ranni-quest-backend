export default class PokemonPendingEntity {
  constructor(
    public id: number,
    public discordId: string,
    public pokemonId: number,
    public name: string,
    public isShiny: boolean
  ) {}
}
