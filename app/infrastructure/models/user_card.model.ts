import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cardId: string

  @column()
  declare discordId: string

  @column()
  declare isReverse: boolean
}
