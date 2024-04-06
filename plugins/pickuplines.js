const axios = require('axios');

exports.default = {
  name: 'pickupline',
  category: 'funny',
  carryOut: async (nova, m, { react }) => {
   
    try {
      
      await react('😙');
      const res = await axios.get('https://api.popcat.xyz/pickuplines');
      
      if (res.status === 200) {
        const pickupline = res.data.pickupline;
        
        nova.sendMessage(m.chat, {
          image: { url: 'https://telegra.ph/file/b11162a821a91ce783283.jpg' },
          text: '```' + 
                '╭───────────────────────────╮\n' +
                '│  ' + pickupline.padEnd(26, ' ') + '│\n' +
                '╰───────────────────────────╯' +
                '```',
        });
        
      } else {
        console.error(res.status);
        m.reply('Sorry, no pickup line');
      }
      
    } catch (error) {
      console.error(error);
     m.repl('Sorry, an unexpected error occurred');
    }
  }
};
