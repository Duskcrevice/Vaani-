/**
 * translationService({ text, from, to, script })
 * Accuracy path:
 *  1) Exact Class 1–5 dictionary / phrase match (curriculum-accurate)
 *  2) Live APIs via same-origin /api/translate (Google, MyMemory, optional keys)
 *  3) Local word-by-word fallback
 */
import { PARTICLES_SAT, PARTICLES_HI, OL_KEYS } from "../js/data.js";
import { WORDS, PHRASES } from "../data/lexicon.js";
import { storage } from "./storage.js";

const olMap = Object.fromEntries(OL_KEYS);
const idx = { sat: new Map(), hi: new Map(), phrases: [] };
let ready = false;

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[।.!?,;:"'`‘’“”()[\]{}]/g, " ")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n").replace(/ṛ/g, "r").replace(/ḍ/g, "d").replace(/ṭ/g, "t")
    .replace(/ɔ/g, "o").replace(/ə/g, "a")
    .replace(/\s+/g, " ").trim();
}
function hasOl(s) { return /[\u1c50-\u1c7f]/.test(s); }
function hasDeva(s) { return /[\u0900-\u097f]/.test(s); }
function olToRoman(s) {
  let out = "";
  for (const ch of s) out += olMap[ch] != null ? olMap[ch] : ch;
  return out;
}
function tokenize(text) {
  return text.replace(/[।.?!]/g, " ").split(/\s+/).filter(Boolean);
}

function build() {
  if (ready) return;
  WORDS.forEach((row) => {
    const [ol, rom, dev, hi] = row;
    const rec = { ol, rom, dev, hi, cls: row[5], topic: row[4] };
    rom.split("|").forEach((k) => idx.sat.set(norm(k), rec));
    idx.sat.set(norm(ol), rec);
    dev.split("|").forEach((k) => idx.sat.set(norm(k), rec));
    hi.split("|").forEach((k) => idx.hi.set(norm(k), rec));
  });
  PHRASES.forEach((p) => {
    idx.phrases.push({
      satKeys: p.sat.map(norm).filter(Boolean),
      hiKey: norm(p.hi),
      hi: p.hi,
      sat: p.sat
    });
  });
  ready = true;
}

function lookupSat(tok) {
  const n = norm(tok);
  if (idx.sat.has(n)) return idx.sat.get(n);
  const o = norm(olToRoman(tok));
  if (o && idx.sat.has(o)) return idx.sat.get(o);
  return null;
}
function lookupHi(tok) {
  const n = norm(tok);
  if (idx.hi.has(n)) return idx.hi.get(n);
  for (const s of [n.replace(/ा$/u, ""), n.replace(/ी$/u, ""), n.replace(/ना$/u, "")]) {
    if (s && s !== n && idx.hi.has(s)) return idx.hi.get(s);
  }
  return null;
}

function displaySat(rec, script) {
  if (script === "dev") return rec.dev.split("|")[0];
  if (script === "rom") return rec.rom.split("|")[0];
  return rec.ol;
}

function particleToScript(v, script) {
  if (script === "rom") return v;
  const rec = lookupSat(v);
  if (rec) return displaySat(rec, script);
  const map = {
    ak: script === "dev" ? "आक्" : "ᱟᱜ",
    re: script === "dev" ? "रे" : "ᱨᱮ",
    khon: script === "dev" ? "खोन" : "ᱠᱷᱚᱱ",
    kana: script === "dev" ? "काना" : "ᱠᱟᱱᱟ",
    ar: script === "dev" ? "आर" : "ᱟᱨ",
    sange: script === "dev" ? "साङे" : "ᱥᱟᱶᱜᱮ"
  };
  return map[v] || v;
}

function localTranslate(text, from, to, script) {
  build();
  const raw = text.trim();
  if (!raw) return { text: "", conf: 0, unknown: [], matched: [], translit: "", note: "", exact: false };

  if (from === "sat") {
    const n = norm(hasOl(raw) ? olToRoman(raw) : raw);
    const n2 = norm(raw);
    const phrase = idx.phrases.find((p) => p.satKeys.some((k) => k === n || k === n2));
    if (phrase) {
      return { text: phrase.hi, conf: 1, unknown: [], matched: phrase.sat.slice(0, 1), translit: "", note: "JAC/NCERT वाक्यकोश", exact: true };
    }
    const parts = []; const unknown = []; const matched = [];
    tokenize(raw).forEach((tok) => {
      const key = norm(hasOl(tok) ? olToRoman(tok) : tok);
      if (PARTICLES_SAT[key] !== undefined) {
        const v = PARTICLES_SAT[key];
        if (v) parts.push(v.split("|")[0]);
        return;
      }
      const rec = lookupSat(tok);
      if (rec) { parts.push(rec.hi.split("|")[0]); matched.push(tok); }
      else { unknown.push(tok); parts.push(tok); }
    });
    const conf = tokenize(raw).length ? 1 - unknown.length / tokenize(raw).length : 0;
    return {
      text: parts.join(" ").replace(/\s+/g, " ").replace(/ है है/g, " है").trim(),
      conf, unknown, matched, translit: "",
      note: unknown.length ? "कुछ शब्द शब्दकोश में नहीं मिले।" : "स्थानीय शब्दकोश",
      exact: conf === 1 && tokenize(raw).length <= 3
    };
  }

  const n = norm(raw);
  const phrase = idx.phrases.find((p) => p.hiKey === n);
  if (phrase) {
    const ol = phrase.sat.find((s) => hasOl(s)) || phrase.sat[0];
    const rom = phrase.sat.find((s) => !hasOl(s) && !hasDeva(s)) || "";
    const out = script === "rom" ? rom || ol : script === "dev"
      ? (phrase.sat.find((s) => hasDeva(s) && !hasOl(s)) || ol) : ol;
    return { text: out, conf: 1, unknown: [], matched: [phrase.hi], translit: rom, note: "JAC/NCERT वाक्यकोश", exact: true };
  }
  const parts = []; const unknown = []; const matched = []; const romParts = [];
  tokenize(raw).forEach((tok) => {
    const key = norm(tok);
    if (PARTICLES_HI[key] !== undefined) {
      const v = PARTICLES_HI[key];
      if (v) { parts.push(particleToScript(v, script)); romParts.push(v); }
      return;
    }
    const rec = lookupHi(tok);
    if (rec) {
      parts.push(displaySat(rec, script));
      romParts.push(rec.rom.split("|")[0]);
      matched.push(tok);
    } else { unknown.push(tok); parts.push(tok); romParts.push(tok); }
  });
  const toks = tokenize(raw);
  const conf = toks.length ? 1 - unknown.length / toks.length : 0;
  return {
    text: parts.join(" ").replace(/\s+/g, " ").trim(),
    conf, unknown, matched, translit: romParts.join(" "),
    note: unknown.length ? "कुछ शब्द शब्दकोश में नहीं मिले।" : "स्थानीय शब्दकोश",
    exact: conf === 1 && toks.length <= 3
  };
}

function apiUrl() {
  if (typeof window !== "undefined" && window.JOHAR_TRANSLATE_URL) return window.JOHAR_TRANSLATE_URL;
  return "/api/translate";
}

async function tryRemote(text, from, to) {
  if (typeof navigator !== "undefined" && !navigator.onLine) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(apiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to, keys: storage.getApiKeys() }),
      signal: ctrl.signal
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.text) return null;
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function translationService({ text, from = "sat", to = "hi", script = "ol" } = {}) {
  const local = localTranslate(text, from, to, script);
  if (!text || !text.trim()) {
    return { ...local, source: "local-dictionary", fallback: true };
  }
  if (local.exact) {
    return { ...local, source: "lexicon", fallback: false, provider: "lexicon" };
  }
  const remote = await tryRemote(text.trim(), from, to);
  if (remote && remote.text) {
    return {
      text: remote.text,
      conf: remote.conf != null ? remote.conf : 0.88,
      unknown: local.unknown || [],
      matched: local.matched || [],
      translit: local.translit || "",
      note: remote.note || "मशीन अनुवाद",
      source: remote.provider || remote.source || "api",
      provider: remote.provider || "api",
      fallback: false
    };
  }
  return { ...local, source: "local-dictionary", fallback: true, provider: "lexicon" };
}

export function scoreAgainstLexicon(text) {
  build();
  const toks = tokenize(text);
  if (!toks.length) return 0;
  let hit = 0;
  toks.forEach((t) => {
    if (lookupSat(t) || lookupHi(t) || PARTICLES_SAT[norm(t)] !== undefined || PARTICLES_HI[norm(t)] !== undefined) hit++;
  });
  return hit / toks.length;
}

export { norm };
