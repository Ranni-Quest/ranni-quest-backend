import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pokemon_pendings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('discordId')
      table.integer('pokemonId')
      table.string('name')
      table.integer('isShiny')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
