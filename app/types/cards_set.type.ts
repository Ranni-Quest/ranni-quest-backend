import FullCardInfoEntity from '#entities/full_card_info.entity'
import UserCardEntity from '#entities/user_card.entity'
import { CardRarityType } from '#types/rarities.type'

export type AllCardsSetWithUserType = {
  [key in CardRarityType]?: Array<UserCardEntity>
}

export type CardsSetType = {
  [key in CardRarityType]?: Array<FullCardInfoEntity>
}
