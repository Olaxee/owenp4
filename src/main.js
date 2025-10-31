import { supabase } from './supabase.js'

export async function login(username, password) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()
  
  if (error) throw error
  localStorage.setItem('user', JSON.stringify(data))
  return data
}

export async function signup(username, password) {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, password })
    .select()
    .single()
  
  if (error) throw error
  localStorage.setItem('user', JSON.stringify(data))
  return data
}

export async function findMatch(currentUser) {
  const { data: opponents } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUser.id)
  
  const best = opponents.sort(
    (a, b) => Math.abs(a.elo - currentUser.elo) - Math.abs(b.elo - currentUser.elo)
  )[0]

  // Ici, tu peux créer un match dans Supabase si besoin
  return best
}