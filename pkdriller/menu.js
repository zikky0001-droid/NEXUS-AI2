const { zokou } = require(__dirname + "/../framework/zokou");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
  nomCom: "menu",
  categorie: "Menu"
}, async (dest, zk, commandeOptions) => {
  const {
    ms,
    repondre,
    prefixe,
    nomAuteurMessage,
    mybotpic
  } = commandeOptions;

  const { cm } = require(__dirname + "/../framework/zokou");

  let commandsByCategory = {};
  let botMode = s.MODE.toLowerCase() === "yes" ? "public" : "private";

  cm.map(cmd => {
    if (!commandsByCategory[cmd.categorie]) {
      commandsByCategory[cmd.categorie] = [];
    }
    commandsByCategory[cmd.categorie].push(cmd.nomCom);
  });

  moment.tz.setDefault("Etc/GMT");
  const date = moment().format("DD/MM/YYYY");

  let header = `
╭━━✧★☞  𝐍𝐄𝐗𝐔𝐒-𝐀𝐈  😾💜✧━━❖
┊✺┌────••••────⊷
┃★│◎ Owner : ${s.OWNER_NAME}
┃★│◎ Prefix : [ ${s.PREFIXE} ]
┃★│◎ Mode : ${botMode}
┃★│◎ Ram : 8/132 GB
┃★│◎ Date : ${date}
┃★│◎ Platform : ${os.platform()}
┃★│◎ Creator : PK Driller
┃★│◎ Commands : ${cm.length}
┃★│◎ Theme : NEXUS-AI
┊   └────••••────⊷
╰━━━••✧NEXUS-AI✧••━━━◆\n`;

  let menuText = "𝐍𝐄𝐗𝐔𝐒 𝐀𝐈 𝐌𝐄𝐍𝐔";

  for (const category in commandsByCategory) {
    menuText += `\n╭━━━❂ *${category}* ❂━━─••\n║╭━━══••══━━••⊷`;
    for (const command of commandsByCategory[category]) {
      menuText += `\n║┊❍ ${s.PREFIXE} *${command}*`;
    }
    menuText += `\n║╰━━══••══━━••⊷\n╰════────════◆◆◆`;
  }

  menuText += `\n\n🌐 *Website:* https://nexusai.tech\n> @NEXUS AI`;

  try {
    await zk.sendMessage(dest, {
      text: header + menuText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI 🔥",
          serverMessageId: 999
        },
        externalAdReply: {
          title: "NEXUS-AI WHATSAPP BOT",
          body: "Powerful AI Commands by PK-DRILLER",
          mediaType: 2,
          thumbnailUrl: "https://files.catbox.moe/q99uu1.jpg",
          mediaUrl: "https://nexusai.tech",
          renderLargerThumbnail: true,
          sourceUrl: "https://nexusai.tech",
          media: {
            url: "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/video/nexusmenu.mp4"
          }
        }
      }
    }, {
      quoted: {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast"
        },
        message: {
          contactMessage: {
            displayName: "NEXUS Verified ✓",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS Verified ✓\nTEL;type=CELL:+254700000000\nEND:VCARD"
          }
        }
      }
    });
  } catch (e) {
    console.error("Menu error: ", e);
    repondre("❌ Menu error: " + e.message);
  }
});
    
