const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/story.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

const stories = {
    "😂": "Once upon a time, a chicken tried to cross the road. The punchline? Nobody knows, because she got distracted by a meme and ended up on TikTok. The end! 😂",
    "😍": "There was a kitten who fell in love with a puppy at first sight. Their friendship melted everyone's heart in the neighborhood. True love comes in all shapes and paws! 😍",
    "😱": "A ghost appeared at midnight... only to ask for the WiFi password. Even spirits need fast internet these days! 😱",
    "🤔": "A wise monkey once asked: 'If a banana falls in the forest and nobody is around, does it make a sound?' Food for thought. 🤔",
    "🥳": "It was the biggest party in the jungle. Elephants danced, monkeys DJed, and everyone had a wild time until sunrise. Best party ever! 🥳"
};

zokou({ nomCom: "story", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    let { ms, arg } = commandeOptions;
    const emoji = arg && stories[arg.trim()] ? arg.trim() : "😂";
    const story = stories[emoji];
    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            text: `Your story for ${emoji}:\n${story}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 185
                },
                externalAdReply: {
                    title: "Emoji Stories",
                    body: "Send .story 😂 or .story 😍 etc.",
                    thumbnailUrl: THUMBNAIL_URL,
                    sourceUrl: conf.GURL,
                    mediaType: 1
                }
            }
        }, { quoted: ms });
    } catch (e) {
        console.log("❌ EmojiStory Command Error: " + e);
        if (typeof repondre === "function") repondre("❌ Error: " + e);
    }
});