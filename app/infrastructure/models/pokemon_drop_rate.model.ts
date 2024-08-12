import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PokemonDropRate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rarity: string

  @column()
  declare dropRate: number

  @column()
  declare pokemons: number[]
}
