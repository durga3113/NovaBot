const { serialize, decodeJid } = require('./client.js');
const chalk = require('chalk');

const messagea = async (messages, nova) => {
  try {
    const m = serialize(JSON.parse(JSON.stringify(messages.messages[0])), nova);
    if (!isValidMessage(m)) return;

    const { isGroup, sender, from, body } = m;
    const gcMeta = isGroup ? await nova.groupMetadata(from) : '';
    const args = getArguments(body);
    const isCmd = isCommand(body);
    const cmdName = getCommandName(body);
    const arg = getCommandArgument(body, cmdName);
    const groupMembers = getGroupMembers(gcMeta);
    const groupAdmins = getGroupAdmins(groupMembers);
    const banned = getBannedUsers();

    if (iscmd) {
      const command = getCommand(cmdName);
      if (command) {
        command.execute(nova, arg, { gcMeta, isGroup });
      }
    }

    logMessage(m, isGroup, gcMeta, body);
  } catch (err) {
    console.error(chalk.red(err));
  }
};

const isValidMessage = (m) => {
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

  const logM = (m, isGroup, groupMeta, body) => {
  const chatType = isGroup ? 'GROUP' : 'PRIVATE CHAT';
  const Names = isGroup ? groupMeta.subject : m.pushName;
  console.log(
    `\n[${chalk.bgWhite(chatType)}]   => ${chalk.green(Names)}\n` +
    `[SENDER]  => ${chalk.red(m.pushName)}\n` +
    `[MESSAGE] => ${chalk.red(body || m.type)}\n`
  );
};

exports.messagea = messagea;
