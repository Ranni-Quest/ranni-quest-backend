import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pokemon_drop_rates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('rarity')
      table.string('dropRate')
      table.json('pokemons')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
