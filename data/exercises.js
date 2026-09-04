import { QUIZZES } from "../js/data.js";
import { DICTIONARY } from "./dictionary.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(entry, n = 3) {
  const pool = DICTIONARY.filter((w) => w.id !== entry.id && w.topic === entry.topic);
  const extra = DICTIONARY.filter((w) => w.id !== entry.id);
  return shuffle(pool.length >= n ? pool : extra).slice(0, n);
}

export function buildPracticeSet(cls = 0, count = 8) {
  const pool = DICTIONARY.filter((w) => !cls || w.cls <= cls);
  const picked = shuffle(pool).slice(0, count);
  const types = ["mcq", "ol-meaning", "fill", "match", "translate"];
  const items = picked.map((w, i) => {
    const type = types[i % types.length];
    if (type === "match" && i + 3 < picked.length) {
      const group = picked.slice(i, i + 4);
      return {
        type: "match",
        prompt: "सही अर्थ से जोड़ें",
        pairs: group.map((g) => ({ ol: g.ol, hi: g.hi0, id: g.id })),
        explain: "ओल चिकि शब्द को हिंदी अर्थ से मिलाएँ।"
      };
    }
    const wrong = distractors(w).map((d) => d.hi0);
    const opts = shuffle([w.hi0, ...wrong]);
    if (type === "fill") {
      return {
        type: "fill",
        prompt: `${w.ol}  (${w.rom0}) का हिंदी अर्थ लिखें या चुनें`,
        answer: w.hi0,
        opts,
        explain: `${w.ol} / ${w.rom0} = ${w.hi0}`,
        ol: w.ol, rom: w.rom0
      };
    }
    if (type === "ol-meaning") {
      return {
        type: "ol-meaning",
        prompt: `यह ओल चिकि शब्द पढ़ें: ${w.ol}`,
        answer: w.hi0,
        opts,
        explain: `${w.ol} (${w.rom0}) का अर्थ ${w.hi0} है।`,
        ol: w.ol, rom: w.rom0
      };
    }
    if (type === "translate") {
      return {
        type: "translate",
        prompt: `हिंदी «${w.hi0}» का संताली रूप कौन-सा है?`,
        answer: w.ol,
        opts: shuffle([w.ol, ...distractors(w).map((d) => d.ol)]),
        explain: `${w.hi0} = ${w.ol} (${w.rom0})`,
        ol: w.ol, rom: w.rom0
      };
    }
    return {
      type: "mcq",
      prompt: `${w.ol} / ${w.rom0} का अर्थ क्या है?`,
      answer: w.hi0,
      opts,
      explain: `${w.ol} का हिंदी अर्थ ${w.hi0} है।`,
      ol: w.ol, rom: w.rom0
    };
  });
  // mix in class quiz if available
  if (cls && QUIZZES[cls]) {
    QUIZZES[cls].slice(0, 2).forEach((q) => {
      items.push({
        type: "mcq",
        prompt: q.q,
        answer: q.opts[q.a],
        opts: q.opts.slice(),
        explain: `सही उत्तर: ${q.opts[q.a]}`
      });
    });
  }
  return shuffle(items).slice(0, count);
}

export { QUIZZES };
