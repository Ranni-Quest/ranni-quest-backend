import Setting from '#models/setting.model'
import { SettingRepositoryInterface } from '#repositories/repositories.interface'

export default class SettingRepository implements SettingRepositoryInterface {
  /**
   * get setting
   * @returns setting
   */
  async getSetting(): Promise<Setting> {
    const output = await Setting.findBy({})
    if (!output) {
      throw new Error('Setting not found')
    }
    return output
  }
}
