import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'card_drop_rates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('series')
      table.string('rarity')
      table.json('values')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
