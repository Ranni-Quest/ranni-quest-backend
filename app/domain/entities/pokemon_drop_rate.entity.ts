export default class PokemonDropRateEntity {
  constructor(
    public id: number,
    public rarity: string,
    public dropRate: number,
    public pokemons: number[]
  ) {}
}
