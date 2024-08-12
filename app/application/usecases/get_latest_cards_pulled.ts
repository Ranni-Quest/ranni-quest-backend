import UserCardRepository from '#repositories/user_card.repository'
import { inject } from '@adonisjs/core'
import CardInterface from './interfaces/card.interface.js'
import { GetLatestCardsPulledInterface } from './usercases.interface.js'

@inject()
export default class GetLatestCardsPulled implements GetLatestCardsPulledInterface {
  constructor(protected userCardsRepository: UserCardRepository) {}

  execute(): Promise<CardInterface[]> {
    return this.userCardsRepository.findLatestCardsPulled()
  }
}
