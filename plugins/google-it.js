const googleIt = require('google-it');
const axios = require('axios');

exports.default = {
  name: 'google',
  alias: ['search'],
  category: 'internet',
  carryOut: async (nova, m, { react, args }) => {

    if(!args) {
      await react('❌');
      return m.reply('_Provide a query: google/search the NovaBot_');
    }
    
    try {
      const query = args;
      const searchResults = await googleIt(query, {
        limit: 13, 
        engine: 'google', 
      });

      if (searchResults.length === 0) {
        await m.reply('_No search results found_');
        return;
      }

      let response = '*🔍 Search results*:\n';
      for (let i = 0; i < searchResults.length; i++) {
        const result = searchResults[i];
        const botcaxh_api = `https://api.botcahx.eu.org/api/linkshort/cuttly?link=${encodeURIComponent(result.url)}&apikey=sjANGiU8`;
        try {
          const { data } = await axios.get(botcaxh_api);
          if (data.status) {
            const shortLink = data.result.shortLink;
            response += `${i + 1}. ${result.title}\n`;
            response += `   *Link*: [${shortLink}]\n`;
          } else {
            console.error('Error:', data.error);
            const shortLink = result.url; 
            response += `${i + 1}. ${result.title}\n`;
            response += `   *Link*: [${shortLink}]\n`;
          }
        
        } catch (error) {
          console.error('Error:', error);
          const shortLink = result.url; 
          response += `${i + 1}. ${result.title}\n`;
          response += `   *Link*: [${shortLink}]\n`;
        }
      }

      await m.reply(response);
    } catch (error) {
      await m.reply('❌ Error searching:', error);
    }
  },
};
