import CardRepository from '#repositories/card.repository'
import SettingRepository from '#repositories/setting.repository'
import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ChangeCardsSet extends BaseCommand {
  static commandName = 'change:cards-set'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  @inject()
  async run(cardRepository: CardRepository, settingRepository: SettingRepository) {
    const output = await cardRepository.randomAvailableCardSet()
    this.logger.info('new cards set' + JSON.stringify(output))
    await settingRepository.query().updateOrCreate({ id: 1 }, output)
    this.logger.info('finish')
  }
}
