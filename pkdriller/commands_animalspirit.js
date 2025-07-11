const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/spirit.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const animals = [
    "🦁 Lion — Courageous and a born leader.",
    "🦉 Owl — Wise and intuitive.",
    "🐬 Dolphin — Playful, smart, and a friend to all.",
    "🦋 Butterfly — Always transforming and growing.",
    "🐼 Panda — Calm, peaceful, and loved by everyone.",
    "🐲 Dragon — Mysterious and powerful spirit!"
];

zokou({ nomCom: "animalspirit", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const animal = animals[Math.floor(Math.random() * animals.length)];

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `✨ Your Animal Spirit:\n\n${animal}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 170
                },
                externalAdReply: {
                    title: "Discover Your Spirit Animal!",
                    body: "NEXUS-AI makes it wild 🐾",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ AnimalSpirit Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});