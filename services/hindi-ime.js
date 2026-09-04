/**
 * Hindi typing: phonetic (type "namaste" → नमस्ते) and Devanagari keyboard.
 * Offline, no API.
 */

const CONS = [
  ["ksh", "क्ष"], ["gya", "ज्ञ"], ["gy", "ज्ञ"], ["shr", "श्र"],
  ["chh", "छ"], ["kh", "ख"], ["gh", "घ"], ["ch", "च"], ["jh", "झ"],
  ["th", "थ"], ["dh", "ध"], ["ph", "फ"], ["bh", "भ"], ["sh", "श"],
  ["ng", "ङ"], ["ny", "ञ"],
  ["Th", "ठ"], ["Dh", "ढ"], ["Sh", "ष"],
  ["k", "क"], ["g", "ग"], ["c", "च"], ["j", "ज"],
  ["T", "ट"], ["D", "ड"], ["N", "ण"],
  ["t", "त"], ["d", "द"], ["n", "न"],
  ["p", "प"], ["b", "ब"], ["m", "म"],
  ["y", "य"], ["r", "र"], ["l", "ल"], ["v", "व"], ["w", "व"],
  ["s", "स"], ["h", "ह"], ["x", "क्ष"], ["q", "क़"], ["z", "ज़"], ["f", "फ़"]
];

const MATRA = {
  aa: "ा", ii: "ी", ee: "ी", uu: "ू", oo: "ू",
  ai: "ै", au: "ौ",
  a: "", i: "ि", u: "ु", e: "े", o: "ो"
};

const INDEP = {
  aa: "आ", ii: "ई", ee: "ई", uu: "ऊ", oo: "ऊ",
  ai: "ऐ", au: "औ",
  a: "अ", i: "इ", u: "उ", e: "ए", o: "ओ"
};

function matchLongest(s, i, table) {
  for (const [k, v] of table) {
    if (s.startsWith(k, i)) return [k, v];
  }
  return null;
}

function matchVow(s, i) {
  const keys = Object.keys(MATRA).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (s.startsWith(k, i)) return k;
  }
  return null;
}

const COMMON = {
  namaste: "नमस्ते", paani: "पानी", pani: "पानी", aap: "आप", aapka: "आपका",
  aapki: "आपकी", aapke: "आपके", kya: "क्या", hai: "है", hain: "हैं",
  main: "मैं", mein: "में", hun: "हूँ", hoon: "हूँ", mera: "मेरा", meri: "मेरी",
  mere: "मेरे", naam: "नाम", nam: "नाम", hindi: "हिंदी", kitab: "किताब",
  school: "स्कूल", paani: "पानी", maa: "माँ", baba: "बाबा", beta: "बेटा",
  beti: "बेटी", ghar: "घर", paani: "पानी", dhanyavaad: "धन्यवाद",
  kripya: "कृपया", kripa: "कृपा", namaskar: "नमस्कार", jal: "जल",
  ped: "पेड़", phool: "फूल", din: "दिन", raat: "रात", aaj: "आज",
  kal: "कल", accha: "अच्छा", achha: "अच्छा", bada: "बड़ा", chhota: "छोटा",
  ek: "एक", do: "दो", teen: "तीन", paani: "पानी", khana: "खाना",
  paani: "पानी", please: "कृपया", thankyou: "धन्यवाद", johar: "जोहार"
};

export function romanToHindi(input) {
  const raw = String(input || "");
  const key = raw.toLowerCase();
  if (COMMON[key]) return COMMON[key];
  const s = raw;
  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "M" || (ch === "n" && s[i + 1] === "g" && false)) {
      /* handled below */
    }
    if (/[\u0900-\u097f]/.test(ch)) { out += ch; i++; continue; }
    if (ch === "." && s[i + 1] === "n") { out += "ँ"; i += 2; continue; }
    if (ch === "M" || (ch === "n" && /[^a-zA-Z]/.test(s[i + 1] || ""))) {
      out += "ं"; i++; continue;
    }
    if (ch === "H") { out += "ः"; i++; continue; }
    if (ch === "~") { out += "ँ"; i++; continue; }

    const cons = matchLongest(s, i, CONS);
    if (cons) {
      const [, consChar] = cons;
      i += cons[0].length;
      const v = matchVow(s, i);
      if (v) {
        out += consChar + MATRA[v];
        i += v.length;
      } else if (s[i] === "a") {
        out += consChar;
        i++;
      } else {
        out += consChar + "्";
      }
      continue;
    }
    const v = matchVow(s, i);
    if (v) {
      out += INDEP[v];
      i += v.length;
      continue;
    }
    out += ch;
    i++;
  }
  return out.replace(/््/g, "्").replace(/्$/u, "");
}

export function convertLastRomanWord(full) {
  const m = String(full).match(/^(.*?)([A-Za-z~]+)$/);
  if (!m) return full;
  return m[1] + romanToHindi(m[2]);
}

export const HI_KEYS = {
  vowels: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],
  matras: ["ा", "ि", "ी", "ु", "ू", "े", "ै", "ो", "ौ", "ं", "ः", "्", "ँ"],
  rows: [
    ["क", "ख", "ग", "घ", "ङ"],
    ["च", "छ", "ज", "झ", "ञ"],
    ["ट", "ठ", "ड", "ढ", "ण"],
    ["त", "थ", "द", "ध", "न"],
    ["प", "फ", "ब", "भ", "म"],
    ["य", "र", "ल", "व", "श", "ष", "स", "ह"],
    ["क्ष", "त्र", "ज्ञ", "श्र"]
  ],
  extra: ["।", "?", ",", "०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
};

export const TYPE_LANGS = [
  { id: "hi-phonetic", label: "हिंदी फ़ोनेटिक", hint: "namaste → नमस्ते  (Space से शब्द पूरा)" },
  { id: "hi-keys", label: "हिंदी कुंजी", hint: "देवनागरी कुंजीपटल से लिखें" },
  { id: "ol", label: "ओल चिकि", hint: "ᱚᱞ ᱪᱤᱠᱤ कुंजीपटल" },
  { id: "en", label: "English", hint: "Roman / लैटिन कुंजी" }
];
