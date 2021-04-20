/** Board creation */
const board_container = document.querySelector(".play-area");
let rows, columns;
let play_board = [];

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
    game_over = false;

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
    else
        switch(event.key) {
            case "ArrowUp":
                alert("Up");
                break;
            case "ArrowDown":
                break;
            case "ArrowLeft":
                break;
            case "ArrowRight":
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

/** Initial render */
reset_board();