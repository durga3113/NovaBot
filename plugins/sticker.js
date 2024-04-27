exports.default = {
  name: 'sticker',
  category: 'converter',
  carryOut: async (nova,m,{react,args}) => {

  if (!(message.reply_message.video || message.reply_message.image))
      return await message.reply("*_Reply to photo or video!_*");
    let buff = await m.quoted.download();
    await nova.sendMessage(m.chat,{
      buff,
      { packname: config.STICKER_DATA.split(";")[0], contextInfo: { externalAdReply: {
title: "",
body: "",
sourceUrl: "",
mediaUrl: "",
mediaType: 1,
showAdAttribution: true,
thumbnailUrl: "https://i.imgur.com/Ou56ggv.jpeg" }} },
      "sticker"
    );
  }
);
