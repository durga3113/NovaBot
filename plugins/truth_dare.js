const fetch = async (url) => import('node-fetch').then(module => module.default(url));

exports.default = {
  name: 'truth',
  category: 'funny',
  carryOut: async (nova, m, { react }) => {
    
    await react('😂');

    let truth_api = `https://api.botcahx.eu.org/api/random/truth?apikey=sjANGiU8`;
    let dare_api = `https://api.botcahx.eu.org/api/random/dare?apikey=sjANGiU8`;

    let final;
    if (process.env.PREFIX === 'dare') {
      final = dare_api;
    } else {
      final = truth_api;
    }
   
    let res;
    try {
      res = await fetch(final);
    } catch (error) {
      m.reply('Error occurred');
    }
    
    if (!res.ok) {
      m.reply('Error occurred');
    }

    let data;
    try {
      data = await res.json();
    } catch (error) {
       await react('❌');
      m.reply('Error occurred while parsing');
    }
    let message = `*Your ${process.env.PREFIX === 'dare' ? 'Dare' : 'Truth'}:*\n${data.result}`;
    
    await nova.sendMessage(m.chat, { image: { url: `https://telegra.ph/file/cc71bd759fc935cbd5444.jpg` }, caption: message });
  }
}
