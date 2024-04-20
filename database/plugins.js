const { DataTypes } = require('sequelize');

const Plugin = sequelize.define('Plugin', {
  plugin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

async function add(newPlugin, url) {
  try {
    await Plugin.create({ plugin: newPlugin, url: url });
  } catch (error) {
    console.error(error);
  }
}

async function check(name) {
  try {
    const plugin = await Plugin.findOne({ where: { plugin: name } });
    return !!plugin;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function remove(name) {
  try {
    const plugin = await Plugin.findOne({ where: { plugin: name } });
    if (!plugin) throw new Error("*_Plugin not found_*");
    await plugin.destroy();
  } catch (error) {
    console.error(error);
  }
}

async function urls() {
  try {
    const plugins = await Plugin.findAll({ attributes: ['url'] });
    return plugins.map(plugin => plugin.url);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function list() {
  try {
    return await Plugin.findAll({ attributes: ['plugin', 'url'] });
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { add, check,remove, urls, list, Plugin };
    
