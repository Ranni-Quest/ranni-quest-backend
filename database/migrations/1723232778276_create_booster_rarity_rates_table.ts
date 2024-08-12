import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'booster_rarity_rates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.double('dropRate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
