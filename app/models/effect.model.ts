import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Effect extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rarity: string

  @column()
  declare effect: string

  @column()
  declare rarityEffect: string
}
