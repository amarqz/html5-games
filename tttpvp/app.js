let play_board = ["", "", "", "", "", "", "", "", ""];

const board_container = document.querySelector(".play-area");
const player1 = "O";
const player2 = "X";

const render_board = () => {
  board_container.innerHTML = "";
  play_board.forEach((user, block) => {
    board_container.innerHTML += `<div id="block_${block}" class="block" onclick="addPlayerMove(${block})">${play_board[block]}</div>`;
    if (user == player1 || user == player2) {
      document.querySelector(`#block_${block}`).classList.add("occupied");
    }
  });
};

/** Moves */

const addPlayerMove = w => {
  if (play_board[w] == "" && !won_game) {
    switch(turn) {
      case 1:
        who = player1;
        break;
      case 2:
        who = player2;
        break;
    }
    play_board[w] = who;
    game_loop();
  }
};

/** Checking if board is full */
let board_isfull = false;
const check_isfull = () => {
  let flag = true;
  play_board.forEach(block => {
    if (block != player1 && block != player2) {
      flag = false;
    }
  });
  board_isfull = flag;
};

const game_loop = () => {
  render_board();
  check_isfull();
  check_ifwon();
  change_turn();
};

/** Win check */
const say_winner = document.getElementById("whowon");
let won_game = false;
const check_ifwon = () => {
  let res = check_match();
  if(res == player1) {
    let p1name = document.getElementById("player_1").value;
    say_winner.innerText = `${p1name} won the game!`;
    say_winner.classList.add("player");
    won_game = true;
  } else if(res == player2) {
    let p2name = document.getElementById("player_2").value;
    say_winner.innerText = `${p2name} won the game!`;
    say_winner.classList.add("visitor");
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
    (play_board[a] == player1 || play_board[a] == player2)
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
    say_winner.classList.remove("visitor");
    say_winner.classList.remove("draw");
    say_winner.innerText = "";
    turn = who_begins();
    render_board();
  }
};

/** Turns */
const who_begins = () => {
  document.querySelector("#player_1").classList.remove("theirturn");
  document.querySelector("#player_2").classList.remove("theirturn");
  let who = Math.floor(Math.random() * 2) + 1; // 1 player_1; 2 player_2
  document.querySelector(`#player_${who}`).classList.add("theirturn");
  return who;
};

const change_turn = () => {
  document.querySelector(`#player_${turn}`).classList.remove("theirturn");
  switch(turn) {
    case 1:
      turn = 2;
      break;
    case 2:
      turn = 1;
      break;
  }
  document.querySelector(`#player_${turn}`).classList.add("theirturn");
};

/** Initial Render */
let turn = who_begins();
render_board();