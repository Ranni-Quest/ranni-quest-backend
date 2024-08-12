import { CardDropRatesValueInterface } from '#entities/interfaces/card_drop_rate_value.interface'

export default class CardDropRateEntity {
  constructor(
    public id: number,
    public series: string,
    public rarity: string,
    public values: CardDropRatesValueInterface,
    public order: number
  ) {}
}
