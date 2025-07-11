//GIVE CREDITS TO PKDRILLER 
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/color.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const moods = [
    { color: "💙 Blue", meaning: "You’re calm, trustworthy, and cool as ice." },
    { color: "❤️ Red", meaning: "You're passionate, energetic, and full of love!" },
    { color: "💚 Green", meaning: "You’re balanced, harmonious, and always growing." },
    { color: "💛 Yellow", meaning: "You're joyful, creative, and a ray of sunshine." },
    { color: "🖤 Black", meaning: "You’re mysterious, strong, and sophisticated." },
    { color: "💜 Purple", meaning: "You’re unique, imaginative, and a bit magical." }
];

zokou({ nomCom: "moodcolor", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const mood = moods[Math.floor(Math.random() * moods.length)];

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🌈 Today's Mood Color:\n${mood.color}\n${mood.meaning}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 172
                },
                externalAdReply: {
                    title: "What's Your Mood Color?",
                    body: "NEXUS-AI sees your aura 🌈",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ MoodColor Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});
