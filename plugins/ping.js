exports.default = {
  name: 'ping',
  category: 'misc',
  carryOut: async (nova, m, { react }) => {
  
    const { performance } = require('perf_hooks');
    await react('🐊');
    const startTime = performance.now();
    await m.reply('```Ping!```');
    const endTime = performance.now();
    const pingTime = endTime - startTime;

    return await nova.sendMessage(`*Pong!*\n\`\`\`${pingTime.toFixed(2)}\`\`\` *ms*`);
  }
};
