const { DataTypes } = require('sequelize');

const WorkType = sequelize.define('WorkType', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  botMode: DataTypes.STRING
});

async function updBotMode(mode) {
  try {
    let bot = await WorkType.findByPk("1");
    if (!bot) {
      await WorkType.create({ id: "1", botMode: mode });
      return;
    }
    if (bot.botMode === mode) {
      return;
    }
    await bot.update({ botMode: mode });
  } catch (error) {
    console.error(error);
  }
}

async function gBM() {
  try {
    const bot = await WorkType.findByPk("1");
    if (!bot) {
      return "public";
    }
    return bot.botMode;
  } catch (error) {
    console.error(error);
    return "public";
  }
}

module.exports = {
  updBotMode,
  gBM
};
    
