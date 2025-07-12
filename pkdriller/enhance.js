const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const os = require('os');
const moment = require('moment-timezone');
const { zokou } = require(__dirname + '/../framework/zokou');
const conf = require(__dirname + '/../set');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

moment.tz.setDefault(conf.TZ);
const AUDIO_URL = 'https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3';

zokou({
  nomCom: 'enhancepic',
  categorie: 'tools'
}, async (dest, zk, { ms }) => {
  if (!ms.quoted || !ms.quoted.imageMessage) {
    return zk.sendMessage(dest, {
      text: `📸 *Tuma picha na tumia:* .enhancepic\n\nNitakurudishia toleo lililo boreshwa.`,
      contextInfo: getContext()
    }, { quoted: ms });
  }

  const buff = await downloadMediaMessage(ms.quoted, 'buffer', {}, { reuploadRequest: zk });
  const imgPath = './tmp_input.jpg';
  const outPath = './tmp_output.png';
  await fs.writeFile(imgPath, buff);

  // Upload image to Hugging Face inference API
  const response = await axios({
    method: 'post',
    url: 'https://api-inference.huggingface.co/models/CompVis/real-esrgan',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/octet-stream'
    },
    data: fs.readFileSync(imgPath),
    responseType: 'arraybuffer'
  }).catch(e => null);

  if (!response || response.status !== 200) {
    await zk.sendMessage(dest, {
      text: `❌ *Imeshindikana kuboresha picha.*\nJaribu tena baadae.`,
      contextInfo: getContext()
    }, { quoted: ms });
    return;
  }

  await fs.writeFile(outPath, response.data);

  await zk.sendMessage(dest, {
    image: fs.readFileSync(outPath),
    caption: `✅ *Picha imeboreshwa kwa ufanisi!*`,
    contextInfo: getContext()
  }, { quoted: ms });

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });

  await fs.unlink(imgPath).catch(() => {});
  await fs.unlink(outPath).catch(() => {});
});

function getContext() {
  return {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: 'Image Enhancer',
      mediaUrl: conf.URL,
      sourceUrl: conf.GURL,
      thumbnailUrl: conf.LOGO
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363025983927370@newsletter',
      newsletterName: "Nexus XMD",
      serverMessageId: "15"
    }
  };
  }
  
