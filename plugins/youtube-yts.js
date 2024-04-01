const axios = require("axios");
const yts = require('yt-search');

exports.default = {
  name: 'yts',
  category: 'search',
  async carryOut(nova, react, m, { args }) {
    
    if (!args) {
      await react('❌');
      return m.reply('*Provide a query example how to create NovaBot*');
    }
    await react('🔍');
    const { videos } = await yts(args);
    const maxVideos = 25;
    const videosToShow = videos.slice(0, maxVideos);

    if (videosToShow.length === 0) {
      await react('❌');
      return m.reply('No YouTube videos found for the given query.');
    }

    const fResult = videosToShow.map((video, index) => {
      const searchz = index + 1;
      return `*🔎 Search*: ${searchz}\n\n` 
        + `*📽️ TITLE*: ${video.title}\n` 
        + `*👁️ VIEWS*: ${video.views}\n` 
        + `*⌛ DURATION*: ${video.timestamp}\n` 
        + `*📅 UPLOADED*: ${video.ago}\n` 
        + `*🔗 LINK*: ${video.url}\n\n`;
    }).join('');

    const img = videosToShow[0].thumbnail;
    nova.sendMessage(m.chat, { image: { url: img }, caption: fResult }, { quoted: m });
  }
};
