import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('cardId')
      table.string('discordId')
      table.boolean('isReverse')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
