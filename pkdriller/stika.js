const axios = require('axios');

module.exports = {
  name: 'play9',
  description: 'Play and download music by song name or YouTube link.',
  usage: '.play <song name or YouTube link>',
  async execute(sock, m, args) {
    if (!args.length) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ Please provide a song name or YouTube URL.\nExample: .play Calm Down Rema' }, { quoted: m });
    }
    const query = args.join(' ');

    // Notify user
    await sock.sendMessage(m.key.remoteJid, { text: '⏳ Searching for your song...' }, { quoted: m });

    try {
      // Call your public API
      const res = await axios.get(`https://ochinpo-helper.hf.space/yt?query=${encodeURIComponent(query)}`);
      const data = res.data;

      if (!data.result || !data.result.download || !data.result.download.audio) {
        return sock.sendMessage(m.key.remoteJid, { text: "❌ Couldn't fetch audio. Try a different query." }, { quoted: m });
      }

      const audioUrl = data.result.download.audio;
      const title = data.result.title || "Unknown Title";

      // Send audio file
      await sock.sendMessage(
        m.key.remoteJid,
        {
          audio: { url: audioUrl },
          mimetype: 'audio/mp4',
          ptt: false,
          caption: `🎶 ${title}`
        },
        { quoted: m }
      );

    } catch (error) {
      console.error(error);
      return sock.sendMessage(m.key.remoteJid, { text: "❌ Error processing your request. Try again later." }, { quoted: m });
    }
  }
};
