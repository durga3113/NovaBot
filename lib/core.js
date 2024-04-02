const express = require("express");
const novaInit = require('@whiskeysockets/baileys').default;
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require("fs");
const { Collection } = require('discord.js');
const { messegea } = require('./assets/client.js'); 
const  contact  = require('./assets/number.js');
const logger = pino({ level: "silent" });


const app = express();
const store = require('@whiskeysockets/baileys').makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const clearState = () => {
fs.unlinkSync("./clear.json");
};

async function startNova() {
  try {
    const nova = novaInit({
      logger,
      printQRInTerminal: false,
      browser: ["NovaBot", "Chrome", "1.0.0"],
      auth: (await require('@whiskeysockets/baileys').useMultiFileAuthState("./clear.json")).state
    });

    store.bind(nova.ev);
    nova.cmd = new Collection();

    const cFiles = fs.readdirSync("./plugins").filter(file => file.endsWith(".js"));
    for (const file of cFiles) {
      const command = require(`./plugins/${file}`);
      nova.cmd.set(command.name, command);
    }

    nova.ev.on('creds.update', () => saveCreds("./clear.json"));
    nova.ev.on('connection.update', ConnectionUpdate);
    nova.ev.on('messages.upsert', messages => messagea(messages, nova));
    nova.ev.on('contacts.update', update => contact.saveContacts(update, nova));

  } catch (error) {
    console.error("Nova:", error);
  }
}

function ConnectionUpdate(update) {
  const { connection, lastDisconnect } = update;

  switch (Boom(lastDisconnect?.error)?.output.statusCode) {
    case require('@whiskeysockets/baileys').DisconnectReason.connectionClosed:
      console.log("Connection closed, reconnecting...");
      startNova();
      break;
    case require('@whiskeysockets/baileys').DisconnectReason.loggedOut:
      clearState();
      console.log("Device Logged Out, Please Delete Session and Scan Again.");
      process.exit();
      break;
    case require('@whiskeysockets/baileys').DisconnectReason.restartRequired:
      console.log("Server starting...");
      startNova();
      break;
    case require('@whiskeysockets/baileys').DisconnectReason.timedOut:
      console.log("Connection Timed Out, Trying to Reconnect....");
      startNova();
      break;
    default:
      console.log("Server Disconnected: Maybe Your WhatsApp Account got banned !");
      clearState();
      break;
  }
}

function saveCreds(filename) {
  fs.writeFileSync(filename, JSON.stringify(state));
}

module.exports = { startNova };
