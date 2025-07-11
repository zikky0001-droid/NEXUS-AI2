const {zokou} = require("../framework/zokou");
const conf = require("../set")
const {jidDecode}=require("@whiskeysockets/baileys")

zokou({
  nomCom: "getpp",
  categorie: "Fun",
},
  async (dest, zk, commandeOptions) => {

    const { ms, arg, repondre, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = commandeOptions;
    let jid = null
    let nom = null;
    let mess;

    if (!msgRepondu) {
      jid = auteurMessage;
      nom = nomAuteurMessage;

      try { ppUrl = await zk.profilePictureUrl(jid, 'image'); } catch { ppUrl = conf.IMAGE_MENU };
      const status = await zk.fetchStatus(jid);

      mess = {
        image: { url: ppUrl },
        caption: '*Nom :* ' + nom + '\n*Status :*\n' + status.status,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363288304618280@newsletter',
            newsletterName: "NEXUS-AI",
            serverMessageId: 143,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: "PkDriller",
            sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }

    } else {
      jid = auteurMsgRepondu;
      nom = "@" + auteurMsgRepondu.split("@")[0];

      try { ppUrl = await zk.profilePictureUrl(jid, 'image'); } catch { ppUrl = conf.IMAGE_MENU };
      const status = await zk.fetchStatus(jid);

      mess = {
        image: { url: ppUrl },
        caption: '*Name :* ' + nom + '\n*Status :*\n' + status.status,
        mentions: [auteurMsgRepondu],
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363288304618280@newsletter',
            newsletterName: "NEXUS-AI",
            serverMessageId: 143,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: "PkDriller",
            sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x",
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }
    }

    zk.sendMessage(dest, mess, { quoted: ms })
  });
