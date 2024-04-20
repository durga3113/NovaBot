const WorkType = sequelize.define('WorkType', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  botMode: Sequelize.STRING
});

async function setBotMode(mode) {
  let selectedMode = await WorkType.findOne({ where: { id: "1" } });
  if (!selectedMode) {
    await WorkType.create({ id: "1", botMode: mode });
    return;
  }
  if (selectedMode.botMode === mode) {
    return;
  }
  await WorkType.update({ botMode: mode }, { where: { id: "1" } });
}

 async function getBotMode() {
  const selectedMode = await WorkType.findOne({ where: { id: "1" } });
  if (!selectedMode) {
    return "public";
  }
  return selectedMode.botMode;
      }
                                              
