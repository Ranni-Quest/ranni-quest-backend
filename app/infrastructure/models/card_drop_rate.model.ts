import { BaseModel, column } from '@adonisjs/lucid/orm'

interface CardDropRatesValueInterface {
  rare: number
  common: number
  uncommon: number
  hyper_rare: number
  ultra_rare: number
  double_rare: number
  illustration_rare: number
  special_illustration_rare: number
  illustration_rare_chromatic: 0
}

export default class CardDropRate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare series: string

  @column()
  declare rarity: string

  @column()
  declare values: CardDropRatesValueInterface

  @column()
  declare order: number
}
