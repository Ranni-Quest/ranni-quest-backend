import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('discordId')
      table.string('type')
      table.string('message')
      table.integer('isError')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
