exports.default = {
  name: 'clear',
  category: 'whatsapp',
  carryOut: async (nova,m, { react }) => {

     await react('🐊');
    await m.clearChat(m.chat);
    await nova.sendMessage(m.chat, { text: '_Chat cleared successful_'}, { quoted:m })

  }
}
