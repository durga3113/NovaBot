const fs = require('fs');
const config = require('../config.js');
const path = require('path');

exports.default = {
  name: 'menu',
  category: 'general',
  description: 'Get all the commands and their categories',
  carryOut: async (nova, m, { react }) => {
    
    await react('🐊');

    const pluginsDir = __dirname;
    const files = fs.readdirSync(pluginsDir);
    const commands = [];

    files.forEach(file => {
      if (file !== 'menu.js' && file.endsWith('.js')) {
        const Pathz = path.join(pluginsDir, file);
        const plugin = require(Pathz);
        const { name, category } = plugin.default || {};
        if (name && category) {
          commands.push({ name, category });
        }
      }
      
    });

    const sorted = commands.sort((a, b) => a.category.localeCompare(b.category));

    const countPlugins = files.filter(file => file !== 'menu.js' && file.endsWith('.js')).length;

    const cTme = new Date();
    const hours = cTme.getHours();
    const minutes = cTme.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const Hourz = hours % 12 || 12;
    const Minutez = minutes < 10 ? `0${minutes}` : minutes;
    const CLOCK_WISE = `${Hourz}:${Minutez} ${ampm}`;

    let NOVA_MENU = '';
    
    NOVA_MENU += `*BOT NAME*: ${BOT_NAME}\n`;
    NOVA_MENU += `*PLUGINS*: ${countPlugins}\n`;
    NOVA_MENU += `*OWNER_NAME*: ${isDEV}\n`;
    NOVA_MENU += `*MODE*: ${config.MODS_LOCK}\n`;
    NOVA_MENU += `*TIME*: ${CLOCK_WISE}\n\n`;

    NOVA_MENU += `*💝 Commands Menu 💝*\n\n`;

    sorted.forEach(command => {
      NOVA_MENU += `     *${command.category}*\n`;
      NOVA_MENU += sorted
        .filter(cmd => cmd.category === command.category)
        .map(cmd => `  - ${cmd.name}`)
        .join('\n');
      NOVA_MENU += '\n\n';
    });

    NOVA_MENU += `*${config.CAPTION}*`;

    nova.sendMessage(m.chat, { text: NOVA_MENU }, { quoted: m });
  }
};
