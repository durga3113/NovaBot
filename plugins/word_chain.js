exports.default = {
  name: 'wordchain',
  category: 'games',
  carryOut: async (nova, m, { react, args }) => {
    const words = [
      'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew',
      'ice cream', 'jackfruit', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange',
      'pineapple', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli fruit',
      'victoria plum', 'watermelon', 'xigua', 'yellow passionfruit', 'zucchini'
    ];

    let currentWord = '';
    let player1 = '';
    let player2 = '';
    let turn = 1;
    let gameOver = false;
    let timer = null;
    let timeLimit = 30; 
    let gameMode = 'normal'; 

    function getRandomWord() {
      return words[Math.floor(Math.random() * words.length)];
    }

    function getNextWord(word) {
      const lastLetter = word.slice(-1);
      return words.find(w => w.startsWith(lastLetter));
    }

    function checkWordValidity(word) {
      return words.includes(word);
    }

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        gameOver = true;
        nova.sendMessage(m.chat, { text: 'Time\'s up! Game over!' });
      }, timeLimit * 1000);
    }

    function createGameStatus(currentWord, currentPlayer, currentTurn) {
      return `__Word Chain Game__

| _Word_ | _Player_ | _Turn_ | _Chain_ |
| --- | --- | --- | --- |
| *${currentWord}* | ${currentPlayer} | ${currentTurn} | ↪ |

_Game Stats:_
- _Current Turn:_ ${currentTurn}
- _Game Mode:_ ${gameMode}
`;
    }

    function handleTurn(word) {
      if (!checkWordValidity(word)) {
        m.reply('Invalid word! Try again.');
        return;
      }

      if ((turn === 1 && m.pushName === player1) || (turn === 2 && m.pushName === player2)) {
        currentWord = word;
        turn = turn === 1 ? 2 : 1;
        nova.sendMessage(m.chat, { text: createGameStatus(currentWord, turn === 1 ? player1 : player2, turn) });
        resetTimer();
      } else {
        m.reply('It\'s not your turn!');
      }
    }

    if (args[0] === 'start') {
      player1 = m.pushName;
      currentWord = getRandomWord();
      nova.sendMessage(m.chat, { text: createGameStatus(currentWord, player1, 1) });
      resetTimer();
    } else if (args[0] === 'join') {
      player2 = m.pushName;
      nova.sendMessage(m.chat, { text: createGameStatus(currentWord, player1, 1) });
    } else if (args[0] === 'next') {
      if (gameOver) {
        m.reply('Game over Start a new game with !wordchain start');
        return;
      }
      let word = args.slice(1).join(' ');
      handleTurn(word);
    } else {
      m.reply('*_Usage_*: !wordchain start|join|next <word>');
    }

    if (gameOver) {
      m.reply(`Game over: *Mode*: ${gameMode}`);
    }
  }
};
                             
