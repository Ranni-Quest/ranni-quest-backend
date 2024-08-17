import User from '#models/user.model'
import { UserRepositoryInterface } from '#repositories/repositories.interface'

export default class UserRepository implements UserRepositoryInterface {
  /**
   * save pull timestamp
   * @param discordId - discord id
   */
  async savePullTimestamp(discordId: string): Promise<void> {
    await User.updateOrCreate({ discordId }, { lastTimePull: Math.floor(Date.now() / 1000) })
  }

  /**
   * save summon timestamp
   * @param discordId - discord id
   */
  async saveSummonTimestamp(discordId: string): Promise<void> {
    await User.updateOrCreate({ discordId }, { lastTimeSummon: Math.floor(Date.now() / 1000) })
  }
}
