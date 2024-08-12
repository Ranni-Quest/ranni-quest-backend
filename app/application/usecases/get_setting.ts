import SettingEntity from '#entities/setting.entity'
import SettingRepository from '#repositories/setting.repository'
import { inject } from '@adonisjs/core'
import { GetSettingInterface } from './usercases.interface.js'

@inject()
export default class GetSetting implements GetSettingInterface {
  constructor(private readonly settingRepository: SettingRepository) {}

  async execute(): Promise<SettingEntity> {
    return await this.settingRepository.getSetting()
  }
}
