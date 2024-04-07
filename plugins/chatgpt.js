const { getGPTReply } = require('../..lib/assets/client.js');

exports.default = {
  name: 'gpt',
  category: 'GPT',
  carryOut: async (nova, m, { react, args }) => {
    
    await react('🤖');
    const reply = await getGPTReply(args);
    nova.sendMessage(m.chat, reply, { quoted: m });
  }
};
