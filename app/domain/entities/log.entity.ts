export default class LogEntity {
  constructor(
    public id: number,
    public discordId: string,
    public type: string,
    public message: string,
    public isError: boolean
  ) {}
}
