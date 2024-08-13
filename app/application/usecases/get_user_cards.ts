import UserCardEntity from '#entities/user_card.entity'
import UserCardRepository from '#repositories/user_card.repository'
import { inject } from '@adonisjs/core'
import { GetUserCardsInterface } from './usercases.interface.js'

@inject()
export default class GetUserCards implements GetUserCardsInterface {
  constructor(private readonly userCardRepository: UserCardRepository) {}

  async execute(discordId: string, offset: number, limit: number): Promise<UserCardEntity[]> {
    const output = await this.userCardRepository.findByDiscordId(discordId, offset, limit)
    return output
  }
}
