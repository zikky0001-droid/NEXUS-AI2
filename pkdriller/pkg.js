const { zokou } = require(__dirname + "/../framework/zokou");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
  nomCom: "menu2",
  categorie: "Menu"
}, async (_dest, zk, commandeOptions) => {
  let {
    ms,
    repondre,
    prefixe,
    nomAuteurMessage,
    mybotpic
  } = commandeOptions;

  let { cm } = require(__dirname + "/../framework/zokou");
  let grouped = {};
  let mode = "public";
  if (s.MODE.toLowerCase() !== "yes") mode = "private";

  cm.map(cmd => {
    if (!grouped[cmd.categorie]) grouped[cmd.categorie] = [];
    grouped[cmd.categorie].push(cmd.nomCom);
  });

  moment.tz.setDefault("Etc/GMT");
  const date = moment().format("DD/MM/YYYY");

  let head =
    "\n╭━━✧★☞  𝐍𝐄𝐗𝐔𝐒-𝐀𝐈  😾💜✧━━❖\n┊✺┌────••••────⊷\n" +
    "┃★│◎ Owner : " + s.OWNER_NAME + "\n" +
    "┃★│◎ Prefix : [ " + s.PREFIXE + " ]\n" +
    "┃★│◎ Mode : " + mode + "\n" +
    "┃★│◎ Ram : 8/132 GB\n" +
    "┃★│◎ Date : " + date + "\n" +
    "┃★│◎ Platform : " + os.platform() + "\n" +
    "┃★│◎ Creator : PK Driller\n" +
    "┃★│◎ Commands : " + cm.length + "\n" +
    "┃★│◎ Theme : NEXUS-AI\n" +
    "┊   └────••••────⊷\n╰━━━••✧NEXUS-AI✧••━━━◆\n";

  let body = "𝐍𝐄𝐗𝐔𝐒 𝐀𝐈 𝐌𝐄𝐍𝐔";
  for (const cat in grouped) {
    body += `\n╭━━━❂ *${cat}* ❂━━─••\n║╭━━══••══━━••⊷ `;
    for (const name of grouped[cat]) {
      body += `\n║┊❍ ${s.PREFIXE}  *${name}*`;
    }
    body += `\n║╰━━══••══━━••⊷\n╰════────════◆◆◆`;
  }

  body = body + "\n" + body; // doubling size (your style)
  body += "\n\n> @NEXUS AI\n🌐 *Website:* https://example.com"; // your website link

  try {
    await zk.sendMessage(_dest, {
      video: { url: "https://telegra.ph/file/4e4b1ad0fd57a5b9fefeb.mp4" }, // your menu video
      caption: head + body,
      mimetype: "video/mp4",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 0x8f
        },
        externalAdReply: {
          title: "🎬 NEXUS-AI VIDEO MENU",
          body: "Tap to visit the Nexus AI official website",
          mediaType: 2,
          mediaUrl: "https://example.com",
          sourceUrl: "https://example.com",
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    });

    await zk.sendMessage(_dest, {
      audio: {
        url: "https://github.com/nexustech1911/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3"
      },
      mimetype: 'audio/mp4',
      ptt: false,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 0x8f
        },
        externalAdReply: {
          title: "🎧 Nexus Intro Sound",
          body: "Playing audio",
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: "https://example.com"
        }
      }
    });

  } catch (err) {
    console.error("Menu error: ", err);
    repondre("Menu error: " + err);
  }
});
