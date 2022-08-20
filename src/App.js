import './App.css';
import { useState, useEffect } from 'react'

function App() {

  const [boardState, setBoardState] = useState(['', '', '', '', '', '', '', '', '']);
  const [turn, setTurn] = useState('X');
  const [gameOver, setGameOver] = useState(true)

  useEffect(() => {
    if (!gameOver && turn === 'O') {
      // randomMove();
      console.log(minimax(boardState, true))
    }
  }, [turn]);

  const randomMove = () => {
    const emptySquares = [];
    boardState.forEach((e, index) => {
      if (e === '') {
        emptySquares.push(index)
      }
    });
    const squares = document.getElementsByClassName('square');
    squares[emptySquares[Math.floor(Math.random() * emptySquares.length)]].click()
  };

  const startGame = () => {
    setBoardState(['', '', '', '', '', '', '', '', ''])
    setTurn('X')
    setGameOver(false)
    const overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'none';
    const winner = document.getElementsByClassName('winner')[0];
    winner.style.display = 'flex'
  };

  const endGame = (draw) => {
    setGameOver(true)
    const overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'flex';
    const winner = document.getElementsByClassName('winner')[0];
    if (draw) {
      winner.textContent = `The Game is a Draw`
    } else {
      winner.textContent = `${turn} is the winner`
    }
  };

  const checkCol = (col) => {
    if (boardState[col] === boardState[col + 3] && boardState[col] === boardState[col + 6]) {
      // console.log('col')
      return true;
    };
  };

  const checkRow = (row) => {
    if (boardState[row] === boardState[row + 1] && boardState[row] === boardState[row + 2]) {
      // console.log('row')
      return true;
    };
  };

  const checkDiag = () => {
    if (boardState[0] === boardState[4] && boardState[0] === boardState[8] && boardState[0] !== '') {
      // console.log('diaga')
      return true;
    } else if (boardState[2] === boardState[4] && boardState[2] === boardState[6] && boardState[2] !== '') {
      // console.log('diagb')
      return true;
    };
  };

  const checkDraw = () => {
    let full = true;
    boardState.forEach((e) => {
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

  const checkWin = (position) => {
    const col = position % 3;
    const row = Math.floor(position / 3) * 3;
    const colWin = checkCol(col)
    const rowWin = checkRow(row);
    let diagWin = false
    if (position % 2 === 0) {
      diagWin = checkDiag();
    };
    if (colWin || rowWin || diagWin) {
      return true;
    };
  };

  const makeMove = (letter, position) => {
    if (boardState[position] === '') {
      const newBoard = boardState;
      newBoard.splice(position, 1, letter);
      setBoardState(newBoard);
      if (checkWin(position)) {
        endGame()
      }
      if (checkDraw()) {
        endGame('draw')
      }
      turn === 'X' ? setTurn('O') : setTurn('X');
    }
  };

  //the function needs to let the AI know which move is giving max result. As of now there is no reference to the move returned in the function only the exaluation. Will probobly use object with key being position of move and value being the evaluation.
  const minimax = (position, maximizingPlayer) => {
    if (checkWin(position)) {
      let totalEmpty = 1;
      position.forEach((e) => {
        if (e === '') {
          totalEmpty++
        }
      })
      if (maximizingPlayer) {
        return 1 * totalEmpty
      } else {
        return -1 * totalEmpty
      }

    } else if (checkDraw()) {
      return 0

    } else if (maximizingPlayer) {
      let maxEval = Number.NEGATIVE_INFINITY
      position.forEach((e, index) => {
        if (e === '') {
          let newPosition = position;
          newPosition.splice(index, 1, 'O')
          const evaluation = minimax(newPosition, false)
          maxEval = Math.max(maxEval, evaluation)

        }
      })
      return maxEval

    } else {
      let minEval = Number.POSITIVE_INFINITY
      position.forEach((e, index) => {
        if (e === '') {
          let newPosition = position;
          newPosition.splice(index, 1, 'X')
          const evaluation = minimax(newPosition, true)
          minEval = Math.min(minEval, evaluation)

        }
      })
      return minEval
    }
  }


  return (
    <div className="App">
      <div className='board'>
        <div className='square' onClick={() => makeMove(turn, 0)}>
          {boardState[0]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 1)}>
          {boardState[1]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 2)}>
          {boardState[2]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 3)}>
          {boardState[3]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 4)}>
          {boardState[4]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 5)}>
          {boardState[5]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 6)}>
          {boardState[6]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 7)}>
          {boardState[7]}
        </div>
        <div className='square' onClick={() => makeMove(turn, 8)}>
          {boardState[8]}
        </div>
      </div>

      <div className='overlay'>
        <div className='winner'>
        </div>
        <button className='start' onClick={startGame}>
          New Game
        </button>
      </div>
    </div>
  );
}

export default App;
