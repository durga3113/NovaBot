const config = require('../config');

exports.default = {
  name: 'sticker',
  category: 'converter',
  carryOut: async (nova, m, { react, args, mime }) => {

    if (!m.quoted) {
      return m.reply("Please reply to a photo or video to convert it into a sticker.");
    }

    const mime = m.quoted.mimetype;
    if (!(/image|video/.test(mime))) {
      return m.reply("*_Please reply to a photo or video._*");
    }

    try {
      let mediaBuffer = await m.quoted.download();
      await nova.sendMessage(m.chat, {
        sticker: mediaBuffer,
        contextInfo: {
          externalAdReply: {
            title: "",
            body: "",
            sourceUrl: "",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            thumbnailUrl: "https://i.imgur.com/Ou56ggv.jpeg"
          }
        }
      }, {
        packname: config.PACKNAME.split(";")[0],
        author: "" 
      });

    } catch (error) {
      console.error("*_Error_*:", error);
      m.reply("*_Error_*");
    }
  }
};
    
