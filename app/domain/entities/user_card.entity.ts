export default class UserCardEntity {
  constructor(
    public id: number,
    public cardId: string,
    public discordId: string,
    public isReverse: boolean
  ) {}
}
