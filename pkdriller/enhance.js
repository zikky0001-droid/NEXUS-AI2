const axios = require("axios");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

zokou({
  nomCom: "enhancepic",
  categorie: "tools"
}, async (dest, zk, { ms, arg }) => {
  const imageUrl = arg[0];

  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    return zk.sendMessage(dest, {
      text: `🖼️ *Usage:* .enhancepic <image_url>\n\nExample:\n.enhancepic https://example.com/image.jpg`,
      contextInfo: getContext()
    }, { quoted: ms });
  }

  try {
    const imgPath = "./temp_input.jpg";
    const outputPath = "./temp_output.png";

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await fs.writeFile(imgPath, response.data);

    const enhanceRes = await axios({
      method: "post",
      url: "https://api-inference.huggingface.co/models/CompVis/real-esrgan",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/octet-stream"
      },
      data: fs.readFileSync(imgPath),
      responseType: "arraybuffer"
    }).catch(() => null);

    if (!enhanceRes || enhanceRes.status !== 200) {
      return zk.sendMessage(dest, {
        text: "❌ Failed to enhance image. Try a different URL or image.",
        contextInfo: getContext()
      }, { quoted: ms });
    }

    await fs.writeFile(outputPath, enhanceRes.data);

    await zk.sendMessage(dest, {
      image: fs.readFileSync(outputPath),
      caption: "✅ Image successfully enhanced!",
      contextInfo: getContext()
    }, { quoted: ms });

    await fs.unlink(imgPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});
  } catch (err) {
    await zk.sendMessage(dest, {
      text: "⚠️ Could not process the image URL. Ensure it's valid and publicly accessible.",
      contextInfo: getContext()
    }, { quoted: ms });
  }
});

function getContext() {
  return {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "Image Enhancer",
      mediaUrl: conf.URL,
      sourceUrl: conf.GURL,
      thumbnailUrl: conf.LOGO
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363288304618280@newsletter",
      newsletterName: "Nexus AI",
      serverMessageId: "15"
    }
  };
          }
        
