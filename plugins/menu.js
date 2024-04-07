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

    const cmd_countz = commands.length;

    const cTme = new Date();
    const hours = cTme.getHours();
    const minutes = cTme.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const Hourz = hours % 12 || 12;
    const Minutez = minutes < 10 ? `0${minutes}` : minutes;
    const CLOCK_WISE = `${Hourz}:${Minutez} ${ampm}`;

    let NOVA_MENU = '';
    NOVA_MENU += `*BOT NAME*: MyBot\n`;
    NOVA_MENU += `*PLUGINS*: ${cmd_countz}\n`;
    NOVA_MENU += `*OWNER_NAME*: JohnDoe\n`;
    NOVA_MENU += `*MODE*: ${config.MODS_LOCK}\n`;
    NOVA_MENU += `*TIME*: ${CLOCK_WISE}\n\n`;


    let mega = '';
    sorted.forEach(command => {
      mega += `╭───≺ ${command.category.toUpperCase()} ≻\n`;
      sorted
        .filter(cmd => cmd.category === command.category)
        .forEach(cmd => {
          mega += `│  - ${cmd.name.toLowerCase()}\n`;
        });
      mega += `╰─────────────◉\n`;
    });

    NOVA_MENU += mega; 

    nova.sendMessage(m.chat, { text: NOVA_MENU }, { quoted: m });
  }
};

// exports.default = { 
