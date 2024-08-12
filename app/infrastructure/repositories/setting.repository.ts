import SettingEntity from '#entities/setting.entity'
import Setting from '../models/setting.model.js'
import { SettingRepositoryInterface } from '#repositories/repositories.interface'

export default class SettingRepository implements SettingRepositoryInterface {
  async getSetting(): Promise<SettingEntity> {
    const output = await Setting.findBy({})
    if (!output) {
      throw new Error('Setting not found')
    }
    return new SettingEntity(
      output.id,
      output.series,
      output.setId,
      output?.setUrl,
      output?.pullTimer,
      output?.summonTimer,
      output?.shinyDropRate
    )
  }
}
