const fetch = async (url) => import('node-fetch').then(module => module.default(url));

exports.default = {
  name: 'bin',
  category: 'converct',
  carryOut: async (nova,m,{react,args}) => {
    if (!args) {
      await react('❌');
      return m.reply('Provide cc to convert');
    }

    var THIS_HEROKU = `https://vihangayt.me/tools/bingen?query=${args}`;
    const res = await fetch(THIS_HEROKU);
    const data = await res.json();

    if (data.status) {
      const _C_Info = data.data.map(card => {
        return `CardNumber: ${card.CardNumber}\nExpirationDate: ${card.ExpirationDate}\nCVV: ${card.CVV}\n\n`;
      }).join('');

      return m.reply(`*BIN CONVERTER*\n\n${_C_Info}`);
    } else {
      m.reply('Im tired bruh');
    }
  });
