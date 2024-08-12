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
}
