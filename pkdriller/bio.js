const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + '/../framework/zokou');
const axios = require("axios");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);

function getTimeAndDate() {
  const date = moment().format("MMMM Do YYYY");
  const time = moment().format("h:mm:ss a");
  return `${date} • ${time}`;
}

zokou({
  nomCom: "copybio",
  categorie: "Tools"
}, async (dest, zk, commandeOptions) => {
  const { ms, mentionByTag, replyJid } = commandeOptions;

  const fakeContact = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      ...(ms.key.remoteJid ? { remoteJid: ms.key.remoteJid } : {})
    },
    message: {
      contactMessage: {
        displayName: "Bio Fetcher",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Zokou Lookup\nORG:Zokou Tools;\nTEL;type=CELL;type=VOICE;waid=254700555000:+254 700 555000\nEND:VCARD"
      }
    }
  };

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      showAdAttribution: true,
      title: "Bio Grabber Tool",
      body: getTimeAndDate(),
      mediaType: 1,
      renderLargerThumbnail: true,
      thumbnailUrl: conf.GURL,
      mediaUrl: conf.URL,
      sourceUrl: conf.URL
    }
  };

  let target = mentionByTag && mentionByTag[0] ? mentionByTag[0] : (replyJid || ms.key.participant || ms.key.remoteJid);

  if (!target) {
    return zk.sendMessage(dest, {
      text: "❌ Tag or reply to someone to get their bio.\nExample: `.copybio @user`",
      contextInfo
    }, { quoted: fakeContact });
  }

  try {
    const status = await zk.fetchStatus(target);

    if (!status || !status.status) {
      throw new Error("No bio found");
    }

    await zk.sendMessage(dest, {
      text: `🧾 *Bio of @${target.split("@")[0]}*\n\n_${status.status}_`,
      contextInfo: { ...contextInfo, mentionedJid: [target] }
    }, { quoted: fakeContact });

  } catch (err) {
    await zk.sendMessage(dest, {
      text: "❌ Could not fetch bio. User may have hidden their about/status.",
      contextInfo
    }, { quoted: fakeContact });
  }
});
    
