import type { CardDropRatesValueInterface } from '#entities/interfaces/card_drop_rate_value.interface'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
