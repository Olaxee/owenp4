
import { supabase } from './supabase.js'
import { updateElo } from './elo.js'

const user = JSON.parse(localStorage.getItem('user'))
const status = document.getElementById('status')
const boardEl = document.getElementById('board')

if (!user) window.location.href = '/index.html'

// 🟡 Config du jeu
const ROWS = 6
const COLS = 7
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
let myTurn = false
let match = null
let playerNum = 0 // 1 ou 2

// 🔹 Créer la grille HTML
function renderBoard() {
  boardEl.innerHTML = ''
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('tr')
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('td')
      cell.dataset.row = r
      cell.dataset.col = c
      cell.style.width = '50px'
      cell.style.height = '50px'
      cell.style.border = '1px solid white'
      cell.style.textAlign = 'center'
      cell.style.fontSize = '30px'
      cell.style.cursor = 'pointer'
      cell.textContent = board[r][c] === 1 ? '🔴' : board[r][c] === 2 ? '🟡' : ''
      cell.addEventListener('click', () => placeDisc(c))
      row.appendChild(cell)
    }
    boardEl.appendChild(row)
  }
}

// 🔹 Placement d’un pion
async function placeDisc(col) {
  if (!myTurn) return
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!board[r][col]) {
      board[r][col] = playerNum
      myTurn = false
      renderBoard()
      await supabase
        .from('matches')
        .update({ board })
        .eq('id', match.id)
      checkWin()
      status.textContent = "Tour de l'adversaire..."
      return
    }
  }
}

// 🔹 Vérification de victoire
function checkWin() {
  const directions = [
    [0,1],[1,0],[1,1],[1,-1]
  ]

  for (let r=0; r<ROWS; r++) {
    for (let c=0; c<COLS; c++) {
      const player = board[r][c]
      if (!player) continue
      for (let [dr, dc] of directions) {
        let count = 1
        let rr=r+dr, cc=c+dc
        while(rr>=0 && rr<ROWS && cc>=0 && cc<COLS && board[rr][cc]===player){
          count++
          rr+=dr
          cc+=dc
        }
        if(count>=4){
          status.textContent = (player===playerNum ? 'Vous avez gagné !' : 'Vous avez perdu !')
          updateEloAfterGame(player)
          myTurn=false
        }
      }
    }
  }
}

// 🔹 Mettre à jour l’Elo après partie
async function updateEloAfterGame(winnerPlayerNum){
  const { data: players } = await supabase
    .from('users')
    .select('*')
    .in('id', [match.player1, match.player2])
  const player1 = players.find(p => p.id === match.player1)
  const player2 = players.find(p => p.id === match.player2)
  const winnerId = winnerPlayerNum === 1 ? player1.id : player2.id
  await updateElo(player1, player2, winnerId)
}

// 🔹 Matchmaking simple
async function findMatch() {
  // Vérifier s’il existe un match en attente
  const { data: waiting } = await supabase
    .from('matches')
    .select('*')
    .is('player2', null)
    .limit(1)

  if (waiting.length > 0) {
    match = waiting[0]
    await supabase
      .from('matches')
      .update({ player2: user.id, board })
      .eq('id', match.id)
    playerNum = 2
    myTurn = false
  } else {
    // Crée un nouveau match
    const { data: newMatch } = await supabase
      .from('matches')
      .insert({ player1: user.id, board })
      .select()
    match = newMatch[0]
    playerNum = 1
    myTurn = true
    status.textContent = 'En attente d’un adversaire...'
  }

  renderBoard()
  listenMatchUpdates()
}

// 🔹 Écoute des mises à jour en temps réel
function listenMatchUpdates() {
  supabase
    .from(`matches:id=eq.${match.id}`)
    .on('UPDATE', payload => {
      const updated = payload.new
      board = updated.board
      renderBoard()
      if ((playerNum === 1 && updated.player2) || (playerNum === 2)) {
        myTurn = true
        status.textContent = 'C’est ton tour !'
      }
    })
    .subscribe()
}

// 🔹 Démarrer
findMatch()