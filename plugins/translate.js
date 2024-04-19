const { translate } = require('@vitalets/google-translate-api');

exports.default = {
  name: 'translate',
  alias: ['tr', 'trt'],
  category: 'misc',
  carryOut: async (nova, m, { react, args }) => {

    if (!args) {
      await react('❌');
      return m.reply('Example: tr en Hello, how are you?');
    }

    try {
      const [lang, ...textArray] = args.split(' ', 2);
      const text = textArray.length > 0 ? textArray.join(' ') : '';

      await react('🔄');
      const translation = await translate(text, { to: lang });
      const Message = `*Original*: ${text}\n*Translated*: ${translation.text}`;
      await m.reply(Message);
    } catch (error) {
      
      const err = error.code ? 'An error occurred while translating' : 'The language is not supported';
      await m.reply(err);
    }
  }
};
  
