import { supabase } from './supabase.js'

export function calculateElo(Ra, Rb, S) {
  const K = 16
  const expected = 1 / (1 + 10 ** ((Rb - Ra) / 400))
  return Math.round(Ra + K * (S - expected))
}

export async function updateElo(player1, player2, winnerId) {
  const S1 = (winnerId === player1.id) ? 1 : 0
  const S2 = (winnerId === player2.id) ? 1 : 0

  const newElo1 = calculateElo(player1.elo, player2.elo, S1)
  const newElo2 = calculateElo(player2.elo, player1.elo, S2)

  await supabase.from('users').update({ elo: newElo1 }).eq('id', player1.id)
  await supabase.from('users').update({ elo: newElo2 }).eq('id', player2.id)
}