import FullCardInfoEntity from '#entities/full_card_info.entity'
import UserCardEntity from '#entities/user_card.entity'
import { CardRarityType } from './rarities.type.js'

export type AllCardsSetWithUserType = {
  [key in CardRarityType]?: Array<UserCardEntity>
}

export type CardsSetType = {
  [key in CardRarityType]?: Array<FullCardInfoEntity>
}
