const board = document.getElementById('board');
let currentPlayer = 'red';
let grid = Array(6).fill(0).map(()=>Array(7).fill(null));

// Créer la grille
for(let r=0;r<6;r++){
  for(let c=0;c<7;c++){
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = r;
    cell.dataset.col = c;
    cell.addEventListener('click', ()=>makeMove(c));
    board.appendChild(cell);
  }
}

function makeMove(col){
  for(let r=5;r>=0;r--){
    if(!grid[r][col]){
      grid[r][col] = currentPlayer;
      drawBoard();
      if(checkWin(r,col)){
        endGame(currentPlayer);
        return;
      }
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      break;
    }
  }
}

function drawBoard(){
  for(let r=0;r<6;r++){
    for(let c=0;c<7;c++){
      const cell = board.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      cell.classList.remove('red','yellow');
      if(grid[r][c]) cell.classList.add(grid[r][c]);
    }
  }
}

// Vérifier victoire
function checkWin(r,c){
  const directions = [
    [[0,1],[0,-1]], [[1,0],[-1,0]], [[1,1],[-1,-1]], [[1,-1],[-1,1]]
  ];
  for(const dir of directions){
    let count=1;
    for(const [dx,dy] of dir){
      let x=r+dx, y=c+dy;
      while(x>=0 && x<6 && y>=0 && y<7 && grid[x][y]===currentPlayer){
        count++;
        x+=dx; y+=dy;
      }
    }
    if(count>=4) return true;
  }
  return false;
}

// Fin de partie
async function endGame(winner){
  alert(`${winner} a gagné !`);

  let userScore = (winner==='red')?1:0;
  let opponentScore = 1 - userScore;

  let newUserElo = Math.round(updateElo(user.elo, opponent.elo, userScore));
  let newOpponentElo = Math.round(updateElo(opponent.elo, user.elo, opponentScore));

  await supabase.from('users').update({elo:newUserElo}).eq('id', user.id);
  await supabase.from('users').update({elo:newOpponentElo}).eq('id', opponent.id);

  document.getElementById('status').innerText = `Partie terminée. Votre Elo : ${newUserElo}`;
}