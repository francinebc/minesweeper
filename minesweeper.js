document.addEventListener('DOMContentLoaded', startGame)




// Global variables
var board = {};

var minRows = 2;
var maxRows = 6;
var minMines = 1;
var maxMines = 10;

// default values
var rows = 5;
var mineNo = 9;

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

  lib.initBoard()
}

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

/**
 * This function returns an array of unique x,y co-ordinates, randomly generated.
 * The length of the array is determined by the number of mines chosen by the user.
 */
function randomRowCols(){
  var ranArray = [];
  for(var i=0; ranArray.length<mineNo; i++){
    var row = Math.floor(Math.random()*rows);
    var col = Math.floor(Math.random()*rows);
    // find if this value is already in the array
    var found = ranArray.find(function(pos){
      return pos[0]===row && pos[1]===col;
    })
    // add to array if not already in array
    if(found == undefined){
      ranArray.push([row, col]);
    }
  }
  return ranArray;
}

function checkForWin () {
  // check if winning condition not yet met
  for (var i=0; i<board.cells.length; i++){
    if(!board.cells[i].isMine && board.cells[i].hidden){
      return false;
    }
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
  // remove the current board for a clean restart
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