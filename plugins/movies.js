const axios = require('axios');

const formatMovieDetails = (movieInfo) => {
  const {
    Title, Year, Rated, Released, Runtime, Genre, Director, Writer,
    Actors, Plot, Language, Country, Awards, BoxOffice, Production,
    imdbRating, imdbVotes
  } = movieInfo;

  return `🎬 *${Title} (${Year})*` +
         `\n⭐ *Rated:* ${Rated}` +
         `\n📆 *Released:* ${Released}` +
         `\n⏳ *Runtime:* ${Runtime}` +
         `\n🌀 *Genre:* ${Genre}` +
         `\n👨🏻‍💻 *Director:* ${Director}` +
         `\n✍ *Writer:* ${Writer}` +
         `\n👨 *Actors:* ${Actors}` +
         `\n📃 *Plot:* ${Plot}` +
         `\n🌐 *Language:* ${Language}` +
         `\n🌍 *Country:* ${Country}` +
         `\n🎖️ *Awards:* ${Awards}` +
         `\n📦 *BoxOffice:* ${BoxOffice}` +
         `\n🏙️ *Production:* ${Production}` +
         `\n🌟 *IMDb Rating:* ${imdbRating}` +
         `\n✅ *IMDb Votes:* ${imdbVotes}`;
};

exports.default = {
  name: 'movie',
  category: 'search',
  carryOut: async (nova, m, { react, args }) => {
    try {
      if (!args) {
        await react('❌');
        return m.reply(`Please provide the name of the movie you want to search.`);
      }
      
      await react('🔍');
      
      const movieInfo = await searchMovie(args);

      if (!movieInfo || movieInfo.Response === 'False') {
        await react('❌');
        return m.reply(`Sorry, couldn't find information for the provided movie.`);
      }

      const movieDetails = formatMovieDetails(movieInfo);

      await nova.sendMessage(m.chat, movieDetails, { quoted: m });
    } catch (error) {
      console.error(error);
      await react('❌');
      return m.reply(`❌ An error occurred while processing the request...`);
    }
  }
};

const searchMovie = async (movieName) => {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${movieName}&plot=full`);
    return response.data;
  } catch (error) {
    console.error("Error": error);
    return null;
  }
};
