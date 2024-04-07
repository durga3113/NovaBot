const { getGPTReply } = require('../..lib/assets/client.js');

exports.default = {
  name: 'gpt',
  category: 'GPT',
  carryOut: async (nova, m, { react, args }) => {
    
    if(!args) {
       await react('❌');
      return m.reply('Provide a query: what is novabot');
    }
    await react('🤖');
    const ai_reply = await getGPTReply(args);
    nova.sendMessage(m.chat, ai_reply, { quoted: m });
  }
};
