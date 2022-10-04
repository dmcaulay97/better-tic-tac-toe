import './App.css';
import { useState, useEffect } from 'react'

function App() {

  const [boardState, setBoardState] = useState(['', '', '', '', '', '', '', '', '']);
  const [turn, setTurn] = useState('X');
  const [gameOver, setGameOver] = useState(true)



  useEffect(() => {
    if (!gameOver && turn === 'O') {
      const overlay = document.getElementsByClassName('overlay')[0];
      overlay.style.display = 'flex';
      //randomMove
      // setTimeout(computerMove, 500);

      //AI move
      setTimeout(computerMove, 500, true, bestMove(boardState))
    }
  }, [turn]);

  const minimax = (board, depth, isMaximizing, index) => {
    // console.log(board)
    let score;
    let draw = checkDraw(board)
    let win = checkWin(index, board);
    // console.log(draw, win)
    if (draw) {
      score = 0
    } else if (isMaximizing) {
      score = win ? 1 : null
    } else {
      score = win ? -1 : null
    }

    // console.log(score, score !== null)
    if (score !== null) {
      // console.log('this')
      return score
    } else if (isMaximizing) {
      // console.log("checking X Move")
      let tempboard = board
      let bestScore = Infinity
      tempboard.forEach((e, index) => {
        if (e === '') {
          tempboard = makeMove('X', index, tempboard, true)
          let score = minimax(tempboard, depth + 1, false, index)
          // console.log(score)
          tempboard = makeMove('', index, tempboard, true)
          // console.log(score < bestScore)
          if (score < bestScore) {
            bestScore = score
            // console.log(bestScore)
          }
        }
      })
      // // console.log(bestScore)
      return bestScore;
    } else {
      // console.log('checking O Move')
      let tempboard = board
      let bestScore = -Infinity
      tempboard.forEach((e, index) => {
        if (e === '') {
          tempboard = makeMove('O', index, tempboard, true)
          let score = minimax(tempboard, depth + 1, true, index)
          tempboard = makeMove('', index, tempboard, true)
          if (score > bestScore) {
            bestScore = score
          }
        }
      })
      // console.log(bestScore)
      return bestScore;
    }
  }

  const bestMove = (board) => {
    let tempboard = board
    let bestScore = -Infinity
    let move;
    tempboard.forEach((e, index) => {
      // console.log(e === '')
      if (e === '') {
        tempboard = makeMove('O', index, tempboard, true)
        let score = minimax(tempboard, 0, true, index)
        // console.log(score)
        tempboard = makeMove('', index, tempboard, true)
        if (score > bestScore) {
          bestScore = score
          move = index;
          // console.log(bestScore, move)
        }
      }
    })
    return move
  }
  const computerMove = (ai, position) => {
    if (ai == true) {
      const squares = document.getElementsByClassName('square');
      const overlay = document.getElementsByClassName('overlay')[0];
      overlay.style.display = 'none';
      squares[position].click()
    } else {
      const emptySquares = [];
      boardState.forEach((e, index) => {
        if (e === '') {
          emptySquares.push(index)
        }
      });
      const overlay = document.getElementsByClassName('overlay')[0];
      overlay.style.display = 'none';
      const squares = document.getElementsByClassName('square');
      squares[emptySquares[Math.floor(Math.random() * emptySquares.length)]].click()
    }
  };

  const startGame = () => {
    setBoardState(['', '', '', '', '', '', '', '', ''])
    setTurn('X')
    setGameOver(false)
    const overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'none';
    const winner = document.getElementsByClassName('winner')[0];
    winner.style.display = 'none'
    const start = document.getElementsByClassName('start')[0];
    start.style.display = 'none'
  };

  const endGame = (draw) => {
    setGameOver(true)
    const overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'flex';

    const start = document.getElementsByClassName('start')[0];
    start.style.display = 'initial'
    const winner = document.getElementsByClassName('winner')[0];
    winner.style.display = 'flex'
    if (draw) {
      winner.textContent = `The Game is a Draw`
    } else {
      winner.textContent = `${turn} is the winner`
    }
  };

  const checkCol = (col, board) => {
    if (board[col] === board[col + 3] && board[col] === board[col + 6]) {
      // console.log('col')
      return true;
    };
  };

  const checkRow = (row, board) => {
    if (board[row] === board[row + 1] && board[row] === board[row + 2]) {
      // console.log('row')
      return true;
    };
  };

  const checkDiag = (board) => {
    if (board[0] === board[4] && board[0] === board[8] && board[0] !== '') {
      // console.log('diaga')
      return true;
    } else if (board[2] === board[4] && board[2] === board[6] && board[2] !== '') {
      // console.log('diagb')
      return true;
    };
  };

  const checkDraw = (board) => {
    let full = true;
    board.forEach((e) => {
      if (e === '') {
        full = false;
      }
    })
    if (full) {
      // console.log('draw')
      return true;
    } else {
      return false;
    }
  }

  const checkWin = (position, board) => {
    const col = position % 3;
    const row = Math.floor(position / 3) * 3;
    const colWin = checkCol(col, board)
    const rowWin = checkRow(row, board);
    let diagWin = false
    if (position % 2 === 0) {
      diagWin = checkDiag(board);
    };
    if (colWin || rowWin || diagWin) {
      return true;
    } else {
      return false;
    };
  };

  const makeMove = (letter, position, board, test) => {
    if (test) {
      board.splice(position, 1, letter)
      return board;
    }

    else if (boardState[position] === '') {
      const newBoard = board;
      newBoard.splice(position, 1, letter);
      setBoardState(newBoard);
      if (checkWin(position, newBoard)) {
        endGame()
      } else if (checkDraw(newBoard)) {
        endGame('draw')
      }
      turn === 'X' ? setTurn('O') : setTurn('X');
    }
  };

  return (
    <div className="App">
      <div className='board'>
        <div className='square' onClick={() => makeMove(turn, 0, boardState)}>
          {boardState[0]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 1, boardState)}>
          {boardState[1]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 2, boardState)}>
          {boardState[2]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 3, boardState)}>
          {boardState[3]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 4, boardState)}>
          {boardState[4]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 5, boardState)}>
          {boardState[5]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 6, boardState)}>
          {boardState[6]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 7, boardState)}>
          {boardState[7]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 8, boardState)}>
          {boardState[8]}
        </div>
      </div>

      <div className='overlay'>
        <div className='winner'>
          TIC-TAC-TOE
        </div>
        <button className='start' onClick={startGame}>
          New Game
        </button>
      </div>
    </div>
  );
}

export default App;
