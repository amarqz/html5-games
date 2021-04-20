/** Pieces */
class piece {
    constructor(type) {
        this.type = type;
        switch(type) {
            case "I":
                this.pivot = 1;
                this.pos = [Math.floor(1/2*columns-2),Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(1/2*columns+1)];
                break;
            case "J":
                this.pivot = 1;
                this.pos = [Math.floor(1/2*columns-2),Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(3/2*columns)];
                break;
            case "L":
                this.pivot = 1;
                this.pos = [Math.floor(1/2*columns-2),Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(3/2*columns-2)];
                break;
            case "O":
                this.pivot = -1;
                this.pos = [Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(3/2*columns-1),Math.floor(3/2*columns)];
                break;
            case "S":
                this.pivot = 0;
                this.pos = [Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(3/2*columns-2),Math.floor(3/2*columns-1)];
                break;
            case "T":
                this.pivot = 1;
                this.pos = [Math.floor(1/2*columns-2),Math.floor(1/2*columns-1),Math.floor(1/2*columns),Math.floor(3/2*columns-1)];
                break;
            case "Z":
                this.pivot = 2;
                this.pos = [Math.floor(1/2*columns-2),Math.floor(1/2*columns-1),Math.floor(3/2*columns-1),Math.floor(3/2*columns)];
                break;
        }
    }

    hide() {
        for(i=0;i<this.pos.length;i++) {
            document.querySelector(`#block_${this.pos[i]}`).classList.remove(this.type);
        }
    }

    display() {
        for(i=0;i<this.pos.length;i++) {
            document.querySelector(`#block_${this.pos[i]}`).classList.add(this.type);
        }
    }

    move_left() {
        if(!this.any_wall().includes('L')) {
            this.hide();
            for(i=0;i<this.pos.length;i++) 
                this.pos[i] -= 1;
            this.display();
        }
    }

    move_right() {
        if(!this.any_wall().includes('R')) {
            this.hide();
            for(i=0;i<this.pos.length;i++) 
                this.pos[i] += 1;
            this.display();
        }
    }

    move_down() {
        if(!this.any_wall().includes('D')) {
            this.hide();
            for(i=0;i<this.pos.length;i++)
                this.pos[i] += parseInt(columns,10);
            this.display();
        }
        // ELSE -> SOLID & SPAWN new piece
    }

    rotate() {

    }

    any_wall() {
        let resp = "";
        for(i=0;i<this.pos.length;i++) {
            if(this.pos[i] % columns == 0)
                resp += "L";
            if(this.pos[i] % columns == columns - 1)
                resp += "R";
            if(this.pos[i] >= (rows*columns)-columns)
                resp += "D";
        }

        return resp;
    }
}
let obj;

/** Board creation */
const board_container = document.querySelector(".play-area");
let rows, columns;
let play_board = [];
let ongoing_game = false, moving_piece = false;
var typing = false;

const reset_board = () => {
    rows = document.getElementById("rows").value;
    columns = document.getElementById("columns").value;

    if(!check_limits()) {
        create_board();
    }
};

const check_limits = () => {

    let errors = "Error!", flag = false;
    if(rows<5 || rows>40) {
        errors += `\n- The number of desired rows (${rows}) is not between 5 and 40.`;
        flag = true;
    }
    if(columns<10 || columns>60) {
        errors += `\n- The number of desired columns (${columns}) is not between 10 and 60.`;
        flag = true;
    }
    if(flag)
        alert(errors);

    return flag;
};

const create_board = () => {
    document.querySelector("html").style.setProperty("--size",document.getElementById("size").value+"px");
    board_container.innerHTML = "";
    play_board = [];
    document.querySelector('#button').innerText = "Reset Board";
    game_over = false, ongoing_game = false, moving_piece = false;

    for(i=0;i<rows*columns;i++)
        board_container.innerHTML += `<div id="block_${i}" class="block">`

    document.querySelector("html").style.setProperty("--ncol",columns);
};

/** Handling keypresses */
window.addEventListener("keydown", function (event) {
    if(event.defaultPrevented) {
      return;
    }
    if(!ongoing_game)
        begin_game();
    else if(moving_piece)
        switch(event.key) {
            case "ArrowUp": case "w":
                obj.rotate();
                break;
            case "ArrowDown": case "s":
                obj.move_down();
                break;
            case "ArrowLeft": case "a":
                obj.move_left();
                break;
            case "ArrowRight": case "d":
                obj.move_right();
                break;
            case "Shift":
                alert("Shift");
                break;
            case "Enter": case " ":
                alert("Hey");
                break;
            default:
                break;
        }
  });

/** Game beginning */
const begin_game = () => {
    if(!typing) {
        ongoing_game = true;
        let tdisp = document.getElementById("pinfo");
        tdisp.innerText = "Ready?";
        setTimeout(function () { 
            tdisp.innerText = "3...";
            tdisp.style.setProperty("color","green");
            setTimeout(function () { 
                tdisp.innerText = "2...";
                tdisp.style.setProperty("color","orange");
                setTimeout(function () {
                    tdisp.innerText = "1...";
                    tdisp.style.setProperty("color","red");
                    setTimeout(function () {
                        tdisp.innerText = "";
                        tdisp.style.setProperty("color","black");
                        spawn_piece(random_piece());
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
};

const random_piece = () => {
    let opt = "IJLOSTZ";
    return opt[Math.floor(Math.random() * 7)];
}

const spawn_piece = p => {
    obj = new piece(p);
    obj.display();
    moving_piece = true;
}

/** Initial render */
reset_board();