import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('series')
      table.string('setId')
      table.string('setUrl')
      table.string('pullTimer')
      table.string('summonTimer')
      table.string('shinyDropRate')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
