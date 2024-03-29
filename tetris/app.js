/** Pieces */
class Piece {
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

        timer_level(level);
    }

    hide() {
        let final = this.final();
        for(i=0;i<this.pos.length;i++) {
            document.querySelector(`#block_${this.pos[i]}`).classList.remove(this.type);
            document.querySelector(`#block_${final[i]}`).classList.remove(this.type+'F');
        }
    }

    display() {
        let final = this.final();
        for(i=0;i<this.pos.length;i++) {
            document.querySelector(`#block_${this.pos[i]}`).classList.add(this.type);
            document.querySelector(`#block_${final[i]}`).classList.add(this.type+'F');
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
        else
            this.solid();
    }

    floor() {
        this.hide();
        while(!this.any_wall().includes('D')) {
            for(i=0;i<this.pos.length;i++)
                this.pos[i] += parseInt(columns,10);
        }
        this.display();
        this.solid();
    }

    rotate() {
        let backup = [];
        for(i=0;i<this.pos.length;i++)
            backup[i] = this.pos[i];

        this.hide();
        if(this.type != 'O') {
            for(i=0;i<this.pos.length;i++) {
                if(i != this.pivot)
                    switch(this.pos[i] - this.pos[this.pivot]) {
                        case -2*parseInt(columns,10):
                            this.pos[i] = this.pos[this.pivot]+2;
                            break;
                        case -parseInt(columns,10)-1:
                            this.pos[i] = this.pos[this.pivot]-parseInt(columns,10)+1;
                            break;
                        case -parseInt(columns,10)+1:
                            this.pos[i] = this.pos[this.pivot]+parseInt(columns,10)+1;
                            break;
                        case -parseInt(columns,10):
                            this.pos[i] = this.pos[this.pivot]+1;
                            break;
                        case -2:
                            this.pos[i] = this.pos[this.pivot]-2*columns;
                            break;
                        case -1:
                            this.pos[i] = this.pos[this.pivot]-columns;
                            break;
                        case 1:
                            this.pos[i] = this.pos[this.pivot]+parseInt(columns,10);
                            break;
                        case 2:
                            this.pos[i] = this.pos[this.pivot]+2*parseInt(columns,10);
                            break;
                        case parseInt(columns,10)-1:
                            this.pos[i] = this.pos[this.pivot]-parseInt(columns,10)-1;
                            break;
                        case parseInt(columns,10):
                            this.pos[i] = this.pos[this.pivot]-1;
                            break;
                        case parseInt(columns,10)+1:
                            this.pos[i] = this.pos[this.pivot]+parseInt(columns,10)-1;
                            break;
                        case 2*parseInt(columns,10):
                            this.pos[i] = this.pos[this.pivot]-2;
                            break;
                    }
                    if(this.pos[i] < 0 || this.pos[i] >= (rows*columns)) { 
                        this.pos = backup;
                        this.display();
                        return;
                    }
                    else if(document.querySelector(`#block_${this.pos[i]}`).classList.contains("occupied")) {
                        this.pos = backup;
                        this.display();
                        return;
                    }
            }
        }
        this.display();
    }

    any_wall() {
        let resp = "";
        for(i=0;i<this.pos.length;i++) {
            if(this.pos[i] % columns == 0 || document.querySelector(`#block_${this.pos[i]-1}`).classList.contains("occupied"))
                resp += "L";
            if(this.pos[i] % columns == columns - 1 || document.querySelector(`#block_${this.pos[i]+1}`).classList.contains("occupied"))
                resp += "R";
            if(this.pos[i] >= (rows*columns)-columns || document.querySelector(`#block_${this.pos[i]+parseInt(columns,10)}`).classList.contains("occupied"))
                resp += "D";
        }

        return resp;
    }

    final() {
        let finalpos = [];
        for(i=0;i<this.pos.length;i++)
            finalpos[i] = this.pos[i];
        let canadvance = true;
        
        while(canadvance) {
            for(i=0;i<finalpos.length;i++)
                if(finalpos[i] >= (rows*columns)-columns || document.querySelector(`#block_${finalpos[i]+parseInt(columns,10)}`).classList.contains("occupied"))
                    canadvance = false;
            if(canadvance)
                for(i=0;i<finalpos.length;i++)
                    finalpos[i] += parseInt(columns,10);
        }

        return finalpos;
    }

    solid() {
        for(i=0;i<this.pos.length;i++) {
            document.querySelector(`#block_${this.pos[i]}`).classList.add("occupied");
            document.querySelector(`#block_${this.pos[i]}`).classList.remove(this.type+'F');
        }
        
        check_rows();
        spawn_piece(random_piece());
    }
}
let obj;

/** Board creation */
const board_container = document.querySelector(".play-area");
let rows, columns;
let play_board = [];
let ongoing_game = false, moving_piece = false;
var typing = false;
let lines = 0, level = 0;
let timer;

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
    clearInterval(timer);

    for(i=0;i<rows*columns;i++)
        board_container.innerHTML += `<div id="block_${i}" class="block">`;

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
                obj.floor();
                break;
            default:
                break;
        }
  });

/** Game beginning */
const begin_game = () => {
    if(!typing && !ongoing_game) {
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
    obj = new Piece(p);
    obj.display();
    moving_piece = true;
}

/** Time */
const timer_level = lvl => {
    clearInterval(timer);
    let time = 1000 - (lvl-1) * 100;
    timer = setInterval(function () { obj.move_down(); }, time);
};

/** Levels and full rows */
const check_rows = () => {
    for(i=0;i<rows;i++) {
        let count = 0;
        for(j=0;j<columns;j++)
            if(document.querySelector(`#block_${i*parseInt(columns,10)+j}`).classList.contains("occupied"))
                count++;
        if(count == parseInt(columns,10))
            pop_row(i);
    }

    if(lines % 10 == 0)
        set_level(Math.floor(lines/10));
};

const set_level = lvl => {
    // Publish the new level and event (to be implemented)
    level = lvl;
    timer_level(level);
};

const pop_row = row => {
    lines++;
    document.getElementById("pinfo").innerText = "Lines: " + lines;
    for(i=0;i<columns;i++)
        document.querySelector(`#block_${row*parseInt(columns,10)+i}`).classList.remove("occupied",'I','J','L','O','S','T','Z');
    
    for(i=row;i>0;i--) 
        for(j=0;j<columns;j++) {
            document.querySelector(`#block_${i*parseInt(columns,10)+j}`).classList = document.querySelector(`#block_${(i-1)*parseInt(columns,10)+j}`).classList;
        }
};

/** Input value updates */
const update_button = () => {
    document.querySelector('#button').innerText = "Update Board";
};

/** Initial render */
reset_board();