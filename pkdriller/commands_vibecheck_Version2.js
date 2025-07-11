const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/vibe.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const vibes = [
    "🌞 The vibe is immaculate! Keep shining.",
    "🔥 You're on fire today. Spread the energy!",
    "🌧️ A bit cloudy—send some love to yourself.",
    "🌈 Positive energy detected! Share it around.",
    "🍃 Calm and collected, like a gentle breeze."
];

// Vibe Check Command
zokou({ nomCom: "vibecheck", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const vibe = vibes[Math.floor(Math.random() * vibes.length)];

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🔮 Vibe Check:\n\n${vibe}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 161
                },
                externalAdReply: {
                    title: "NEXUS-AI Vibe Check",
                    body: "What's the vibe today?",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ Vibecheck Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});