const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const AUDIO_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/music/nexus.mp3";
const THUMBNAIL_URL = "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/nexus-ai.jpeg";

moment.tz.setDefault(`${conf.TZ}`);

const getTimeAndDate = () => {
    return {
        time: moment().format('HH:mm:ss'),
        date: moment().format('DD/MM/YYYY')
    };
};

zokou({ nomCom: "netstatus", categorie: "Tools" }, async (dest, zk, commandeOptions) => {
    let { ms } = commandeOptions;
    const { time, date } = getTimeAndDate();

    const uptime = os.uptime();
    const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
    const platform = os.platform();
    const cpuModel = os.cpus()[0].model;

    try {
        await zk.sendMessage(dest, {
            text: `🧠 *System Status*\n\n🖥️ *CPU:* ${cpuModel}\n💽 *Memory:* ${freeMem}GB / ${totalMem}GB\n🕹️ *Platform:* ${platform}\n⏱️ *Uptime:* ${Math.floor(uptime / 60)} mins\n📆 *Date:* ${date}\n⏰ *Time:* ${time}`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: 'NEXUS-AI',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: "Device Info Dashboard",
                    body: "Live system monitor from NEXUS-AI",
                    thumbnailUrl: THUMBNAIL_URL,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: conf.GURL
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: ms });

    } catch (e) {
        console.log("❌ Netstatus Command Error: " + e);
        await zk.sendMessage(dest, { text: "❌ Error in netstatus command." }, { quoted: ms });
    }
});
