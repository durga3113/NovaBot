const { find } = require('../lib/functions');

exports.exports = {
  name: 'find',
  category: 'search',
  carryOut: async (nova, m, { react, match }) => {
    try {
      var mediaData = await m.quoted.download();
      var searchData = await find(mediaData);

      if (!searchData.status) {
        await react('❌');
        await nova.sendMessage(m.chat, { text: '_No results found_' }, { quoted: m });
        return;
      }

      await react('™️');
      var Msg = `
🔎 **Song Results**
-------------------------
**Title:**\t\t${searchData.title}
**Artist(s):**\t${searchData.artists.join(', ')}
**Album:**\t\t${searchData.album}
**Genre(s):**\t${searchData.genres.join(', ')}
**Release Date:**\t${searchData.release_date}
**Spotify:**\t[Spotify](${searchData.spotify})
      `.trim();

      await nova.sendMessage(m.chat, { text: Msg }, { quoted: m });
    } catch (error) {
      console.error('_Error_:', error);
      await nova.sendMessage(m.chat, { text: '_Error occurred_' }, { quoted: m });
    }
  }
};
                               
