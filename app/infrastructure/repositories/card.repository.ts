import { CardRepositoryInterface } from '#repositories/repositories.interface'
import db from '@adonisjs/lucid/services/db'

export default class CardRepository implements CardRepositoryInterface {
  async randomAvailableCardSet() {
    const output = await db.rawQuery(`
      SELECT DISTINCT(c.set_id), c.series
      FROM cards c
      LEFT JOIN user_cards uc on c.card_id = uc.card_id
      WHERE c.rarity NOT IN ( 'common', 'uncommon', 'rare', 'rare_holo', 'amazing_rare' ) 
        AND uc.card_id IS NULL
        AND c.set_id IN ('sv1', 'sv2', 'sv3pt5n', 'sv4', 'sv4pt5', 'sv5', 'sv6', 'sv6pt5', 
          'swsh1', 'swsh2', 'swsh3', 'swsh4', 'swsh5', 'swsh6', 'swsh7', 'swsh8', 'swsh9', 'swsh10', 'swsh11', 'swsh12', 'swsh12pt5', 'swsh35', 'swsh45')
      ORDER BY RAND()
      LIMIT 1`)

    return { setId: output[0][0].set_id, series: output[0][0].series }
  }
}
