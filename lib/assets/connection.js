const { proto, getContentType, jidDecode, downloadContentFromMessage } = require('baileys');
const FileType = require('file-type');
const fs = require('fs');

const decodeJid = (jid) => {
  const { user, server } = jidDecode(jid) || {};
  return user && server ? `${user}@${server}`.trim() : jid;
};

const downloadAndSaveMediaMessage = async (
  message,
  filename,
  attachExtension = true
) => {
  let quoted = message.msg ? message.msg : message;
  let mime = (message.msg || message).mimetype || "";
  let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
  const stream = await downloadContentFromMessage(quoted, messageType);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  let type = await FileType.fromBuffer(buffer);
  trueFileName = attachExtension ? filename + "." + type.ext : filename;
  await fs.writeFileSync(trueFileName, buffer);
  return trueFileName;
};

const downloadMedia = async (message) => {
  let type = Object.keys(message)[0];
  let m = message[type];
  if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
    if (type === 'viewOnceMessageV2') {
      m = message.viewOnceMessageV2?.message;
      type = Object.keys(m || {})[0];
    } else {
      type = Object.keys(m || {})[1];
    }
    m = m[type];
  }
  const stream = await downloadContentFromMessage(m, type.replace('Message', ''));
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
};

function serialize(m, nova) {
  if (m.key) {
    m.id = m.key.id;
    m.isSelf = m.key.fromMe;
    m.chat = decodeJid(m.key.remoteJid);
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = m.isGroup ? decodeJid(m.key.participant) : m.isSelf ? decodeJid(nova.user.id) : m.chat;
  }
  if (m.message) {
    m.type = getContentType(m.message);
    if (m.type === 'ephemeralMessage') {
      m.message = m.message[m.type].message;
      const tipe = Object.keys(m.message)[0];
      m.type = tipe;
      if (tipe === 'viewOnceMessageV2') {
        m.message = m.message[m.type].message;
        m.type = getContentType(m.message);
      }
    }
    if (m.type === 'viewOnceMessageV2') {
      m.message = m.message[m.type].message;
      m.type = getContentType(m.message);
    }
    m.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type);
    try {
      const quoted = m.message[m.type]?.contextInfo;
      if (quoted.quotedMessage['ephemeralMessage']) {
        const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0];
        if (tipe === 'viewOnceMessageV2') {
          m.quoted = {
            type: 'view_once',
            stanzaId: quoted.stanzaId,
            participant: decodeJid(quoted.participant),
            message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
          };
        } else {
          m.quoted = {
            type: 'ephemeral',
            stanzaId: quoted.stanzaId,
            participant: decodeJid(quoted.participant),
            message: quoted.quotedMessage.ephemeralMessage.message
          };
        }
      } else if (quoted.quotedMessage['viewOnceMessageV2']) {
        m.quoted = {
          type: 'view_once',
          stanzaId: quoted.stanzaId,
          participant: decodeJid(quoted.participant),
          message: quoted.quotedMessage.viewOnceMessage.message
        };
      } else {
        m.quoted = {
          type: 'normal',
          stanzaId: quoted.stanzaId,
          participant: decodeJid(quoted.participant),
          message: quoted.quotedMessage
        };
      }
      m.quoted.isSelf = m.quoted.participant === decodeJid(nova.user.id);
      m.quoted.mtype = Object.keys(m.quoted.message).filter((v) => v.includes('Message') || v.includes('conversation'))[0];
      m.quoted.text = m.quoted.message[m.quoted.mtype]?.text ||
        m.quoted.message[m.quoted.mtype]?.description ||
        m.quoted.message[m.quoted.mtype]?.caption ||
        m.quoted.message[m.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
        m.quoted.message[m.quoted.mtype] ||
        '';
      m.quoted.key = {
        id: m.quoted.stanzaId,
        fromMe: m.quoted.isSelf,
        remoteJid: m.chat
      };
      m.quoted.download = () => downloadMedia(m.quoted.message);
    } catch {
      m.quoted = null;
    }
    m.body = m.message?.conversation ||
      m.message?.[m.type]?.text ||
      m.message?.[m.type]?.caption ||
      (m.type === 'listResponseMessage' && m.message?.[m.type]?.singleSelectReply?.selectedRowId) ||
      (m.type === 'buttonsResponseMessage' && m.message?.[m.type]?.selectedButtonId) ||
      (m.type === 'templateButtonReplyMessage' && m.message?.[m.type]?.selectedId) ||
      '';
    m.reply = (text) => nova.sendMessage(m.chat, { text }, { quoted: m });
    m.mentions = [];
    if (m.quoted?.participant) m.mentions.push(m.quoted.participant);
    const array = m?.message?.[m.type]?.contextInfo?.mentionedJid || [];
    m.mentions.push(...array.filter(Boolean));
    m.download = () => downloadMedia(m.message);
  }
  return m;
}

module.exports = {
  serialize,
  decodeJid
};
