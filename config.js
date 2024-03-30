const { Sequelize } = require('sequelize');
const { existsSync } = require('fs');
const path = require('path');
const conn = path.join(__dirname, './config.env');
const databaz = path.join(__dirname, './database.db');

if (existsSync(conn)) require('dotenv').config({ path: conn });
const DATABASE_URL =
process.env.DATABASE_URL === undefined ? databaz : process.env.DATABASE_URL;

const {
  SESSION_ID = '',
  PREFIX = '^[.,!]',
  MODS = '',
  HEROKU_APP_NAME,
  HEROKU_API_KEY,
  PACKNAME = '🐊, NovaBot',
} = process.env;

const config = {
  SESSION_ID: SESSION_ID.trim(),
  CONTROLS: PREFIX.trim(),
  MODS,
  HEROKU_APP_NAME,
  HEROKU_API_KEY,
  PACKNAME,
  DATABASE: DATABASE_URL === databasePath ?
    new Sequelize({
      dialect: 'sqlite',
      storage: DATABASE_URL,
      logging: false,
    }) :
    new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      ssl: true,
      protocol: 'postgres',
      dialectOptions: {
      native: true,
      ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    }),
};

module.exports = config;
