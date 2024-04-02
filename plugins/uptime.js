const { getUpTime } = require('../../lib/assets/itsTime.js');

exports.default = {
  name: 'uptime',
  category: 'mics',
  carryOut: async (nova, m, { react }) => {
                  
    await react('⏲️');
    const uptime = process.uptime();
    const { daysElapsed, dayOfWeek, hours, minutes } = getUpTime(uptime);
    m.reply(`*Uptime*: ${daysElapsed} days (${dayOfWeek}), ${hours} hours, ${minutes} minutes`);
  }
};
