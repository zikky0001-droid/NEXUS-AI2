const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/love.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

// Compatibility Command
zokou({ nomCom: "compat", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms, arg } = commandeOptions;
    let [name1, name2] = (arg || "You & Someone").split('&').map(s => s.trim());
    if (!name2) name2 = "Someone Special";
    const percent = Math.floor(Math.random() * 101);
    let emoji = "💖";
    if (percent < 30) emoji = "💔";
    else if (percent < 70) emoji = "💛";

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🔗 Compatibility Test:\n${name1} + ${name2} = ${percent}% ${emoji}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 162
                },
                externalAdReply: {
                    title: "NEXUS-AI Compatibility Test",
                    body: "Type .compat You & Crush",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Compatibility Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});