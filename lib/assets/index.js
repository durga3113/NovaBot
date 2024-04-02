const { serialize, decodeJid } = require('./client.js');
const chalk = require('chalk');
const fs = require('fs');
const os = require('os');

const messagea = async (messages, nova) => {
  try {
    const m = serialize(JSON.parse(JSON.stringify(messages.messages[0])), nova);
    const isValid = isValid(m);
    if (!isValid) return;

    const { isGroup, sender, chat, body } = m;
    const gcMeta = isGroup ? await nova.groupMetadata(chat) : '';
    const args = getArguments(body);
    const iscmd = isCommand(body);
    const cmdName = getCommandName(body);
    const arg = getCommandArgument(body, cmdName);
    const groupMembers = getGroupMembers(gcMeta);
    const groupAdmins = getGroupAdmins(groupMembers);

    const react = async (emoji, m, nova) => {
      const getReact = {
        react: { text: emoji, key: m.key },
      };
      await nova.sendMessage(m.chat, getReact);
    };
    if (iscmd) {
      const command = nova.getCommand(cmdName);
      if (command) {
        command.carryOut(nova,m, { gcMeta, react, arg, args, cmdName, groupMembers, groupAdmins, isGroup });
      }
    }

    logM(m, isGroup, gcMeta, body);
  } catch (err) {
    console.error(chalk.red(err));
  }
};

const isValid = (m) => {
  return m.message && m.type !== 'notify' && m.key?.remoteJid !== 'status@broadcast';
};

const getArguments = (body) => {
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

exports.default = messagea;

