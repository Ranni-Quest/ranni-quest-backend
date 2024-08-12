export const checkPull = (lastTimePull: number | null, pullTimer: number = 1800) => {
  return pullTimer <= Math.floor(Date.now() / 1000) - (lastTimePull ?? 0)
}

export const checkSummon = (lastTimeSummon: number | null, summonTimer: number = 600) => {
  return summonTimer <= Math.floor(Date.now() / 1000) - (lastTimeSummon ?? 0)
}
