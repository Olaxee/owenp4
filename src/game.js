import { updateElo } from './elo.js'
import { supabase } from './supabase.js'

const ROWS = 6
const COLS = 7
let board = Array.from({length: ROWS}, () => Array(COLS).fill(null))
let currentPlayer = 'red' // ou 'yellow'

// Dessin de la grille et gestion des clics
export function initGame() {
  const grid = document.getElementById('grid')
  grid.innerHTML = ''
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div')
    row.classList.add('row')
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.dataset.row = r
      cell.dataset.col = c
      cell.addEventListener('click', () => handleMove(r, c))
      row.appendChild(cell)
    }
    grid.appendChild(row)
  }
}

function handleMove(r, c) {
  for (let i = ROWS - 1; i >= 0; i--) {
    if (!board[i][c]) {
      board[i][c] = currentPlayer
      updateUI(i, c)
      if (checkWin(i, c)) endGame()
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'
      break
    }
  }
}

function updateUI(r, c) {
  const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`)
  cell.style.backgroundColor = board[r][c]
}

// À compléter : détection de victoire
function checkWin(r, c) {
  // logique classique Puissance 4
  return false
}

// Fin du jeu et mise à jour Elo
function endGame(winnerId) {
  const user = JSON.parse(localStorage.getItem('user'))
  const opponent = {} // récupérer l'adversaire depuis Supabase ou localStorage
  updateElo(user, opponent, winnerId)
}