const { Sequelize } = require('sequelize');
const { existsSync } = require('fs');
const path = require('path');

const cPath = path.join(__dirname, './config.env');
const databaz = path.join(__dirname, './database.db');
if (existsSync(cPath)) require('dotenv').config({ path: cPath });

let config = {
  SESSION_ID: process.env.SESSION_ID || '',
  PREFIX: process.env.PREFIX === undefined ? '.' : process.env.PREFIX,
  MODS: process.env.MODS ? process.env.MODS.split(',') : [],  
  MODS_LOCK: process.env.MODS_LOCK === undefined ? 'private' : process.env.MODS_LOCK,
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || undefined,
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || undefined,
  PACKNAME: process.env.PACKNAME || '🐊, NovaBot',
};

const DATABASE_URL = process.env.DATABASE_URL || databaz;

config.DATABASEURL = DATABASE_URL === databaz ?
  new Sequelize({
    dialect: 'sqlite',
    storage: databaz,
    logging: false,
  }) :
  new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    ssl: true,
    protocol: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });

module.exports = config;
