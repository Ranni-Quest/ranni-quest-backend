import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare discordId: string

  @column()
  declare type: string

  @column()
  declare message: string

  @column()
  declare isError: boolean
}
