import User from '#models/user.model'
import { UserRepositoryInterface } from './repositories.interface.js'

export default class UserRepository implements UserRepositoryInterface {
  async savePullTimestamp(discordId: string): Promise<void> {
    await User.updateOrCreate({ discordId }, { lastTimePull: Math.floor(Date.now() / 1000) })
  }
}
