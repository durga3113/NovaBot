exports.default = {
name: 'wordchain',
category: 'games',
carryOut: async (nova, m, { react, args }) => {

   const words = [
'apple',
'banana',
'cherry',
'date',
'elderberry',
'fig',
'grape',
'honeydew',
'ice cream',
'jackfruit',
'kiwi',
'lemon',
'mango',
'nectarine',
'orange',
'pineapple',
'quince',
'raspberry',
'strawberry',
'tangerine',
'ugli fruit',
'victoria plum',
'watermelon',
'xigua',
'yellow passionfruit',
'zucchini'
];
let currentWord = '';
let player1 = '';
let player2 = '';
let turn = 1;
let gameOver = false;
let timer = null;
let timeLimit = 30;
let gameMode = 'normal'; 

   if (args[0] === 'start') {
  player1 = m.pushName;
    currentWord = getRandomWord();
await m.reply(`__Word Chain Game__

| _Word_ | _Player_ | _Turn_ | _Chain_ |
| --- | --- | --- | --- |
| *${currentWord}* | ${player1} | 1 | ↪ |

_Game Stats:_
- _Current Turn:_ 1
- _Game Mode:_ ${gameMode}

`); timer = setTimeout(() => { gameOver = true; m.channel.send('Time's up! Game over!'); }, timeLimit * 1000); } else if (args[0] === 'join') { player2 = m.author.username; await m.channel.send(`__Word Chain Game__

| _Word_ | _Player_ | _Turn_ | _Chain_ |
| --- | --- | --- | --- |
| *${currentWord}* | ${player1} | 1 | ↪ |

_Game Stats:_
- _Current Turn:_ 1
- _Game Mode:_ ${gameMode}

`); } else if (args[0] === 'next') { if (gameOver) { await nova.sendMessage(m.chat,{text:'Game over! Start a new game with !wordchain start'}); return; } if (m.pushName === player1 && turn === 1) { const nextWord = getNextWord(currentWord); if (nextWord) { currentWord = nextWord; await m.reply(`__Word Chain Game__

| _Word_ | _Player_ | _Turn_ | _Chain_ |
| --- | --- | --- | --- |
| *${currentWord}* | ${player1} | 2 | ↩️ ${currentWord.slice(-1)} |

_Game Stats:_
- _Current Turn:_ 2
- _Game Mode:_ ${gameMode}

`); turn = 2; clearTimeout(timer); timer = setTimeout(() => { gameOver = true; m.reply('*_Time's up! Game over_*'); }, timeLimit * 1000); } else { await m.channel.send('No more words in the chain!'); gameOver = true; } } else if (m.author.username === player2 && turn === 2) { const word = args.slice(1).join(' '); if (word.startsWith(currentWord.slice(-1))) { currentWord = word; await m.channel.send(`__Word Chain Game__

| _Word_ | _Player_ | _Turn_ | _Chain_ |
| --- | --- | --- | --- |
| *${currentWord}* | ${player2} | 3 | ↩️ ${currentWord.slice(-1)} |

_Game Stats:_
- _Current Turn:_ 3
- _Game Mode:_ ${gameMode}

`);
  turn = 1;
    clearTimeout(timer);
   timer = setTimeout(() => {
 gameOver = true;
   m.reply('Time's up! Game over');
   }, timeLimit * 1000);
} else {
   await m.reply('Invalid word! Try again.');
 }
} else {
  await nova.sendMessage(m.chat,{text:'You are not a player in this game'});
   }
} else {
  await m.reply('Usage: !wordchain');
}

  function getRandomWord() {
return words[Math.floor(Math.random() * words.length)];
}

   function getNextWord(word) {
  const lastLetter = word.slice(-1);
     const nextWord = words.find(w => w.startsWith(lastLetter));
return nextWord;
}

