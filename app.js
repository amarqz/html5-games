let play_board = ["", "", "", "", "", "", "", "", ""];

const board_container = document.querySelector(".play-area");
const player = "O";
const computer = "X";

const render_board = () => {
  board_container.innerHTML = "";
  play_board.forEach((user, block) => {
    board_container.innerHTML += `<div id="block_${block}" class="block" onclick="addPlayerMove(${block})">${play_board[block]}</div>`;
    if (user == player || user == computer) {
      document.querySelector(`#block_${block}`).classList.add("occupied");
    }
  });
};

/** Moves */
const addComputerMove = () => {
  if(!board_isfull && !won_game) {
    do {
      w = Math.floor(Math.random() * 9);
    }while(play_board[w] != "");
    play_board[w] = computer;
    game_loop();
  }
}

const addPlayerMove = w => {
  if (play_board[w] == "" && !won_game) {
    play_board[w] = player;
    game_loop();
    addComputerMove();
  }
};

const keymap = " qweasdzxc";
window.addEventListener("keydown", function (event) {
  if(event.defaultPrevented) {
    return;
  }
  let key = keymap.indexOf(event.key)-1;
  if(key != -2) {
    input_error(key);
    addPlayerMove(key);
  }
});

const input_error = w => {
  let query = "";
  if(won_game)
    query = ".play-area";
  else if(play_board[w] != "")
    query = `#block_${w}`;

  if(query != "") {
    document.querySelector(query).classList.add("error");
    setTimeout(function() { document.querySelector(query).classList.remove("error"); },250);
    setTimeout(function() { document.querySelector(query).classList.add("error"); },250);
    setTimeout(function() { document.querySelector(query).classList.remove("error"); },250);
  }
};

/** Computer not trying to add on full board */
let board_isfull = false;
const check_isfull = () => {
  let flag = true;
  play_board.forEach(block => {
    if (block != player && block != computer) {
      flag = false;
    }
  });
  board_isfull = flag;
};

const game_loop = () => {
  render_board();
  check_isfull();
  check_ifwon();
};

/** Win check */
const say_winner = document.getElementById("whowon");
let won_game = false;
const check_ifwon = () => {
  let res = check_match();
  if(res == player) {
    say_winner.innerText = "Player won the game!";
    say_winner.classList.add("player");
    won_game = true;
  } else if(res == computer) {
    say_winner.innerText = "Computer won the game!";
    say_winner.classList.add("computer");
    won_game = true;
  } else if(board_isfull) {
    say_winner.innerText = "Tied game!";
    say_winner.classList.add("draw");
    won_game = true;
  }
};

const check_line = (a, b, c) => {
  return(
    play_board[a] == play_board[b] &&
    play_board[b] == play_board[c] &&
    (play_board[a] == player || play_board[a] == computer)
  );
};

const check_match = () => {
  // Horizontal lines
  for(i = 0; i < 9; i += 3) {
    if(check_line(i, i + 1, i + 2)) {
      return play_board[i];
    }
  }

  // Vertical lines
  for(i = 0; i < 3; i++) {
    if(check_line(i, i + 3, i + 6)) {
      return play_board[i];
    }
  }

  if(check_line(0, 4, 8)) {
    return play_board[0];
  }

  if(check_line(2, 4, 6)) {
    return play_board[2];
  }

  return "";
};

/** Reset button */
const reset_board = () => {
  let conf = false;
  if(!won_game) {
    conf = confirm("Are you sure you want to reset the board?");
  }
  if(won_game || conf) {
    play_board = ["", "", "", "", "", "", "", "", ""];
    board_isfull = false;
    won_game = false;
    say_winner.classList.remove("player");
    say_winner.classList.remove("computer");
    say_winner.classList.remove("draw");
    say_winner.innerText = "";
    render_board();
  }
}

/** Initial Render */
render_board();