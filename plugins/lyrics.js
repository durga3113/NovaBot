const { messages, getMessage } = require('../lib/messages');
const getLyrics = require("@fantox01/lyrics-scraper");

exports.default = {
  name: 'lyrics',
  category: 'search',
  carryOut: async (nova, m, { react, match }) => {
   
 if (!match) {
      await react('🐊');
      return m.reply(getMessage('title_name'));
    }

    try {
      const { artist: a, album: ab, release_date: rd, thumbnail: th, lyrics: l } = await getLyrics(match);

      const lyric_table = `
        \n*Title*: ${match}` +
        `\n*Artist*: ${a}` +
        `\n*Released*: ${rd}` +
        `\n*Album*: ${ab}` +
        `\n\n*Lyrics*:\n${l}
      `.trim();

      nova.sendMessage(m.chat, { image: { url: th }, text: lyric_table}, {quoted: m });
    } catch (error) {
      console.error(error);
      m.reply(error);
    }
  }
};
            
