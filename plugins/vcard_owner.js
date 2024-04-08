const config = require('../../config.js');
const { nvbuffe } = require('../../lib/assets/client.js');

exports.default = {
  name: 'owner',
  category: 'misc',
  carryOut: async (nova, m, { react }) => {
    
    await react('👤');

    const { MODS, OWNER_NAME } = process;
    const cell = MODS;
    const ownerName = OWNER_NAME;
    const nvlogo = "https://i.imgur.com/iLSSzc8.jpeg";
    const sourceUrl = `https://wa.me/${cell}`;

    const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:;\nTEL;type=CELL;type=VOICE;waid=${cell}:+${cell}\nEND:VCARD`;

    const nvthumb = await nvbuffe(nvlogo);

    const buttonMessage = {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard: vcardData }],
      },
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: config.CAPTION,
          body: m.pushName,
          thumbnail: nvthumb,
          mediaType: 1,
          mediaUrl: '',
          sourceUrl,
        },
      },
    };

    await nova.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
};
