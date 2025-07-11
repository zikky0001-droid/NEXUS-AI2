const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require("../set");

moment.tz.setDefault(conf.TZ);

function getTimeAndDate() {
  const now = moment();
  return {
    time: now.format("HH:mm:ss"),
    date: now.format("YYYY-MM-DD"),
    full: now.format("dddd, MMMM Do YYYY, h:mm:ss A")
  };
}

const AUDIO_URL = "https://files.catbox.moe/6zqdrk.mp3";

zokou(
  {
    nomCom: "checkcountry",
    categorie: "🌐INFO🌐"
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg } = commandeOptions;

    if (!arg || arg.length < 1) {
      await zk.sendMessage(dest, {
        text: "🌍 *Usage:* `.checkcountry <country name or ISO code>`\nExample: `.checkcountry Kenya`",
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363288304618280@newsletter",
            serverMessageId: "",
            newsletterName: "Nexus"
          },
          externalAdReply: {
            title: "🌍 Country Info Checker",
            body: "Get real-time country details",
            thumbnailUrl: "https://flagcdn.com/w320/ke.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: "https://restcountries.com/"
          }
        }
      }, { quoted: ms });
      return;
    }

    try {
      const country = arg.join(" ");
      const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`);
      const data = response.data[0];

      const msg = `🌍 *Country Info - ${data.name.common}*\n\n` +
        `🏴 Official Name: ${data.name.official}\n` +
        `🌐 Region: ${data.region}\n` +
        `📍 Subregion: ${data.subregion}\n` +
        `🏛 Capital: ${data.capital?.[0] || "N/A"}\n` +
        `👥 Population: ${data.population.toLocaleString()}\n` +
        `💰 Currency: ${Object.values(data.currencies)[0].name} (${Object.keys(data.currencies)[0]})\n` +
        `🗣 Languages: ${Object.values(data.languages).join(", ")}\n` +
        `🧭 Timezones: ${data.timezones.join(", ")}\n` +
        `🌐 Country Code: ${data.cca2} | ${data.cca3}\n` +
        `📦 Area: ${data.area} km²\n\n` +
        `🕒 Checked at: ${getTimeAndDate().full}`;

      await zk.sendMessage(dest, {
        audio: { url: AUDIO_URL },
        mimetype: 'audio/mp4',
        ptt: true,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363025736123456@newsletter",
            serverMessageId: "",
            newsletterName: "Zokou Bot"
          },
          externalAdReply: {
            title: `${data.name.common}`,
            body: "Country Info Checker by Zokou",
            thumbnailUrl: data.flags?.png || "https://flagcdn.com/w320/un.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.name.common)}`
          }
        }
      }, { quoted: ms });

      await zk.sendMessage(dest, {
        text: msg,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363025736123456@newsletter",
            serverMessageId: "",
            newsletterName: "Zokou Bot"
          },
          externalAdReply: {
            title: `${data.name.common}`,
            body: "Country Info Checker by Zokou",
            thumbnailUrl: data.flags?.png || "https://flagcdn.com/w320/un.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.name.common)}`
          }
        }
      }, { quoted: ms });

    } catch (err) {
      await zk.sendMessage(dest, {
        text: "❌ *Country not found or API error.*\nPlease try again with a valid name or ISO code.",
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363025736123456@newsletter",
            serverMessageId: "",
            newsletterName: "Zokou Bot"
          },
          externalAdReply: {
            title: "Country Lookup Failed",
            body: "Try again with a different name or code",
            thumbnailUrl: "https://flagcdn.com/w320/un.png",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: "https://restcountries.com/"
          }
        }
      }, { quoted: ms });
    }
  }
);
