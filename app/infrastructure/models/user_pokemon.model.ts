import { PokemonRarityType } from '#types/rarities.type'
import { TypeName } from '#usecases/types/type_name.type'
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
  declare status: PokemonRarityType

  @column()
  declare isShiny: boolean

  @column()
  declare sprite: string

  @column()
  declare artwork: string

  @column()
  declare types: TypeName[]

  @column()
  declare resistances: { [key: string]: number }

  @column()
  declare weaknesses: { [key: string]: number }

  @column()
  declare timestamp: number
}
