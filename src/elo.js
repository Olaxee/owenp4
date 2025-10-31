function calculateElo(Ra, Rb, S) {
  const K = 16
  const expected = 1 / (1 + 10 ** ((Rb - Ra) / 400))
  return Math.round(Ra + K * (S - expected))
}