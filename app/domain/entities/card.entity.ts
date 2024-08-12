export default class CardEntity {
  constructor(
    public id: number,
    public cardId: string,
    public name: string,
    public setId: string,
    public setName: string,
    public series: string,
    public rarity: string,
    public largeImageUrl: string,
    public smallImageUrl: string,
    public type: string,
    public subtype: string,
    public supertype: string
  ) {}
}
