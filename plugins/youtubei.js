const axios = require('axios');

exports.default = {
  name: 'song',
  alias: ['audio'],
  category: 'downloads',
  carryOut: async (nova, m, { react, args }) => {
    
    try {
      if (!args) {
        await react('❌');
        return m.reply('_Please provide the name of the song_');
      }

      const query = encodeURIComponent(args);
      const res = await axios.get(`https://api-viper-x.koyeb.app/api/song?name=${query}`);

      if (res.status !== 200) {
        m.reply('NovaBot ' + re.status);
      }

       const isData = res.data;
      if (!isData || !isData.downloadUrl) {
        m.reply('_No song found_');
      }
      
      const nvBuff = await axios.get(isData.downloadUrl, { responseType: 'arraybuffer' });
      if (nvBuff.status !== 200) {
        m.reply('NovaBot' + nvBuff.status);
      }

     await nova.sendMessage(m.chat, {
        audio: nvBuff.data,
        mimetype: 'audio/mpeg'
      });

       await react('✅');
    } catch (error) {
      console.error('Oops:', error);

     await react('❌');
     return m.reply('_An error occurred_');
    }
  }
};
