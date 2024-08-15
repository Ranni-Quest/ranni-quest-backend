export default interface PokemonInterface {
  id: number
  name: string
  status: string
  isShiny: boolean
  artwork: string | null
  sprite: string | null
  types: string[]
  weaknesses: { [key: string]: number }
  resistances: { [key: string]: number }
  timestamp: number
}
