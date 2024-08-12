export const constructPokemonInfo = (pokemon: {
  id: number
  discordId: string
  pokemonId: number
  name: string
  isShiny: boolean
}) => {
  return {
    pokemonId: pokemon.pokemonId,
    name: pokemon.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
      pokemon.isShiny ? 'shiny/' : ''
    }${pokemon.pokemonId}.png`,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      pokemon.isShiny ? 'shiny/' : ''
    }${pokemon.pokemonId}.png`,
    isShiny: pokemon.isShiny,
  }
}
