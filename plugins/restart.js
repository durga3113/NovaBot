const got = require('got')
const Heroku = require('heroku-client')
const Config = require('../config')
const heroku = new Heroku({ token: Config.HEROKU_API_KEY })
const baseURI = '/apps/' + Config.HEROKU_APP_NAME

if (Config.HEROKU_API_KEY && Config.HEROKU_APP_NAME) {
    
    exports.default = {
    name: 'restart',
    category: 'heroku',
    carryOut: async (nova,m, { react,isDev }) => {

      if(!isDev) {
        return m.reply('_This is for my owner_');
    }
      await react('🐊');
      return m.reply(`_Restarting NovaBot_`);
			await heroku.delete(baseURI + '/dynos').catch(async (error) => {
				await m.reply(`HEROKU : ${error.body.message}`)

    }
          }
                       }
        }
		
