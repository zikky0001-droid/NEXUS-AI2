const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/art.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const arts = [
    "🌸🌸🌺🌸🌸\n🌸🌺🌸🌺🌸\n🌸🌸🌺🌸🌸\n🌸🌺🌸🌺🌸\n🌸🌸🌺🌸🌸",
    "🍕🍕🍕\n🍕🍔🍕\n🍕🍕🍕",
    "🦄✨🦄\n✨🦄✨\n🦄✨🦄",
    "🎮👾🎮\n👾🎮👾\n🎮👾🎮",
    "❤️💛💚💙💜"
];

zokou({ nomCom: "emojiart", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const art = arts[Math.floor(Math.random() * arts.length)];

    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🎨 Random Emoji Art:\n\n${art}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 171
                },
                externalAdReply: {
                    title: "Emoji Art by NEXUS-AI",
                    body: "Send .emojiart for more!",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ EmojiArt Command Error: " + e);
        if (typeof repondre === "function") {
            repondre("❌ Error: " + e);
        }
    }
});