const { getUpTime } = require('../lib/itsTime.js');

exports.default = {
  name: 'uptime',
  category: 'mics',
  async carryOut(nova, react, m) {
    
    await react('⏲️');
    const uptime = process.uptime();
    const { daysElapsed, dayOfWeek, hours, minutes } = getUpTime(uptime);
    m.reply(`*Uptime*: ${daysElapsed} days (${dayOfWeek}), ${hours} hours, ${minutes} minutes`);
  }
};
