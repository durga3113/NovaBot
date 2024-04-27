const { createCanvas, loadImage } = require('canvas');
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
      const qrImage = await QRCode.toCanvas(match, qrOptions);

      const canvas = createCanvas(qrImage.width, qrImage.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(qrImage, 0, 0);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#000000';  
      ctx.textAlign = 'center';
      ctx.fillText('NovaBot', qrImage.width / 2, qrImage.height / 2);

      const qrImageBuffer = canvas.toBuffer();

      await nova.sendMessage(m.chat, { image: qrImageBuffer, caption: '*_Here is your QR Code_*' });

      setTimeout(async () => {
        await nova.sendMessage(m.chat, { text: 'Your previous QR Code has timed out, please use this new one' });
      }, 480000);  

    } catch (error) {
      console.error('*_Error_*:', error);
      await react('⚠️');
      await nova.sendMessage(m.chat, { text: '*_Failed to generate QR code_*' });
    }
  }
};
          
