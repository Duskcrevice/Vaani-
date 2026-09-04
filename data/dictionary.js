import { WORDS, TOPICS, PHRASES, EXTRA_EN } from "./lexicon.js";

const POS = {
  greetings: { hi: "अभिवादन", en: "interjection" },
  pronouns: { hi: "सर्वनाम", en: "pronoun" },
  verbs: { hi: "क्रिया", en: "verb" },
  adjectives: { hi: "विशेषण", en: "adjective" },
  numbers: { hi: "संख्या", en: "numeral" }
};

const EN = {
  johar: "hello", ayo: "mother", baba: "father", boeha: "brother", misera: "sister",
  gidra: "child", kora: "boy", kuri: "girl", in: "I", am: "you", uni: "he/she",
  nutum: "name", dak: "water", daka: "cooked rice", jom: "to eat", nu: "to drink",
  sen: "to go", hijuk: "to come", iskul: "school", machet: "teacher", potob: "book",
  seta: "dog", gai: "cow", merom: "goat", sim: "hen", dare: "tree", baha: "flower",
  sakam: "leaf", orak: "house", ato: "village", sin: "sun", chando: "moon",
  ipil: "star", buru: "hill", bir: "forest", sohrai: "Sohrai festival",
  karam: "Karam festival", mit: "one", bar: "two", pe: "three", pon: "four",
  more: "five", gel: "ten", arag: "red", pund: "white", hende: "black",
  hariar: "green", sasan: "yellow", nila: "blue", bes: "good", marang: "big",
  hudin: "small", ti: "hand", janga: "foot", bohok: "head", met: "eye",
  lutur: "ear", mu: "nose", mocha: "mouth", ror: "to speak", ol: "to write",
  parhao: "to read", durub: "to sit", tehen: "today", hola: "yesterday",
  gapa: "tomorrow", jharkhand: "Jharkhand", ranchi: "Ranchi", santali: "Santali"
};

function posOf(topic) {
  return POS[topic] || { hi: "संज्ञा", en: "noun" };
}

export const DICTIONARY = WORDS.map((row, i) => {
  const [ol, rom, dev, hi, topic, cls] = row;
  const id = rom.split("|")[0];
  return {
    id,
    i,
    ol,
    rom: rom.split("|"),
    rom0: rom.split("|")[0],
    dev: dev.split("|")[0],
    hi: hi.split("|"),
    hi0: hi.split("|")[0],
    en: EN[id] || EXTRA_EN[id] || "",
    topic,
    cls,
    pos: posOf(topic)
  };
});

export function relatedWords(entry, n = 4) {
  return DICTIONARY.filter((w) => w.topic === entry.topic && w.id !== entry.id).slice(0, n);
}

export function exampleFor(entry) {
  const keys = [entry.rom0, entry.ol, entry.dev, entry.hi0].map((s) => String(s).toLowerCase());
  const p = PHRASES.find((ph) =>
    ph.sat.some((s) => keys.some((k) => String(s).toLowerCase().includes(k))) ||
    keys.some((k) => ph.hi.toLowerCase().includes(k))
  );
  if (!p) return null;
  const ol = p.sat.find((s) => /[\u1c50-\u1c7f]/.test(s)) || p.sat[0];
  const rom = p.sat.find((s) => !/[\u1c50-\u1c7f\u0900-\u097f]/.test(s)) || "";
  return { ol, rom, hi: p.hi };
}

export { TOPICS };
