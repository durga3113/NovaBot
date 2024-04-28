exports.default = {
name: 'ttt',
category: 'games',
carryOut: async (nova, m, { react, args }) => {

const board = [
[' ', ' ', ' '],
[' ', ' ', ' '],
[' ', ' ', ' ']
];

let currentPlayer = '❌';
let players = [];

async function printBoard() {
  nova.sendMessage(m.chat, {
text: `${board[0][0]} | ${board[0][1]} | ${board[0][2]}* ${board[1][0]} | ${board[1][1]} | ${board[1][2]}* ${board[2][0]} | ${board[2][1]} | ${board[2][2]}`
 });
}

async function checkWinner() {
for (let i = 0; i
  if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== ' ') {
  nova.sendMessage(m.chat, {
    text: `Player ${board[i][0]} wins`
});
     return true;
  }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== ' ') {
     nova.sendMessage(m.chat, {
   text: `Player ${board[0][i]} wins`
});
   return true;
  }
}
if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ' ') {
  nova.sendMessage(m.chat, {
    text: `Player ${board[0][0]} wins`
  });
return true;
}
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ' ') {
       nova.sendMessage(m.chat, {
         text: `Player ${board[0][2]} wins`
     });
    return true;
  }
return false;
}

    if (args[0] === 'join') {
  if (players.length
       players.push(m.author.username);
         nova.sendMessage(m.chat, {
           text: `${m.pushName} has joined the game`
      v});
} else {
     nova.sendMessage(m.chat, {
       text: 'This game is already full'
    });
  }
}

  if (args[0] === 'start') {
    if (players.length === 2) {
await printBoard();
   } else {
       nova.sendMessage(m.chat, {
        text: 'Not enough players to start the game'
     });
    }
}

else {
    const move = args[0];
      if (move === 'quit') {
    return;
}

const row = parseInt(move.split(' ')[0]);
const col = parseInt(move.split(' ')[1]);

     if (row
         nova.sendMessage(m.chat, {
          text: 'Invalid move, try again'
     });
continue;
}

      if (board[row][col] !== ' ') {
        nova.sendMessage(m.chat, {
         text: 'That spot is already taken'
     });
   continue;
}

board[row][col] = currentPlayer;

     if (await checkWinner()) {
       return;
         }

      currentPlayer = currentPlayer === '❌' ? '⭕' : '❌';
     }
   }
};                                                                                                             
