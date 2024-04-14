const fs = require('fs');
const YouTube = require("youtube-sr").default;

exports.default = {
  name: 'yts',
  category: 'search',
  carryOut: async (nova, m, { react, args }) => {
    
    const formatVideo = (video) => {
      const { title, duration, views, uploadedAt, url } = video;
      const isDuration = formatDuration(duration); 
      const isViews = formatViews(views);
      const isDate = formatDate(uploadedAt);
      return `*Title:* ${title}\n*Time:* ${isDuration}\n*Views:* ${isViews}\n*Publish:* ${isDate}\n*Link:* ${url}`;
    };

      const Messag = (query, videos) => {
      const queryHeader = `*Results for:* \`${query}\`\n\n`;
      const videoMessages = videos.map(formatVideo);
      return queryHeader + videoMessages.join("\n\n");
    };

    if (!args) {
      await react("❌");
      return m.reply("*Provide a query example how to create NovaBot*");
    }

    const query = args;
    const videos = await YouTube.search(query, { limit: 1 }); 

    if (!videos.length) {
      await react("❌");
      return m.reply("*No results found for:* `" + query + "`");
    }

    await react("✅");

    const tubei = Messag(query, videos);

    nova.sendMessage(m.chat, { text: tubei }, { quoted: m });
  }
};
