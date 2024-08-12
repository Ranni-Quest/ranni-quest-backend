import PokemonPending from '#models/pokemon_pending.model'

export default class PokemonService {
  static async findUniquePendingPokemon(discordId: string, pokemonId: number) {
    return await PokemonPending.findBy({
      discordId,
      pokemonId,
    })
    // return await prisma.pendingPokemon.findUnique({
    //   where: {
    //     discordId: discordId,
    //     pokemonId: pokemonId,
    //   },
    // });
  }

  static async upsertPokemon(
    discordId: string,
    pokemonInfo: {
      pokemonId: number
      name: string
      image: string
      sprite: string
      isShiny: boolean
    }
  ) {
    await PokemonPending.updateOrCreate(
      {
        discordId,
      },
      {
        discordId,
        ...pokemonInfo,
      }
    )
    // await prisma.pendingPokemon.upsert({
    //   where: {
    //     discordId: discordId,
    //   },
    //   update: {
    //     discordId,
    //     ...pokemonInfo,
    //   },
    //   create: {
    //     discordId,
    //     ...pokemonInfo,
    //   },
    // })
  }
}
