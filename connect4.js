/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *    Initiate all cells to undefined
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(new Array(WIDTH).fill(undefined));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');
  htmlBoard.innerHTML = '';
  // Create the top row where pieces are dropped from
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // create a td for each drop point and give it an id of its position
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create the rest of the board by looping through the width and height
  // set id to row-column starting from 0-0 at the top left
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // need to use [id=''] because css doesn't like IDs that start with a number
  const cell = document.querySelector(`[id='${y}-${x}']`)
  const div = document.createElement('div');
  div.classList.add('piece', `p${currPlayer}`);
  cell.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  // adapted from https://macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
  // Fire alert after the DOM updates. First request is before the frame is updated so update at second frame request.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      alert(msg);
      newGame();
    });
  });
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) {
    return endGame('We have a tie!');
  }

  // switch players
  currPlayer = 3 - currPlayer;
}

// Return true if board is filled up. A cell is empty if it is undefined.
function checkForTie() {
  // check every cell is not undefined
  return board.every(row => row.every( cell => cell));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // loop through every cell checking the horizontal, vertical and diagonals to see if the same player is in each cell
  // return true if either direction is valid
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function newGame() {
  board = [];
  makeBoard();
  makeHtmlBoard();
}

newGame();
