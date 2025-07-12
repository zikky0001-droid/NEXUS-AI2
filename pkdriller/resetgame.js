const util = require('util');
const fs = require('fs-extra');
const os = require('os');
const axios = require('axios');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');
moment.tz.setDefault(conf.TZ);
const { zokou } = require(__dirname + '/../framework/zokou');

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";

// Same game reference used in ticatoe plugin
const { games } = require('./ticatoe'); // Ensure ticatoe.js exports `games` object

zokou({
  nomCom: 'resetgame',
  categorie: 'game'
}, async (dest, zk, { ms }) => {
  const sender = ms.sender;

  // Tafuta game inayomhusu huyu user
  const found = Object.keys(games).find(
    key => games[key].players.includes(sender)
  );

  if (!found) {
    return zk.sendMessage(dest, {
      text: `❌ *Hakuna game inayohusiana na wewe kwa sasa.*\n\n*Tumia:* .ticatoe @mtu kuanzisha game mpya.`,
      contextInfo: {
        forwardingScore: 777,
        isForwarded: true,
        externalAdReply: {
          title: 'No Active Game',
          mediaUrl: conf.URL,
          sourceUrl: conf.GURL,
          thumbnailUrl: conf.LOGO
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363025983927370@newsletter',
          newsletterName: "Nexus XMD",
          serverMessageId: "13"
        }
      }
    }, { quoted: ms });
  }

  // Futa hiyo game
  delete games[found];

  await zk.sendMessage(dest, {
    text: `♻️ *Game yako ya TicTacToe imefutwa.*\n\nTayari kuanzisha upya? Tumia *.ticatoe @mtu*`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: 'Game Reset!',
        mediaType: 2,
        mediaUrl: conf.URL,
        sourceUrl: conf.GURL,
        thumbnailUrl: conf.LOGO
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363025983927370@newsletter',
        newsletterName: "Nexus XMD",
        serverMessageId: "15"
      }
    }
  }, { quoted: ms });

  await zk.sendMessage(dest, {
    audio: { url: AUDIO_URL },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: ms });
});
        
