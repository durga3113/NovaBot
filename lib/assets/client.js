const { serialize, decodeJid } = require('./connection.js');
const chalk = require('chalk');
const axios = require('axios');
const winston = require('winston');
const fs = require('fs');
const os = require('os');
const config = require('../config.js');
const util = require('util');

const messagea = async (messages, nova) => {
  try {
    const m = serialize(JSON.parse(JSON.stringify(messages.messages[0])), nova);
    const isValid = isValid(m);
    if (!isValid) return;

    const { isGroup, sender, chat, body } = m;
    const gcMeta = isGroup ? await nova.groupMetadata(chat) : '';
    const args = getArguments(body);
    const match = getMatched(body);
    const iscmd = isCommand(body);
    const cmdName = getCommandName(body);
    const arg = getCommandArgument(body, cmdName);
    const groupMembers = getGroupMembers(gcMeta);
    const groupAdmins = getGroupAdmins(groupMembers);
    const botNumber = await decodeJid(nova.user.id);
    const senderId = m.sender.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const isDev = [botNumber, ...config.MODS]
      .map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
      .find((creator) => creator === senderId) !== undefined;

    const react = async (emoji, m, nova) => {
      const getReact = {
        react: { text: emoji, key: m.key },
      };
      await nova.sendMessage(m.chat, getReact);
    };

    if (process.env.PREFIX && process.env.PREFIX === 'alive') { //cmd
      await react("🐊");
      let theText = `Hi The NovaBot is alive`; 
      await nova.sendMessage(m.chat, theText);
    }

    if (iscmd) {
      const command = nova.getCommand(cmdName);
      if (command) {
        command.carryOut(nova, m, { gcMeta, react, arg, args, match, cmdName, groupMembers, groupAdmins, isGroup });
      }
    }

    logM(m, isGroup, gcMeta, body);
  } catch (err) {
    console.error(chalk.red(err));
    nova.sendMessage(m.chat, `*ERROR OCCURRED*\n:exclamation: ${util.format(err)} :exclamation:`, m);
  }
};

const isValid = (m) => {
  return m.message && m.type !== 'notify' && m.key?.remoteJid !== 'status@broadcast';
};

const getArguments = (body) => {
  return body.trim().split(/ +/).slice(1);
};

const getMatched = (body) => {
  return body.trim().split(/ +/).slice(1);
};

const isCommand = (body) => {
  return body.startsWith(nova.prefix);
};

const getCommandName = (body) => {
  return body.slice(nova.prefix.length).trim().split(/ +/).shift().toLowerCase();
};

const getCommandArgument = (body, cmdName) => {
  return body.replace(cmdName, '').slice(1).trim();
};

const getGroupMembers = (gcMeta) => {
  return gcMeta?.participants || [];
};

const getGroupAdmins = (groupMembers) => {
  return groupMembers.filter((member) => member.admin).map((member) => member.id);
};

const isAdmin = (user, groupAdmins) => {
  return groupAdmins.includes(user);
};

const logM = (m, isGroup, gcMeta, body) => {
  const chatType = isGroup ? 'GROUP' : 'PRIVATE';
  const Names = isGroup ? gcMeta.subject : m.sender;
  console.log(
    `\n[${chalk.bgWhite(chatType)}]   => ${chalk.green(Names)}\n` +
    `[SENDER]  => ${chalk.red(m.sender)}\n` +
    `[MESSAGE] => ${chalk.red(body || m.type)}\n`
  );
};

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
});

function logMessage(level, msg) {
  logger.log({
    level: level,
    message: msg
  });
}

const mapping = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","a":"ᴀ","b":"ʙ","c":"ᴄ","d":"ᴅ","e":"ᴇ","f":"ꜰ","g":"ɢ","h":"ʜ","i":"ɪ","j":"ᴊ","k":"ᴋ","l":"ʟ","m":"ᴍ","n":"ɴ","o":"ᴏ","p":"ᴘ","q":"ϙ","r":"ʀ","s":"ꜱ","t":"ᴛ","u":"ᴜ","v":"ᴠ","w":"ᴡ","x":"x","y":"ʏ","z":"ᴢ","A":"A","B":"ʙ","C":"C","D":"D","E":"E","F":"F","G":"G","H":"H","I":"I","J":"J","K":"K","L":"L","M":"M","N":"N","O":"O","P":"P","Q":"Q","R":"R","S":"S","T":"T","U":"U","V":"V","W":"W","X":"X","Y":"Y","Z":"Z"};

function charStylist(text) {
    let charStylist = '';
    for (let char of text) {
        charStylist += mapping[char] || char;
    }
    return charStylist;
}

async function getGPTReply(args, maxTokens = 50, topP = 0.9, temperature = 0.7) {
  const res = await axios.get(`https://api.maher-zubair.tech/ai/chatgptv4?q=${args}`, {
    params: {
      maxTokens,
      topP,
      temperature
    }
  });

  if (res.status === 200) {
    return res.data.result;
  } else {
    console.error(res.statusText);
    return m.reply('_Error occurred_');
  }
}

async function nvbuffe(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return response.data;
}

if (isDev) {
  const command = m.text.charAt(0);
  if (command === '>' || command === '$' || command === '#') {
    const code = body.slice(2);

    if (!code) {
      await react("❌");
      m.reply(`NovaBot eval needs a js code to run`);
      return;
    }

    try {
      const executeCode = command === '>' || command === '#'
        ? new Function('return (' + code + ')')()
        : await (async () => {
          const fn = new Function('return (' + code + ')');
          return await fn();
        })();

      nova.sendMessage(m.chat, `*${command === '>' ? 'THE' : 'ERROR'} OUTPUT*\n${util.format(executeCode)}`, m);
    } catch (err) {
      console.error(err);
      nova.sendMessage(m.chat, `*ERROR OCCURRED*\n:exclamation: ${util.format(err)} :exclamation:`, m);
    }
  }
}

exports.default = { messagea, logMessage, charStylist, getGPTReply, nvbuffe };
