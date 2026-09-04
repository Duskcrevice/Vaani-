import { WORDS as BASE_WORDS, PHRASES as BASE_PHRASES, TOPICS } from "../js/data.js";
import { EXTRA_WORDS, EXTRA_PHRASES } from "./lexicon-extra.js";

function mergeAlts(a, b) {
  const seen = new Set();
  const out = [];
  for (const part of String(a || "").split("|").concat(String(b || "").split("|"))) {
    const p = part.trim();
    if (!p) continue;
    const k = p.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out.join("|");
}

export function mergeWords(base, extra) {
  const byOl = new Map();
  const out = base.map((row) => {
    const copy = row.slice();
    byOl.set(copy[0], copy);
    return copy;
  });
  extra.forEach((row) => {
    const cur = byOl.get(row[0]);
    if (cur) {
      cur[1] = mergeAlts(cur[1], row[1]);
      cur[2] = mergeAlts(cur[2], row[2]);
      cur[3] = mergeAlts(cur[3], row[3]);
    } else {
      const copy = row.slice(0, 6);
      out.push(copy);
      byOl.set(copy[0], copy);
    }
  });
  return out;
}

export function mergePhrases(base, extra) {
  const seen = new Set(base.map((p) => String(p.hi || "").trim().toLowerCase()));
  const out = base.slice();
  extra.forEach((p) => {
    const k = String(p.hi || "").trim().toLowerCase();
    if (k && seen.has(k)) {
      const hit = out.find((x) => String(x.hi).trim().toLowerCase() === k);
      if (hit) {
        const sat = new Set(hit.sat.concat(p.sat || []));
        hit.sat = [...sat];
      }
      return;
    }
    seen.add(k);
    out.push(p);
  });
  return out;
}

export const WORDS = mergeWords(BASE_WORDS, EXTRA_WORDS);
export const PHRASES = mergePhrases(BASE_PHRASES, EXTRA_PHRASES);
export { TOPICS };

export const EXTRA_EN = Object.fromEntries(
  EXTRA_WORDS.map((row) => [String(row[1]).split("|")[0], row[6] || ""]).filter((x) => x[1])
);
