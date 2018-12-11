document.addEventListener('DOMContentLoaded', startGame)



// Define your `board` object here!
var board = {};


var minRows = 2;
var maxRows = 6;
var minMines = 1;
var maxMines = 10;
// default values
var rows = 5;
var mineNo = 9;

function populateCells(){
  // make a cell object for every row, col position on board
  board.cells = [];
  for(var i=0; i<rows; i++){
    for(var j=0; j<rows; j++){
      board.cells.push({row: i, col: j, isMine: false, hidden: true});
    }
  }
  // assign mines
  var isAMine = randomRowCols();
  for(var i=0; i<isAMine.length; i++){
    board.cells[isAMine[i][0]*rows+isAMine[i][1]].isMine = true;
  }
  // count surrounding mines
  for(var i=0; i<board.cells.length; i++){
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i]);
  }
}

function randomRowCols(){
  var ranArray = [];
  for(var i=0; ranArray.length<mineNo; i++){
    var row = Math.floor(Math.random()*rows);
    var col = Math.floor(Math.random()*rows);
    // find if this value is already in the array
    var found = ranArray.find(function(pos){
      return pos[0]===row && pos[1]===col;
    })
    // if not in array then add
    if(found == undefined){
      ranArray.push([row, col]);
    }
    // console.log ("found? " + found + " row: " + row + " col: " + col);
  }
  return ranArray;
}

function startGame () {
  displayMessage('Let\'s play!');
  setInitParams();
}

function gameInit(){
  // set rows and mines
  rows = document.getElementById("rowNum").value;
  mineNo = document.getElementById("mineNum").value;
  if(mineNo == "" || rows == "") return; // do nothing if no input
  if(rows>maxRows) rows = maxRows;
  if(mineNo>=rows*rows) mineNo=rows*rows-1;
  
  populateCells();

  // remove restart button and input fields
  document.getElementsByTagName('button')[0].remove();
  document.getElementsByTagName('form')[0].remove();

  //set event listeners
  document.addEventListener('click', checkForWin)
  document.addEventListener('contextmenu', checkForWin)

  
  // Don't remove this function call: it makes the game work!
  lib.initBoard()
}


function checkForWin () {
  for (var i=0; i<board.cells.length; i++){
    // if not a mine but hidden - no win
    if(!board.cells[i].isMine && board.cells[i].hidden){
      return false;
    }
    // if is a mine but mark property does not exist or marked false
    if(board.cells[i].isMine){
      if(!board.cells[i].hasOwnProperty("isMarked")){
        return false;
      }
      if(!board.cells[i].isMarked){
        return false;
      }
    }
  }
  displayMessage('You win!');
  playSound("audio/applause.mp3");
  restartButton();
  return true;
}

function countSurroundingMines (cell) {
  var surroundingCells = getSurroundingCells(cell.row, cell.col);
  var mines = 0;
  for(var i=0; i<surroundingCells.length; i++){
    if (surroundingCells[i].isMine) mines++;
  }
  return mines;
}

function restartGame(){  
  // remove the current board and set up again
  var elem = document.getElementsByClassName('board')[0];
  while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
  }
  // remove restart button
  document.getElementsByTagName('button')[0].remove();

  // remove event listeners
  document.removeEventListener('click', checkForWin)
  document.removeEventListener('contextmenu', checkForWin)

  startGame();
}