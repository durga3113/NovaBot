const fs = require('fs');
const path = require('path');

const getCMD = path.join(__dirname, 'plugins');

const fetchCommands = () => {
  const commands = [];
  const files = fs.readdirSync(getCMD);
  
  files.forEach(file => {
    const filePath = path.join(getCMD, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && path.extname(file) === '.js') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      if (fileContent.includes('exports.default = {')) {
        const commandName = fileContent.match(/name: '(.*)'/)[1];
        commands.push(commandName);
      }
    }
  });
  
  return commands;
};

const listCommands = () => {
  const commands = fetchCommands();
  let commandList = '```bash\nTHE NOVABOT LIST\n\n';
  
  commands.forEach((command, index) => {
    commandList += `[${index + 1}] ${command}\n`;
  });
  
  commandList += '```\n\n *NovaBot*';
  
  return commandList;
};

exports.default = {
  name: 'list', 
  category: 'general', 
  description: 'get all commands list',  
  carryOut: async (nova, m, { react, args }) => {

    await react('🐊');
    const commandList = listCommands();
  
    nova.sendMessage(m.chat, commandList, { quoted: m });
  }
};
