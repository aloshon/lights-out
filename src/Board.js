import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=.3 }) {
  const [numTries, setNumTries] = useState(0);

  // Get best score from local storage, set to 0 if first time
  let bestscore = localStorage.getItem("bestscore", 100);
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for(let y = 0; y < nrows; y++){
      let row = [];
      for(let x = 0; x < ncols; x++){
        // if random number is less than chanceLightStartsOn, 
        // then this cell will start unlit
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    let result = true;
    for(let i = 0; i < board.length; i++){
      for(let j = 0; j < board[i].length; j++){
        if(!board[i][j]) result = false;
      }
    }
    return result;
  }

  // Refershes page when clicked, only shown when game is over
  function refreshPage(){
    window.location.reload();
  }

  function flipCellsAround(coord) {
    setNumTries(numTries + 1)
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a deep copy of the oldBoard
      const copyOld = oldBoard.map(row => [...row]);;

      // In the copy, flip this cell and the cells around it
      flipCell(y, x, copyOld);
      flipCell(y+1, x, copyOld);
      flipCell(y, x+1, copyOld);
      flipCell(y-1, x, copyOld);
      flipCell(y, x-1, copyOld);

      return copyOld;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    // If a new bestscore is acheived, set it
    if(bestscore !== null){
      if (bestscore > numTries) {
          localStorage.setItem("bestscore", numTries);      
      }
    } else {
      localStorage.setItem("bestscore", numTries);
    }
    return (
    <div>
      <h1>You Win!</h1>
      <h2>End Score: {numTries}</h2>
      <button onClick={refreshPage}>Restart</button>
      </div>
    );
  }


  // make table board
  let tableBoard = [];

  for(let y = 0; y < nrows; y++){
    let row = [];
    for(let x = 0; x < ncols; x++){
      let coords = `${y}-${x}`;
      row.push(
        <Cell key={coords}
        isLit={board[y][x]}
        flipCellsAroundMe={() => flipCellsAround(coords)}/>
      )
    }
    tableBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <>
    <h1>Best Score: {bestscore}</h1>
    <h2>{numTries}</h2>
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
    </>
  );
}

export default Board;
