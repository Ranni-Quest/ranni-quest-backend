import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cardId')
      table.string('name')
      table.string('setId')
      table.string('setName')
      table.string('series')
      table.string('rarity')
      table.string('largeImageUrl')
      table.string('smallImageUrl')
      table.string('type')
      table.string('subtype')
      table.string('supertype')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
