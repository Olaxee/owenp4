
async function findMatch(currentUser) {
  const { data: opponents } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUser.id)
  
  const best = opponents.sort(
    (a, b) => Math.abs(a.elo - currentUser.elo) - Math.abs(b.elo - currentUser.elo)
  )[0]

  return best
}