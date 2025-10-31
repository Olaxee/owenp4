import { supabase } from './supabase.js'

const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const signupBtn = document.getElementById('signupBtn')
const message = document.getElementById('message')

// INSCRIPTION
signupBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()

  if (!username || !password) {
    message.textContent = 'Remplis tous les champs !'
    return
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password, elo: 1000 }])
    .select()
  
  if (error) {
    message.textContent = 'Erreur : ' + error.message
  } else {
    message.textContent = 'Compte créé ! Tu peux te connecter.'
  }
})

// CONNEXION
loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()

  if (!username || !password) {
    message.textContent = 'Remplis tous les champs !'
    return
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single()

  if (error || !data) {
    message.textContent = 'Nom d’utilisateur ou mot de passe incorrect'
  } else {
    // Stocke l'utilisateur pour la suite
    localStorage.setItem('user', JSON.stringify(data))
    window.location.href = '/game.html' // Redirige vers le jeu
  }
})