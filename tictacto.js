  class TicTacToe {
    constructor(){
    this.winningPositions = ["123", "159", "147", "258", "369", "357", "456", "789"];
    this.legalMoves = [12, 14, 15, 21, 23, 25, 32, 35, 36,
    41, 45, 47, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    63, 65, 69, 74, 75, 78, 85, 87, 89, 96, 98, 95];
    this.player = 1;
    this.seeds = ["X", "O"];
    this.moves = [[{from: 0, to: 0}, {from:0, to:0}, {from: 0, to: 0}], [{from:0, to:0}, {from: 0, to: 0}, {from: 0, to: 0}]];
    this.selected = 0;
      this.maxSeed = 3;
    this.hands = [this.getMaxSeed(), this.getMaxSeed()];
    this.setPlayer = (plyer)=>{
      if (plyer==1|plyer==2){
      this.player=plyer;
      }
    }
    this.getPlayer = ()=>{return this.player};
    this.getSeeds = ()=>{return this.seeds};
    this.setSeeds = (seds)=>{
      this.seeds = seds;
    }
    this.getMoves = ()=>{
      return this.moves
    }
    this.setMoves = (movs)=>{
      this.moves = movs;
    }
    this.getHands =()=>{
      return this.hands;
    }
    this.setHands=(hans)=>{
      this.hands = hans;
    }
    this.setSelected = (index)=>{
      this.selected = index;
    }
    this.getSelected = ()=>{return this.selected}
    
    this.getLegalMoves = ()=>{
      return this.legalMoves;
    }
    this.getWinningPositions = ()=>{
      return this.winningPositions;
    }
  }
    getMaxSeed(){return this.maxSeed}
  }
 class TicTacToeView {
   constructor(){
   this.root = newDiv("");
     //this.root.classList.add();
   this.winnerModal = newDiv("");
   this.winnerModal.id= "winnerModal";
   this.winnerModal.classList.add("modal");
   this.playBtn = newBtn("Play again");
   this.playBtn.classList.add("btn-primary");
   this.playBtn.setAttribute("data-bs-dismiss", "modal");
     this.cells =[];
     this.no_cells=9;
     this.boardId = "board9";
     this.disabled = false;
     this.inflate();
 }
   addStartListener(handle){
     this.playBtn.onclick= ()=>{handle()};
   }
   setDisabled(bool){this.disabled=bool}
   getDisabled(){return this.disabled};
   inflate(){
   for (let i=this.cells.length; i<this.no_cells; i++){
     this.cells.push(newBtn(""));
     this.cells[i].classList.add("border", "border-light", "border-2");
   }
   }
    addMoveListener(localPlay){
      this.cells.map((cell, index)=>{
        cell.onclick=()=>{
          if (this.disabled){return}
          //if (remotePlay){
            remotePlay(index+1, cell.textContent);
            //alert("remote play");
          //}
          localPlay(index+1, cell.textContent);
        }});
    };
     showWinner(player, pos){
       pos.map((i)=>{this.cells[i-1].classList.add("won");});
       this.winnerModal.innerHTML = "";
       let msg = newPara(`Player ${player} won!`);
       let dia = newDiv("");
       dia.classList.add("modal-dialog", "modal-dialog-centered");
       let cont = newDiv("");
       cont.classList.add("modal-content");
       let header = newDiv("");
       let body = newDiv("");
       let footer = newDiv("");
       header.classList.add("modal-header");
       footer.classList.add("modal-footer");
       body.classList.add("modal-body");
       header.appendChild(msg);
       body.appendChild(newDiv(root.innerHTML));
       footer.appendChild(this.playBtn);
       cont.appendChild(header);
       cont.appendChild(body);
       cont.appendChild(footer);
       dia.appendChild(cont);
       this.winnerModal.appendChild(dia);
       this.winnerModal.style.display = "block";
     
     }
     
   render(seed1, hand1, seed2, hand2, player, p1Positions, p2Positions, selected){
     this.root.innerHTML = "";
    this.root.appendChild(this.winnerModal);
     this.winnerModal.style.display ="none";
     this.cells.map((cell, index)=>{
       cell.innerHTML =" ";
       cell.classList.remove("won");
       if (index == selected-1){
         cell.id = "selected";
       } else {
         cell.id = "c"+index+1;
       }
     });
     let p1 = newPara("Player1: ");
     p1.classList.add("player");
       p1.textContent += seed1.repeat(hand1);
     let p2 = newPara("Player2: ");
       p2.textContent +=seed2.repeat(hand2);
     
       p2.classList.add("player")
       
       if (player == 1) {
         p1.id="activePlayer";
       } else {
         p2.id="activePlayer";
       }
       let p = newPara(`Player ${player} playing`);
       
       p1Positions.map((pos)=>{
         if (pos > 0){
         this.cells[pos-1].innerHTML = seed1;
         }
       });
       p2Positions.map((pos)=>{
         if (pos > 0){
         this.cells[pos-1].innerHTML = seed2;
         }
       });
       
       this.root.appendChild(p1);
       this.root.appendChild(p2);
       this.root.appendChild(p);
       this.root.appendChild(this.board());
       return this.root;
   }
     
    board(){
      let root = newDiv("");
      root.id = this.boardId;
      root.classList.add("board");
      this.cells.map((cell)=>{
        cell.classList.add("cell");
        root.appendChild(cell);
      });
      return root;
    }
     
 }
  
  class TicTacToeCtr{
    
    constructor(model, view, currentPlayer){
    this.model = model;
    this.view = view;
    this.currentPlayer = currentPlayer;
    var firstPlayer = this.model.getPlayer();
    model=6;
    //view=6;
    var viewRoot;
    this.update = ()=>{
      let seeds = this.model.getSeeds();
      let hands = this.model.getHands();
      let player = this.model.getPlayer();
      let p1Moves = this.model.getMoves()[0];
      let p2Moves = this.model.getMoves()[1];
      let p1Pos = [];
      let p2Pos = [];
      let p1RecentMoves = p1Moves.slice(p1Moves.length-this.model.getMaxSeed(), p1Moves.length);
      p1RecentMoves.map((mo)=>{p1Pos.push(mo.to)});
      let p2RecentMoves = p2Moves.slice(p2Moves.length-this.model.getMaxSeed(), p2Moves.length);
      p2RecentMoves.map((mo)=>{p2Pos.push(mo.to)});
      
      let selected = this.model.getSelected();
      
     viewRoot= view.render(seeds[0], hands[0], seeds[1], hands[1], player, p1Pos, p2Pos, selected);
      
    }
    
    this.update();
    this.getHand = ()=>{
      let player = this.model.getPlayer();
      let hands = this.model.getHands();
      return hands[player-1];
    }
    this.getMoves = ()=>{
      return this.model.getMoves()[this.model.getPlayer()-1]};  
    this.togglePlayer = ()=>{
      let player = this.model.getPlayer();
      player = player%2 + 1;
      this.model.setPlayer(player);
      this.view.setDisabled(!this.view.getDisabled());
      alert("disabled status: " + this.view.getDisabled());
      this.update();
    }
    
    this.start =()=>{
      firstPlayer = firstPlayer%2 == 1? 2:1;
      this.model = new TicTacToe();
     this.model.setPlayer(firstPlayer);
      this.update();
      
    }
    this.play = (pos, cont)=>{
      //alert(4);
    //  if ((this.model.getPlayer() !== this.currentPlayer) && !isRemote){return}
      if (this.hasWon()) { return};
      if (this.getHand()>0 && cont==" "){
        this.model.getHands()[this.model.getPlayer()-1]--;
        this.model.getMoves()[this.model.getPlayer()-1].push({from: 0, to:pos});
        if (this.hasWon()){
          this.update();
          view.showWinner(this.model.getPlayer(), this.getPosition());
          return;
        } else {
          this.togglePlayer();
        }
      } else if (cont == this.getSeed() && this.getHand() ==0){
      this.model.setSelected(pos);
      } else if (this.model.getSelected() >0 && cont==" "){
        let selected= this.model.getSelected();
        let prevState= this.getPrevState();
        let move = {from:selected, to:pos};
        if (this.isLegal(move)){
          this.getMoves().push(move);
          this.model.setSelected(0);
          prevState.map((move)=>{
            if (move.to !== selected) {
              this.getMoves().push({from: move.from, to:move.to});
              //alert("*");
            }
        });
        if (this.hasWon()){
          this.update();
          view.showWinner(this.model.getPlayer(), this.getPosition());
          return;
        } else {
          this.togglePlayer();
        }
        } else {
          //navigator.vibrate(250);
          alert("Illegal move!");
        }
        
        
        
      }
      
      
      
    this.update();     
    }
    
    this.getPosition = ()=>{
      let pos=[];
      this.getPrevState().map((state)=>{
        pos.push(state.to);
      });
      return pos;
    }
    
    this.getSeed = ()=>{
      let seeds = this.model.getSeeds();
      return seeds[this.model.getPlayer()-1];
    }
    
   this.isLegal=(move)=>{
     let legalMoves = this.model.getLegalMoves();
     return legalMoves.includes(Number(move.from.toString() + move.to));
   }
  this.hasWon=()=>{
    let winningPos = this.model.getWinningPositions();
    let pos = [this.getPrevState()[0].to, this.getPrevState()[1].to, this.getPrevState()[2].to].sort();
    //alert(pos);
    pos = pos.toString().replace(/,/g, "");
    return winningPos.includes(pos);
  }
    this.getPrevState = ()=>{
      return this.getMoves().slice(this.getMoves().length-3, this.getMoves().length);
    }
    
    view.addMoveListener(this.play);
    view.addStartListener(this.start);
    
    this.getView = ()=>{
      return viewRoot;
    }
    }
    
  }
