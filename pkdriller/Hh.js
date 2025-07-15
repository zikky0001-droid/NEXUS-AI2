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
    // 1️⃣ Send loader
    const init = await zk.sendMessage(
      dest,
      { text: "🔄 *Fetching pkdriller0/NEXUS‑AI stats...*" },
      {
        quoted: {
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
        },
      }
    );

    try {
      // 2️⃣ Fetch real-time GitHub data
      const repoUrl = "https://api.github.com/repos/pkdriller0/NEXUS-AI";
      const r = await axios.get(repoUrl);
      const {
        stargazers_count,
        forks_count,
        open_issues_count,
        watchers_count
      } = r.data;
      const { time, date } = getTime();

      // 3️⃣ Delete loading message
      await zk.sendMessage(dest, { delete: init.key });

      // 4️⃣ Send final formatted stats
      await zk.sendMessage(
        dest,
        {
          text:
`✅ *NEXUS‑AI Repo Stats*

⭐ Stars: *${stargazers_count}*
🍴 Forks: *${forks_count}*
👀 Watchers: *${watchers_count}*
🐛 Open issues: *${open_issues_count}*

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
              title: "NEXUS‑AI GitHub Repo",
              body: `Stars: ${stargazers_count} | Forks: ${forks_count}`,
              mediaType: 1,
              previewType: "PHOTO",
              renderLargerThumbnail: true,
              thumbnailUrl:
                "https://raw.githubusercontent.com/pkdriller0/NEXUS-AI/main/logo.png",
              sourceUrl: conf.URL || "https://github.com/pkdriller0/NEXUS-AI",
            },
          },
        },
        { quoted: init }
      );
    } catch (err) {
      console.error(err);
      await zk.sendMessage(dest, {
        text: "❌ Could not fetch repo data. Try again later.",
      });
    }
  }
);
