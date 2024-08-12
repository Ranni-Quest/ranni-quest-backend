import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_pokemon'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('discordId')
      table.string('pokemonId')
      table.string('name')
      table.boolean('isShiny')
      table.string('sprite')
      table.string('artwork')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
