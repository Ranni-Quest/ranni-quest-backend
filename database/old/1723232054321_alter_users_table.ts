import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('pseudo')
      table.string('discord_id')
      table.integer('lastTimePull')
      table.integer('lastTimeSummon')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('password')
      table.dropColumn('email')
      table.dropColumn('full_name')
    })
  }
}
