const util = require("util");
const fs = require("fs-extra");
const axios = require("axios");
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

zokou({ nomCom: "skan", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, media } = commandeOptions;

  if (!media || !media.mimetype.includes("image")) {
    return repondre("🖼️ *Send or reply to an image to scan its text.*");
  }

  try {
    const buffer = await media.download();
    const base64 = buffer.toString("base64");

    const { data } = await axios.post("https://api.ocr.space/parse/image", null, {
      params: {
        apikey: "helloworld", // Use demo key or get one from ocr.space
        base64Image: `data:${media.mimetype};base64,${base64}`
      }
    });

    const text = data?.ParsedResults?.[0]?.ParsedText || "❌ No text found.";

    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      ptt: true,
      mimetype: "audio/mp4",
      text: `📄 *Scanned Text:*\n\n${text}`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "NEXUS-AI",
          serverMessageId: 170
        },
        externalAdReply: {
          title: "Image Scanner 🔍",
          body: "Extract text via OCR",
          thumbnailUrl: THUMBNAIL_URL,
          sourceUrl: conf.GURL,
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Scan Error: " + e);
    repondre("❌ Failed to scan image.");
  }
});
