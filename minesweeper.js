document.addEventListener('DOMContentLoaded', startGame)




// Global variables
var board = {};

var minRows = 2;
var maxRows = 6;
var minMines = 1;
var maxMines = 10;
var modes = [[4, 6], [5, 12], [6, 18]];

// default values
var rows = 5;
var mineNo = 9;
var wins = 0;
var losses = 0;

function startGame () {
  displayMessage('Let\'s play!');
  setInitParams();
}

function gameInit(mode){

  console.log("you clicked me");

  rows = modes[mode][0];
  mineNo = modes[mode][1];
  
  populateCells();

  // remove all buttons
  for(var i=0; i<=document.getElementsByTagName('button').length; i++){
    document.getElementsByTagName('button')[i].remove();
  }

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
  showWins(1);
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
  // remove restart button and audio html
  document.getElementsByTagName('button')[0].remove();
  document.getElementsByTagName('audio')[0].remove();

  // remove event listeners
  document.removeEventListener('click', checkForWin)
  document.removeEventListener('contextmenu', checkForWin)

  startGame();
}

function showWins(winOrLoss){
  if(winOrLoss>0) wins++;
  if(winOrLoss<0) losses++;
  var body = document.getElementsByTagName('body')[0];

  // if elements already created then just update
  if(document.getElementById("winsAndLosses") != null) {
    document.getElementById("wins").textContent = "Wins: " + wins;
    document.getElementById("losses").textContent = "Losses: " + losses;
  }
  //otherwise create elements
  else {
    var div = document.createElement('div');
    div.setAttribute("id", "winsAndLosses");

    var win = document.createElement('p');
    win.setAttribute("id", "wins");
    var winMsg = document.createTextNode("Wins: " + wins);
    win.appendChild(winMsg);

    var loss = document.createElement('p');
    loss.setAttribute("id", "losses");
    var lossMsg = document.createTextNode("Losses: " + losses);
    loss.appendChild(lossMsg);

    div.appendChild(win);
    div.appendChild(loss);
    body.appendChild(div);
  }

}