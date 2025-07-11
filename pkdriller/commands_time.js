const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/time.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";
moment.tz.setDefault(`${conf.TZ}`);

zokou({ nomCom: "time", categorie: "Utility" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const now = moment();
    const time = now.format('HH:mm:ss');
    const date = now.format('dddd, MMMM Do YYYY');
    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `⏰ Current Time: ${time}\n📅 Date: ${date}\n🕰️ (${conf.TZ} timezone)`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 180
                },
                externalAdReply: {
                    title: "NEXUS-AI Time Service",
                    body: "Get the accurate time anytime.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Time Command Error: " + e);
        if (typeof repondre === "function") repondre("❌ Error: " + e);
    }
});