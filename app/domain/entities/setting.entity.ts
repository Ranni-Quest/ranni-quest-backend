export default class SettingEntity {
  constructor(
    public id: number,
    public series: string,
    public setId: string,
    public setUrl: string,
    public pullTimer: number,
    public summonTimer: number,
    public shinyDropRate: number
  ) {}
}
