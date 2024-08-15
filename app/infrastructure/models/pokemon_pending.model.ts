import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PokemonPending extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare discordId: string

  @column()
  declare pokemonId: number

  @column()
  declare name: string

  @column()
  declare isShiny: boolean

  @column()
  declare sprite: string

  @column()
  declare artwork: string

  @column()
  declare types: string[]

  @column()
  declare weaknesses: string[]

  @column()
  declare timestamp: number
}
