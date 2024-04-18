const A = require('axios');

exports.default = {
  name: 'song',
  alias: ['audio'],
  category: 'downloads',
  carryOut: async (nova,m,{react,args}) => {

  if(!args) {
      await react('❌');
    return m.reply(`Provide a name: song${args}`);
  }
    var song = A.get(`https://api-viper-x.koyeb.app/api/song?name=${args}`);
    const archive = res.data;
    
