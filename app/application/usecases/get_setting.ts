import Setting from '#models/setting.model'
import SettingRepository from '#repositories/setting.repository'
import { GetSettingInterface } from '#usecases/usercases.interface'
import { inject } from '@adonisjs/core'

@inject()
export default class GetSetting implements GetSettingInterface {
  constructor(private readonly settingRepository: SettingRepository) {}

  /**
   * Get setting
   * @returns setting
   */
  async execute(): Promise<Setting> {
    return await this.settingRepository.getSetting()
  }
}
