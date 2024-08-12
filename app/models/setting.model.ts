import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Setting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare series: string

  @column()
  declare setId: string

  @column()
  declare setUrl: string

  @column()
  declare pullTimer: number

  @column()
  declare summonTimer: number

  @column()
  declare shinyDropRate: number
}
