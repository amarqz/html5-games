/** Board creation */
const board_container = document.querySelector(".play-area");
const flagsym = String.fromCharCode(parseInt(2691,16));
let rows, columns, mines;
let play_board = [];

const reset_board = () => {
    rows = document.getElementById("rows").value;
    columns = document.getElementById("columns").value;
    mines = document.getElementById("mines").value;

    if(!check_limits()) {
        create_board();
    }
};

const check_limits = () => {

    let errors = "Error!", flag = false;
    if(rows<5 || rows>30) {
        errors += `\n- The number of desired rows (${rows}) is not between 5 and 30.`;
        flag = true;
    }
    if(columns<5 || columns>30) {
        errors += `\n- The number of desired columns (${columns}) is not between 5 and 30.`;
        flag = true;
    }
    if(mines<5 || mines>100) {
        errors += `\n- The number of desired mines (${mines}) is not between 5 and 100.`;
        flag = true;
    }
    if((rows*columns) <= mines) {
        errors += `\n- The number of desired mines (${mines}) is either equal or greater than the possible boxes (${rows*columns})`;
        flag = true;
    }
    if(flag)
        alert(errors);

    return flag;
};

const create_board = () => {
    board_container.innerHTML = "";
    play_board = [];

    for(i=0;i<rows*columns;i++)
        board_container.innerHTML += `<div id="block_${i}" class="block" onclick="check_block(${i})" oncontextmenu="flag_block(${i}); return false;">`

    document.querySelector("html").style.setProperty("--ncol",columns);

    let mines_places = [];
    let val;
    for(i=1;i<=mines;i++) {
        do{
            val = Math.floor(Math.random() * (rows * columns));
        }while(mines_places.includes(val));
        play_board[val] = "B";
        mines_places.push(val);
    }
    
    calc_near();
    //test(); // For debugging
};

const test = () => {
    for(i=0;i<(rows*columns); i++)
        document.getElementById(`block_${i}`).innerText = `${play_board[i]}`;
};

const calc_near = () => {
    for(i=0;i<rows;i++)
        for(j=0;j<columns;j++)
            if(play_board[j+i*columns] != 'B') {
                let sum = 0;
                if(j+i*columns == j && j != 0 && j != columns-1) { // Upper row
                    if(play_board[j+columns*i-1] == "B") sum++;
                    if(play_board[j+columns*i+1] == "B") sum++;
                    if(play_board[j+columns*(i+1)-1] == "B") sum++;
                    if(play_board[j+columns*(i+1)] == "B") sum++;
                    if(play_board[j+columns*(i+1)+1] == "B") sum++;
                    play_board[j] = sum;
                }

                else if(j == 0 && i == 0) { // Upper-left corner
                    if(play_board[j+columns*i+1] == "B") sum++;
                    if(play_board[j+columns*(i+1)] == "B") sum++;
                    if(play_board[j+columns*(i+1)+1] == "B") sum++;
                    play_board[0] = sum;
                }

                else if(i == 0 && j == columns-1) { // Upper-right corner
                    if(play_board[columns-2] == "B") sum++;
                    if(play_board[2*columns-1] == "B") sum++;
                    if(play_board[2*columns-2] == "B") sum++;
                    play_board[columns-1] = sum;
                }

                else if(j == 0 && i != 0 && i != rows-1) { // Left side column
                    if(play_board[columns*(i-1)] == "B") sum++;
                    if(play_board[columns*(i-1)+1] == "B") sum++;
                    if(play_board[columns*i+1] == "B") sum++;
                    if(play_board[columns*(i+1)] == "B") sum++;
                    if(play_board[columns*(i+1)+1] == "B") sum++;
                    play_board[columns*i] = sum;
                }

                else if(j == 0 && i == rows-1) { // Down-left corner
                    if(play_board[columns*(i-1)] == "B") sum++;
                    if(play_board[columns*(i-1)+1] == "B") sum++;
                    if(play_board[columns*i+1] == "B") sum++;
                    play_board[columns*i] = sum;
                }

                else if(j == columns-1 && i != 0 && i != rows-1) { // Right side column
                    if(play_board[j+columns*(i-1)] == "B") sum++;
                    if(play_board[j+columns*(i-1)-1] == "B") sum++;
                    if(play_board[j+columns*i-1] == "B") sum++;
                    if(play_board[j+columns*(i+1)] == "B") sum++;
                    if(play_board[j+columns*(i+1)-1] == "B") sum++;
                    play_board[j+columns*i] = sum;
                }

                else if(j == columns-1 && i == rows-1) { //Down-right corner
                    if(play_board[j+columns*(i-1)] == "B") sum++;
                    if(play_board[j+columns*(i-1)-1] == "B") sum++;
                    if(play_board[j+columns*i-1] == "B") sum++;
                    play_board[j+columns*i] = sum;
                }

                else if(i == rows-1 && j != 0 && j != columns-1) { // Down row
                    if(play_board[j+columns*i-1] == "B") sum++;
                    if(play_board[j+columns*(i-1)-1] == "B") sum++;
                    if(play_board[j+columns*(i-1)] == "B") sum++;
                    if(play_board[j+columns*(i-1)+1] == "B") sum++;
                    if(play_board[j+columns*i+1] == "B") sum++;
                    play_board[j+columns*i] = sum;
                }

                else { // Inner block
                    if(play_board[j+columns*(i-1)-1] == "B") sum++;
                    if(play_board[j+columns*(i-1)] == "B") sum++;
                    if(play_board[j+columns*(i-1)+1] == "B") sum++;
                    if(play_board[j+columns*i-1] == "B") sum++;
                    if(play_board[j+columns*i+1] == "B") sum++;
                    if(play_board[j+columns*(i+1)-1] == "B") sum++;
                    if(play_board[j+columns*(i+1)] == "B") sum++;
                    if(play_board[j+columns*(i+1)+1] == "B") sum++;
                    play_board[j+columns*i] = sum;
                }
            }
};

/** Board rendering */

const check_block = w => {
    let wblock = document.getElementById(`block_${w}`);
    if(wblock.innerText == "") {
        wblock.innerText = play_board[w];
        wblock.classList.add("checked");
        if(play_board[w] != "B") {
        }
        else {
            // GAMEOVER
            alert("BOOM!");
        }
    }
};

const flag_block = w => {
    let wblock = document.getElementById(`block_${w}`);
    if(wblock.innerText == "")
        wblock.innerText = `${flagsym}`;
    else if(wblock.innerText == `${flagsym}`)
        wblock.innerText = "";
};

/** Initial render */
reset_board();
