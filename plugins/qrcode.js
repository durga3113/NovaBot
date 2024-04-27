const QRCode = require('qrcode');

exports.default = {
  name: 'qrcode',
  category: 'misc',
  carryOut: async (nova, m, { react, match }) => {
    if (!match) {
      await react('❌');
      await nova.sendMessage(m.chat, { text: 'Please name something e.g., qrcode telegram bot/google' });
      return;
    }

    const qrOptions = {
      width: 300,  
      margin: 1,   
      color: {
        dark: "#000000",  
        light: "#FFFFFF"  
      }
    };

    try {
      const qrImageBuffer = await QRCode.toBuffer(match, qrOptions);
      await nova.sendMessage(m.chat, { image: qrImageBuffer, caption: '*_Here is your QR Code_*' });

      setTimeout(async () => {
        const newQr = await QRCode.toBuffer(match, qrOptions);
        await nova.sendMessage(m.chat, { image: newQr, caption: '_Your previous QR Code has timed out, please use this new one_' });
      }, 480000);
    } catch (error) {
      console.error('*_Error_*:', error);
      await react('⚠️');
      await nova.sendMessage(m.chat, { text: '*_Failed to generate QR code_*' });
    }
  }
};
        
