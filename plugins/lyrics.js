
            
          if (!text) return reply(`Command usage: ${prefix}lyrics <song title>`);
        
          reply(mess.waiting);
        
          const getLyrics = require("@fantox01/lyrics-scraper");
        
          try {
            const data = await getLyrics(text);
        
            const message = `
        *Title:* ${text}
        *Artist:* ${data.artist}
        *Album:* ${data.album}
        *Release Date:* ${data.release_date}
        *URL:* ${data.url}
        *Thumbnail:* ${data.thumbnail}
        
        *Lyrics:*\n${data.lyrics}
            `.trim();
        
            Maria.sendMessage(from, { text: message, quoted: m });
          } catch (error) {
            console.error('Error fetching lyrics:', error);
            const errorMessage = 'Failed to fetch lyrics. Please try again later.';
            Maria.sendMessage(from, { text: errorMessage, quoted: m });
          }
          break;
