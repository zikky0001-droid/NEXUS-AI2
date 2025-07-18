const { zokou } = require("../framework/zokou");
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const conf = require("../set");
const fs = require("fs-extra");

const moment = require('moment-timezone');
moment.tz.setDefault(conf.TZ);

zokou(
  {
    nomCom: "tagadmin",
    categorie: 'Group',
    reaction: "📣"
  },
  async (dest, zk, commandeOptions) => {
    const {
      ms,
      repondre,
      arg,
      verifGroupe,
      nomGroupe,
      infosGroupe,
      nomAuteurMessage,
      verifAdmin,
      superUser,
      auteur
    } = commandeOptions;

    if (!verifGroupe) return repondre("📛 This command is only for *groups*.");
    if (!verifAdmin && !superUser) return repondre("🛡️ Only *admins* can use this command.");

    let mess = arg && arg !== ' ' ? arg.join(' ') : 'No message specified.';
    let adminsGroupe = infosGroupe.participants.filter(m => m.admin);

    if (!adminsGroupe.length) return repondre("❌ No admins found.");

    const emojis = ['👑', '🦾', '🧠', '🧿', '📡', '🔰', '⚔️'];
    const tagMessage = `
🏷️ *Group:* ${nomGroupe}
🙋 *Sender:* ${nomAuteurMessage}
💬 *Message:* ${mess}

${adminsGroupe.map((admin, i) => `${emojis[i % emojis.length]} @${admin.id.split("@")[0]}`).join('\n')}
`.trim();

    await zk.sendMessage(dest, {
      text: tagMessage,
      mentions: adminsGroupe.map(i => i.id),
      contextInfo: {
        mentionedJid: adminsGroupe.map(i => i.id),
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "NEXUS-AI • Admin Alert",
          body: moment().format("dddd, MMMM Do YYYY"),
          thumbnailUrl: conf.LOGO,
          sourceUrl: conf.GROUP_LINK || "https://chat.whatsapp.com/",
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363288304618280@newsletter',
          newsletterName: 'NEXUS TECH',
          serverMessageId: '777'
        },
        quotedMessage: {
          contactMessage: {
            displayName: "NEXUS-AI",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS-XMD\nORG:NEXUS OFFICIAL;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
          }
        }
      }
    }, { quoted: ms });
  }
);
