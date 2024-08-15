export default class UserCardEntity {
  constructor(
    public cardId: string,
    public discordId: string | null,
    public pseudo: string | null,
    public isReverse: boolean,
    public rarity: string,
    public largeImageUrl: string,
    public smallImageUrl: string,
    public type: string,
    public subtype: string,
    public supertype: string,
    public effect: string,
    public rarityEffect: string,
    public setId: string,
    public series: string
  ) {}
}
