const { zokou } = require("../framework/zokou");
const conf = require("../set");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require('moment-timezone');
moment.tz.setDefault(conf.TZ);

zokou({
  nomCom: "tagadmin",
  categorie: 'Group',
  reaction: "📣"
}, async (dest, zk, commandeOptions) => {

  const {
    ms,
    repondre,
    arg,
    verifGroupe,
    nomGroupe,
    infosGroupe,
    nomAuteurMessage,
    verifAdmin,
    superUser
  } = commandeOptions;

  if (!verifGroupe) return repondre("📛 This command is only for *groups*.");
  if (!verifAdmin && !superUser) return repondre("🛡️ Only *admins* can use this command.");

  const mess = arg && arg.length > 0 ? arg.join(' ') : "No message specified.";
  const adminsGroupe = infosGroupe.participants.filter(p => p.admin);

  if (!adminsGroupe.length) return repondre("❌ No admins found.");

  const emojis = ['👑', '🦾', '🧠', '🧿', '📡', '🔰', '⚔️'];
  const tagMsg = `
🏷️ *Group:* ${nomGroupe}
🙋 *Sender:* ${nomAuteurMessage}
💬 *Message:* ${mess}

${adminsGroupe.map((a, i) => `${emojis[i % emojis.length]} @${a.id.split('@')[0]}`).join('\n')}
`.trim();

  // Load thumbnail image from URL or local
  const thumb = await axios.get(conf.LOGO, { responseType: "arraybuffer" }).then(res => res.data).catch(() => null);

  // Create fake contact message with blue tick
  const fakeContact = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      contactMessage: {
        displayName: "NEXUS-XMD ✅",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS-XMD\nORG:NEXUS OFFICIAL;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
      }
    }
  };

  // Send the admin tag message
  await zk.sendMessage(dest, {
    text: tagMsg,
    mentions: adminsGroupe.map(i => i.id),
    contextInfo: {
      mentionedJid: adminsGroupe.map(i => i.id),
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: "NEXUS-AI • Admin Alert",
        body: moment().format("dddd, MMMM Do YYYY"),
        mediaType: 1,
        sourceUrl: conf.GROUP_LINK || "https://chat.whatsapp.com/",
        showAdAttribution: true,
        renderLargerThumbnail: true,
        jpegThumbnail: thumb
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363288304618280@newsletter',
        newsletterName: 'NEXUS TECH',
        serverMessageId: '777'
      }
    }
  }, { quoted: fakeContact });

});
