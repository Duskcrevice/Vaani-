import { LESSONS } from "../js/data.js";
import { OL_INTRO } from "./olchiki.js";
import { READINGS } from "./lexicon-extra.js";

const EXAMPLES = {
  "c1-ol": { ol: "ᱡᱚᱦᱟᱨ", rom: "johar", hi: "नमस्ते" },
  "c1-story": { ol: "ᱢᱤᱫ ᱠᱚᱲᱟ ᱟᱛᱩ ᱨᱮ", rom: "mit kora atu re", hi: "एक लड़का गाँव में" },
  "c1-poem": { ol: "ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱨᱟᱠᱟᱵ ᱮᱱᱟ", rom: "sin cando rakab ena", hi: "सूरज उग गया।" },
  "c2-letter": { ol: "ᱡᱚᱦᱟᱨ ᱟᱭᱚ", rom: "johar ayo", hi: "प्रिय माँ" },
  "c1-me": { ol: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ", rom: "amak nutum chet", hi: "आपका नाम क्या है?" },
  "c1-family": { ol: "ᱤᱧᱟᱜ ᱟᱭᱳ", rom: "inak ayo", hi: "मेरी माँ" },
  "c1-num": { ol: "ᱢᱤᱫ ᱵᱟᱨ ᱯᱮ", rom: "mit bar pe", hi: "एक दो तीन" },
  "c1-body": { ol: "ᱤᱧᱟᱜ ᱛᱤ", rom: "inak ti", hi: "मेरा हाथ" },
  "c1-school": { ol: "ᱤᱧ ᱤᱥᱠᱩᱞ ᱥᱮᱱᱤᱧᱟ", rom: "in iskul sen inga", hi: "मैं स्कूल जाता/जाती हूँ।" },
  "c2-food": { ol: "ᱤᱧ ᱡᱚᱢᱤᱧᱟ", rom: "in jom inga", hi: "मुझे भूख लगी है।" },
  "c2-water": { ol: "ᱫᱟᱜ ᱮᱢᱢᱮ", rom: "dak emme", hi: "पानी दीजिए।" },
  "c2-plants": { ol: "ᱱᱚᱣᱟ ᱫᱟᱨᱮ ᱢᱟᱨᱟᱝ ᱠᱟᱱᱟ", rom: "noa dare marang kana", hi: "यह पेड़ बड़ा है।" },
  "c2-animals": { ol: "ᱥᱤᱢ ᱪᱮᱬᱮ ᱠᱟᱱᱟ", rom: "sim chere kana", hi: "मुर्गी एक पक्षी है।" },
  "c2-time": { ol: "ᱛᱮᱦᱮᱧ ᱞᱚᱞᱚ ᱠᱟᱱᱟ", rom: "tehen lolo kana", hi: "आज गर्मी है।" },
  "c3-grammar": { ol: "ᱱᱚᱣᱟ ᱪᱮᱫ ᱠᱟᱱᱟ", rom: "noa cet kana", hi: "यह क्या है?" },
  "c3-fest": { ol: "ᱥᱚᱦᱨᱟᱭ ᱯᱚᱨᱚᱵᱽ ᱠᱟᱱᱟ", rom: "sohrai porob kana", hi: "सोहराय एक त्योहार है।" },
  "c3-jk": { ol: "ᱟᱞᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ", rom: "ale jharkhand re tahena", hi: "हम झारखंड में रहते हैं।" },
  "c3-house": { ol: "ᱟᱢ ᱫᱚ ᱚᱠᱟᱨᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ", rom: "am do oka re tahena", hi: "आप कहाँ रहते हैं?" },
  "c4-verb": { ol: "ᱫᱩᱲᱩᱵ ᱢᱮ", rom: "durub me", hi: "बैठो।" },
  "c4-land": { ol: "ᱵᱩᱨᱩ ᱟᱨ ᱵᱤᱨ", rom: "buru ar bir", hi: "पहाड़ और जंगल" },
  "c4-measure": { ol: "ᱱᱚᱣᱟ ᱢᱟᱨᱟᱝ ᱠᱟᱱᱟ", rom: "noa marang kana", hi: "यह बड़ा है।" },
  "c4-folk": { ol: "ᱥᱮᱨᱮᱧ ᱟᱨ ᱮᱱᱮᱡ", rom: "seren ar enej", hi: "गीत और नृत्य" },
  "c5-health": { ol: "ᱛᱤ ᱥᱟᱯᱷᱟ ᱢᱮ", rom: "ti sapha me", hi: "हाथ धोओ।" },
  "c5-gender": { ol: "ᱠᱚᱲᱟ ᱟᱨ ᱠᱩᱲᱤ", rom: "kora ar kuri", hi: "लड़का और लड़की" },
  "c5-culture": { ol: "ᱵᱤᱨᱥᱟ ᱢᱩᱱᱰᱟ ᱢᱟᱨᱟᱝ ᱦᱚᱲ ᱠᱟᱱᱟ", rom: "birsa munda marang hor kana", hi: "बिरसा मुंडा महान व्यक्ति हैं।" },
  "c5-env": { ol: "ᱵᱤᱨ ᱥᱟᱯᱷᱟ ᱠᱟᱱᱟ", rom: "bir sapha kana", hi: "जंगल साफ है।" }
};

export function allLessons() {
  return LESSONS.map((L) => {
    const units = L.units.map((u) => ({ ...u, example: EXAMPLES[u.id] || null }));
    if (L.cls === 1) {
      units.unshift({ ...OL_INTRO, example: EXAMPLES["c1-ol"] });
    }
    READINGS.filter((r) => r.cls === L.cls).forEach((r) => {
      if (!units.some((u) => u.id === r.id)) {
        units.push({
          id: r.id,
          hi: r.hi,
          sat: r.sat,
          body: r.body,
          words: r.words || [],
          example: EXAMPLES[r.id] || null
        });
      }
    });
    return { ...L, units };
  });
}

export function flatUnits() {
  return allLessons().flatMap((L) => L.units.map((u, i) => ({ ...u, cls: L.cls, idx: i, classTitle: L.titleHi })));
}

export function unitById(id) {
  return flatUnits().find((u) => u.id === id) || null;
}

export function neighbors(id) {
  const list = flatUnits();
  const i = list.findIndex((u) => u.id === id);
  return { prev: list[i - 1] || null, next: list[i + 1] || null, i, total: list.length };
}
