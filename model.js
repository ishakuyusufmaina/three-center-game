/*
Fisrt diagonal is from left downward
second diagonal is from right downward

The indices for 1st diag is:
both the row and the column indices
start from one end (like 0) and equally 
approach the other end, like 0,0 - 2,2 for 3 by 3 matrix

The indices for 2nd diag:
one index starts from one end and the other
from the opposite end, like 0,2 and the 
lower one apprach the max index while the 
othet higher approaches the min index like 0, 2 -> 2, 0



let board = [
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0]
]
00 11 22
02 11 20

00 11 22 33 44
04 13 22 31 40

[1, 2, 3]
[4, 5, 6]
[7, 8, 9]

geometry
00 01 02
10 11 12
20 21 22

x: (c +1) * f
y: (r +1) * f
*/


function getFirstDiagonal(squareMat){
    let min = 0;
    let max = squareMat.length-1
    let firstDiagonal= [];
    while(min <= max){
        firstDiagonal.push(squareMat[min][min])
        min++
    }
    return firstDiagonal;
}

function getSecondDiagonal(squareMat){
    let min = 0;
    let max = squareMat.length-1
    let secondDiagonal= [];
    let hIndex = max;
    let lIndex =min;
    while((hIndex >= min) & (lIndex<=max)){
        secondDiagonal.push(squareMat[lIndex][hIndex])
        hIndex--;
        lIndex++;
    }
    return secondDiagonal;
}

function isC(board){
    let centerAt = null; //rx, cx, d1x, d2x
    let transpose = [] // for columna checking
    for (let rowIndex=0; rowIndex<board.length; rowIndex++){
        let row = board[rowIndex];
        if (row.every(val => (val==row[0]) & !!val)){
            centerAt = "r"+rowIndex;
            return centerAt;
        }
        
        //forming columns by transposing
       transpose.push([]);
        for (let colIndex = 0; colIndex<row.length; colIndex++){
            transpose[rowIndex].push(board[colIndex][rowIndex]);
        }
    }
    
    //checking columns
    //a row of a transpose is a column
    transpose.forEach((row, i)=>{
        if (row.every(val => (val == row[0]) &!!val))
        centerAt = "c"+i
    })
    
    if (centerAt) return centerAt;
    
    //forming diagonals
    diagonals = [getFirstDiagonal(board), getSecondDiagonal(board)]
    diagonals.forEach((dia, i)=>{
        if (dia.every(val => (val == dia[0]) &!!val))
        centerAt = "d"+i;
    })
    
    
    return centerAt;
    
}

var remotePlay = (r, c)=>{}


class Model extends Array{
    constructor(base){
        super();
        this.players = [{seed: "x", score: 0}, {seed:"o", score: 0}];
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.base = base;
        this.reset()
        
    }
    toRemote(){
       let rep = {};
        for (let key in this){
            if (this.hasOwnProperty(key)) {
                rep[key] = this[key];
            }
        }
        rep.data = Array.from(this);
        return rep;
    }
    fromRemote(rep){
        for (let key in rep){
            this[key] = rep[key]
            console.log(key, JSON.stringify(rep[key]))
        }
        this.assign(rep.data);
    }
    togglePlayer(){
       // let index = this.players.indexOf(this.currentPlayer);
        this.currentPlayerIndex = (this.currentPlayerIndex+1)%this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        
    }
    
    
    assign(newArray) {
    if (!Array.isArray(newArray)) {
      throw new Error("Input must be an array.");
    }
    this.splice(0, this.length, ...newArray); // Replace elements
  }


    reset(){
        if (this.length){
            this.forEach((row)=>{
                row.forEach((cell, i)=>{
                    row[i] = 0;
                })
            })
            return
        }
        
        let base = this.base;
        let r = base;
        while (r){
            let row = [];
            let c = base;
            r--;
            while(c){
                row.push(0);
                c--;
            }
            this.push(row);
        }
    }
}

function count(seed, board){
    let counter=0;
    board.forEach((row)=>{
        row.forEach((cell)=>{
            if (cell == seed)
            counter++
        })
    })
    return counter;
}

function createBoard(board){
    let boardElm = document.createElement("div");
    boardElm.id = "board";
    let styleText = `#board {
        display: grid;
        grid-template-rows: repeat(${board.length}, auto);
        grid-template-columns: repeat(${board.length}, auto);
        justify-content: space-evenly;
        align-content: space-evenly;
        border: 1px solid black;
        width: ${(board.length/4)*200}px;
        height: ${(board.length/4)*200}px;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .cell {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background: #fff;
        color: #333;
        font-size: 1.5rem;
        font-weight: bold;
        border-radius: 50%; /* Make it circular */
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s, box-shadow 0.3s;
    }
    /* Hover effect for cells */
    .cell:hover {
        transform: scale(1.1);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
        background: #ff7e5f;
        color: #fff;
    }
    .selected {
        background: blue;
        color: white;
    }`;
    let style = document.createElement("style");
    style.innerText = styleText;
    document.body.appendChild(style)
    board.forEach((row, r)=>{
        row.forEach((seed, c)=>{
            let cell = document.createElement("div");
            cell.setAttribute("data-r", r);
            cell.setAttribute("data-c", c);
            cell.classList.add("cell");
            if (seed) cell.innerHTML = `<div class='seed'>${seed}</div>`;
            cell.style.left = 15 + (c) * ((300)/5) + "px";
            cell.style.top = 15 + (r) * ((300)/5)  + "px";
            cell.onclick = (e)=>{
                //e.preventDefault(true);
                let row = cell.getAttribute("data-r");
                let col = cell.getAttribute("data-c");
                play(row, col, board)
                remotePlay(board)
            }
            boardElm.appendChild(cell)
        });
    });
    
    let selectedIndex = board.selectedIndex;
    if (selectedIndex){
        let [r, c] = selectedIndex;
        let cell = boardElm.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
        cell.classList.add("selected");
    }
    return boardElm
}




function updateStatus(){
    let statusElm = document.createElement("div");
    statusElm.innerHTML = `${board.currentPlayer.seed}'s turn<br>`
    board.players.forEach((player, i)=>{statusElm.innerHTML +=`${player.seed} score: ${player.score} <br>`})
    return statusElm;
}

/*function sendToRemote(r, c, board)
.onchange */

function play(r, c, board){
    /*
    1. add a seed to a cell at r, c
    then switch player
    if the player seeds on the board are not enough
    and the cell at r, c is empty
    */
    let pSeed = board.currentPlayer.seed;
    let seedOnBoard = count(pSeed, board);
    let cell = board[r][c];
    if ((seedOnBoard < board.length) & (!cell)){
        board[r][c] = pSeed;
        let won = isC(board);
        if (won) {
            alert("Won!");
            board.players[board.currentPlayerIndex].score +=1;
            board.reset();
        }
        board.togglePlayer();
        return;
    }
    
    
    /*
    
    2. select a cell 
    if it contains the player seed
    and the player seeds on the board are enough
    */
    if ((pSeed == board[r][c]) & (count(pSeed, board) == board.length))
    board.selectedIndex = [r, c];
    
    /*
    
    3. move a selected seed on the board to a cell at r, c
    then switch player
    if there is a selected seed and
    the player is the owner of the selected seed 
    and the cell at r, c is empty
    */
    let selectedIndex = board.selectedIndex;
    if (selectedIndex){
        [sRow, sCol] = selectedIndex;
        if ((pSeed==board[sRow][sCol]) & (!board[r][c])){
            [board[r][c], board[sRow][sCol], board.selectedIndex] = [board[sRow][sCol], 0, null];
            let won = isC(board);
            if (won) {
                alert("Won!");
                board.players[currentPlayerindex].score++;
                board.reset();
            }
            board.togglePlayer();
        }
    }
}



function animate() {
  // Update animation state here
    if (board){
        if (boardContainer){
           boardContainer.innerHTML = "";
            boardContainer.appendChild(createBoard(board))
        }
        if (status){
            status.innerHTML = "";
            status.appendChild(updateStatus(board))
        }
    }
  
  // Example: Log a message
// console.log(board[0][0]);

  // Call animate() again for the next frame
  requestAnimationFrame(animate);
}

// Start the animation
//animate();
