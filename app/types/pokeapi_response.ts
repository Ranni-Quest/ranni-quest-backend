export interface PokemonSpeciesResponse {
  name: string
  names: Array<{ language: { name: string }; name: string }>
}

export interface PokemonInfoResponse {
  types: Array<{ type: { name: string } }>
}
