import Card from '#models/card'
import { CardRarityType } from './rarities.type.js'

export type CardsSetType = {
  [key in CardRarityType]?: Array<Card>
}
