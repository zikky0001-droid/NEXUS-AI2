const {
  zokou
} = require(__dirname + "/../framework/zokou");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
  'nomCom': "menu",
  'categorie': "Menu"
}, async (_0x466846, _0x35dd19, _0x42e541) => {
  let {
    ms: _0x2f945c,
    repondre: _0x35a713,
    prefixe: _0x5b6b66,
    nomAuteurMessage: _0x4099cb,
    mybotpic: _0x11905
  } = _0x42e541;
  let {
    cm: _0x3f91bc
  } = require(__dirname + "/../framework/zokou");
  let _0x4b68cd = {};
  let _0x2fb207 = "public";
  if (s.MODE.toLowerCase() !== "yes") {
    _0x2fb207 = "private";
  }
  _0x3f91bc.map(_0x5a12df => {
    if (!_0x4b68cd[_0x5a12df.categorie]) {
      _0x4b68cd[_0x5a12df.categorie] = [];
    }
    _0x4b68cd[_0x5a12df.categorie].push(_0x5a12df.nomCom);
  });
  moment.tz.setDefault("Etc/GMT");
  const _0x30b447 = moment().format("DD/MM/YYYY");
  let _0x5810f6 = "\n╭━━✧★☞  𝐍𝐄𝐗𝐔𝐒-𝐀𝐈  😾💜✧━━❖\n┊✺┌────••••────⊷\n┃★│◎ Owner : " + s.OWNER_NAME + "\n┃★│◎ Prefix : [ " + s.PREFIXE + " ]\n┃★│◎ Mode : " + _0x2fb207 + "\n┃★│◎ Ram : 8/132 GB\n┃★│◎ Date : " + _0x30b447 + "\n┃★│◎ Platform : " + os.platform() + "\n┃★│◎ Creator : PK Driller\n┃★│◎ Commands : " + _0x3f91bc.length + "\n┃★│◎ Theme : NEXUS-AI\n┊   └────••••────⊷\n╰━━━••✧NEXUS-AI✧••━━━◆\n";
  let _0x499730 = "𝐍𝐄𝐗𝐔𝐒 𝐀𝐈 𝐌𝐄𝐍𝐔";
  for (const _0x297db1 in _0x4b68cd) {
    _0x499730 += "\n╭━━━❂ *" + _0x297db1 + "* ❂━━─••\n║╭━━══••══━━••⊷ ";
    for (const _0x38505c of _0x4b68cd[_0x297db1]) {
      _0x499730 += "          \n║┊❍ " + s.PREFIXE + "  *" + _0x38505c + '*';
    }
    _0x499730 += "\n║╰━━══••══━━••⊷\n╰════────════◆◆◆";
  }
  _0x499730 += "\n> @NEXUS AI\n";

  try {
    await _0x35dd19.sendMessage(_0x466846, {
      'text': _0x5810f6 + _0x499730,
      'contextInfo': {
        'forwardingScore': 0x3e7,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363288304618280@newsletter",
          'newsletterName': "NEXUS-AI",
          'serverMessageId': 0x8f
        },
        'externalAdReply': {
          'title': "NEXUS AI",
          'body': "Tap to join the official channel",
          'thumbnailUrl': "https://github.com/pkdriller0/NEXUS-XMD-DATA/raw/refs/heads/main/logo/302cd7b646014ce2dd8469e25e304d87.jpg",
          'mediaType': 0x1,
          'renderLargerThumbnail': true
        }
      }
    }, {
      quoted: {
        key: {
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast"
        },
        message: {
          contactMessage: {
            displayName: "NEXUS-DEV Verified ✓",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:NEXUS Verified ✓\nTEL;type=CELL:+254794146821\nEND:VCARD"
          }
        }
      }
    });

  } catch (_0x2fdc61) {
    console.error("Menu error: ", _0x2fdc61);
    _0x35a713("Menu error: " + _0x2fdc61);
  }
});
