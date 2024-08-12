import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cardId: string

  @column()
  declare name: string

  @column()
  declare setId: string

  @column()
  declare setName: string

  @column()
  declare series: string

  @column()
  declare rarity: string

  @column()
  declare largeImageUrl: string

  @column()
  declare smallImageUrl: string

  @column()
  declare type: string

  @column()
  declare subtype: string

  @column()
  declare supertype: string
}
