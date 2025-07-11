const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");
const gtts = require('gtts'); // Ensure 'gtts' is installed

const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

zokou({ nomCom: "tts", categorie: "Utility" }, async (dest, zk, commandeOptions) => {
    let { ms, arg } = commandeOptions;
    if (!arg) {
        return await zk.sendMessage(dest, { text: "Please provide the text to convert to voice.\nExample: .tts Hello world" }, { quoted: ms });
    }
    try {
        let gttsInstance = new gtts(arg, 'en');
        let filepath = "/tmp/ttsoutput.mp3";
        await new Promise((resolve, reject) => gttsInstance.save(filepath, err => err ? reject(err) : resolve()));
        await zk.sendMessage(dest, {
            audio: { url: filepath },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `🔊 Your text as voice:\n"${arg}"`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 182
                },
                externalAdReply: {
                    title: "Text to Voice by NEXUS-AI",
                    body: "Convert any text to audio.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ TTS Command Error: " + e);
        if (typeof repondre === "function") repondre("❌ Error: " + e);
    }
});