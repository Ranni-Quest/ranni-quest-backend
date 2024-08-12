export default class UserEntity {
  constructor(
    public id: number,
    public discordId: string,
    public lastTimePull: number,
    public lastTimeSummon: number
  ) {}
}
