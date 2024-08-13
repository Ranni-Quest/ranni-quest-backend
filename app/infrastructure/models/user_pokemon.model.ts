import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserPokemon extends BaseModel {
  static table = 'user_pokemons'
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
}
