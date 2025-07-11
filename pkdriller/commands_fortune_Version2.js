//GIVE CREDITS TO PKDRILLER 
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/fortune.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const fortunes = [
    "🌟 A beautiful, smart, and loving person will be coming into your life.",
    "🍀 A fresh start will put you on your way.",
    "✨ Your ability for accomplishment will follow with success.",
    "💼 You will soon be surrounded by good friends and laughter.",
    "🎯 Now is the time to try something new!"
];

// Fortune Cookie Command
zokou({ nomCom: "fortune", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🥠 Your fortune cookie says:\n\n${fortune}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 160
                },
                externalAdReply: {
                    title: "NEXUS-AI Fortune Cookie",
                    body: "Break your fortune daily!",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Fortune Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});
