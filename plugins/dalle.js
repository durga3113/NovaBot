const axios = require('axios');

exports.default = {
  name: 'dalle',
  category: 'images',
  carryOut: async (nova, m, { react, args }) => {

    if (!args || args.length === 0) {
      await react('❌');
      return m.reply('Please provide a text, e.g., "goku".');
    }

    const imag = `https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=${encodeURIComponent(args)}`;
        const res = await axios.get(imag, { responseType: 'arraybuffer' });

        if (res.data) {
      const isDun = res.data;
      await nova.sendMessage(m.chat, { image: isDun }, { quoted: m });
    } else {
      await react('❌');
      await m.reply('_Try again_');
    }
  }
};
        
