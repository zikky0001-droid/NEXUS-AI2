const axios = require("axios");
const moment = require("moment-timezone");
const { zokou } = require("../framework/zokou");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

function getTime() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("dddd, MMMM Do YYYY"),
  };
}

zokou(
  {
    nomCom: "repo",
    categorie: "Core",
  },
  async (dest, zk) => {
    try {
      const res = await axios.get("https://api.github.com/repos/pkdriller0/NEXUS-AI");
      const {
        stargazers_count,
        forks_count,
        watchers_count,
        open_issues_count,
        html_url,
        name,
        description,
        owner,
      } = res.data;

      const { time, date } = getTime();

      const fakeVerified = {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
        },
        message: {
          contactMessage: {
            displayName: "Nexus Verified",
            vcard: `BEGIN:VCARD
VERSION:3.0
N:Nexus;Verified;;;
FN:Nexus Verified
ORG:Nexus-AI Inc.
TEL;type=CELL;type=VOICE;waid=1234567890:+1 234 567 890
END:VCARD`,
          },
        },
      };

      await zk.sendMessage(
        dest,
        {
          text:
`🌐 *NEXUS-AI GitHub Repository*

📦 *Repo:* ${name}
📝 *Description:* ${description || "No description."}
👤 *Owner:* ${owner.login}

⭐ Stars: *${stargazers_count}*
🍴 Forks: *${forks_count}*
👀 Watchers: *${watchers_count}*
🐛 Open Issues: *${open_issues_count}*

🔗 *Repo URL:* ${html_url}

🕒 Time: *${time}*
📆 Date: *${date}*`,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363288304618280@newsletter",
              newsletterName: "Nexus System",
            },
            externalAdReply: {
              title: "Visit NEXUS-AI Repository",
              body: `Stars: ${stargazers_count} | Forks: ${forks_count}`,
              mediaType: 1,
              previewType: "PHOTO",
              renderLargerThumbnail: true,
              thumbnailUrl:
                "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/302cd7b646014ce2dd8469e25e304d87.jpg",
              sourceUrl: html_url,
            },
          },
        },
        { quoted: fakeVerified }
      );
    } catch (err) {
      console.error(err);
      await zk.sendMessage(dest, {
        text: "❌ Could not fetch repo data. Please try again later.",
      });
    }
  }
);
