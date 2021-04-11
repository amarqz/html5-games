/** Board creation */
const board_container = document.querySelector(".play-area");
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

    for(i=0;i<rows*columns;i++) {
        let div = document.createElement("div");
        div.id = `block_${i}`;
        div.className = "block";
        div.onclick = function (){ a(); };
        div.oncontextmenu = function (){ b(); return false; };
        div.textContent = `${i}`; // For debugging
        board_container.appendChild(div);
    }

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
    
};

/** Board rendering */

const a = () => {
    alert('a');
};
const b = () => {
    alert('b');
};

/** Initial render */
reset_board();