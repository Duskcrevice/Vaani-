/**
 * Mic: getUserMedia + Web Speech (live) + Sarvam STT chunks (teacher mode).
 * TTS: /api/tts then browser speechSynthesis.
 */
import { storage } from "./storage.js";

function Rec() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function inIframe() {
  try { return typeof window !== "undefined" && window.self !== window.top; } catch { return true; }
}

export function speechCaps() {
  const rec = Rec();
  const secure = typeof window !== "undefined" && window.isSecureContext;
  return {
    stt: (!!rec || !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) && secure,
    tts: true,
    rec: !!rec,
    secure,
    iframe: inIframe(),
    note: !secure
      ? "माइक सुरक्षित पेज (HTTPS) पर चलता है।"
      : "माइक दबाकर हिंदी बोलें। ब्राउज़र पूछे तो अनुमति दें।"
  };
}

let active = null;
let restartOnEnd = false;
let sharedStream = null;
let chunking = false;
let ttsAudio = null;
let ttsBusy = false;
let muteMicUntil = 0;

export function hasWebSpeech() {
  return !!Rec();
}

export function micIsMuted() {
  return ttsBusy || Date.now() < muteMicUntil;
}

export function muteMic(ms = 700) {
  muteMicUntil = Math.max(muteMicUntil, Date.now() + ms);
}

export async function requestMic() {
  if (!window.isSecureContext) {
    const err = new Error("insecure");
    err.error = "insecure";
    throw err;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const err = new Error("unsupported");
    err.error = "unsupported";
    throw err;
  }
  if (sharedStream && sharedStream.getTracks().some((t) => t.readyState === "live")) {
    return sharedStream;
  }
  sharedStream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true }
  });
  return sharedStream;
}

export function releaseMic() {
  chunking = false;
  if (sharedStream) {
    sharedStream.getTracks().forEach((t) => t.stop());
    sharedStream = null;
  }
}

export function listen({
  lang = "hi-IN",
  onResult,
  onInterim,
  onError,
  onEnd,
  score,
  keepAlive = true
} = {}) {
  const Ctor = Rec();
  if (!Ctor) {
    onError && onError({ error: "unsupported" });
    return () => { };
  }
  stopListen();
  restartOnEnd = keepAlive;
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 3;

  rec.onresult = (ev) => {
    let interim = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const alt = ev.results[i][0];
      const t = alt ? alt.transcript : "";
      if (ev.results[i].isFinal) {
        let best = t;
        if (score && ev.results[i].length > 1) {
          let s = score(best);
          for (let a = 1; a < ev.results[i].length; a++) {
            const sc = score(ev.results[i][a].transcript);
            if (sc > s) {
              best = ev.results[i][a].transcript;
              s = sc;
            }
          }
        }
        const out = String(best || "").trim();
        if (out && !micIsMuted()) onResult && onResult(out);
      } else {
        interim += t;
      }
    }
    if (interim && !micIsMuted()) onInterim && onInterim(interim);
  };

  rec.onerror = (e) => {
    const code = e.error || "";
    if (code === "no-speech" || code === "aborted") return;
    if (keepAlive && (code === "network" || code === "audio-capture")) {
      try { rec.stop(); } catch { /* restart via onend */ }
      return;
    }
    if (!keepAlive) {
      restartOnEnd = false;
      onError && onError(e);
    } else {
      onError && onError(e);
    }
  };

  rec.onend = () => {
    if (restartOnEnd && active === rec) {
      try {
        rec.start();
        return;
      } catch {
        setTimeout(() => {
          if (restartOnEnd) {
            try { rec.start(); } catch { /* give up */ }
          }
        }, 250);
        return;
      }
    }
    active = null;
    onEnd && onEnd();
  };

  active = rec;
  try {
    rec.start();
  } catch (e) {
    restartOnEnd = false;
    active = null;
    onError && onError(e);
  }
  return stopListen;
}

export function stopListen() {
  restartOnEnd = false;
  try { active && active.stop(); } catch { /* noop */ }
  active = null;
}

function blobToB64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || "");
      resolve(s.includes(",") ? s.split(",", 1)[1] : s);
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export async function transcribeBlob(blob, lang = "hi-IN") {
  if (!blob || !blob.size || !navigator.onLine) return "";
  const audio = await blobToB64(blob);
  const res = await fetch("/api/stt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio, mime: blob.type || "audio/webm", lang, keys: storage.getApiKeys() })
  });
  const data = await res.json().catch(() => ({}));
  return (data && data.text) ? String(data.text).trim() : "";
}

function pickMime() {
  const prefer = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return prefer.find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || "";
}

/** Record ~ms slices on the live stream and send each to /api/stt. */
export async function startChunkLoop({ lang = "hi-IN", ms = 4000, onText } = {}) {
  const stream = await requestMic();
  if (!window.MediaRecorder) return;
  chunking = true;
  const mime = pickMime();
  const run = () => {
    if (!chunking || !sharedStream) return;
    let rec;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      return;
    }
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: rec.mimeType || mime || "audio/webm" });
      if (blob.size > 2500 && !micIsMuted()) {
        try {
          const text = await transcribeBlob(blob, lang);
          if (text && !micIsMuted()) onText && onText(text);
        } catch { /* keep looping */ }
      }
      if (chunking) setTimeout(run, 80);
    };
    try { rec.start(); } catch { chunking = false; return; }
    setTimeout(() => {
      try { if (rec.state === "recording") rec.stop(); } catch { if (chunking) run(); }
    }, ms);
  };
  run();
}

export function stopChunkLoop() {
  chunking = false;
}

export async function startCapture() {
  await requestMic();
  return startChunkLoop({ lang: "hi-IN", ms: 5000, onText: () => { } });
}

export async function stopCaptureAndTranscribe(lang = "hi-IN") {
  stopChunkLoop();
  return "";
}

const OL_VOWEL = { "ᱚ": ["ओ", "ो"], "ᱟ": ["आ", "ा"], "ᱤ": ["इ", "ि"], "ᱩ": ["उ", "ु"], "ᱮ": ["ए", "े"], "ᱳ": ["ओ", "ो"] };
const OL_CONS = { "ᱛ": "त", "ᱜ": "ग", "ᱝ": "ङ", "ᱞ": "ल", "ᱠ": "क", "ᱡ": "ज", "ᱢ": "म", "ᱣ": "व", "ᱥ": "स", "ᱦ": "ह", "ᱧ": "ञ", "ᱨ": "र", "ᱪ": "च", "ᱫ": "द", "ᱬ": "ण", "ᱭ": "य", "ᱯ": "प", "ᱰ": "ड", "ᱱ": "न", "ᱲ": "ड़", "ᱴ": "ट", "ᱵ": "ब", "ᱶ": "व", "ᱷ": "ह" };

function olToDeva(text) {
  let out = "";
  let pending = false;
  for (const ch of String(text || "")) {
    if (OL_CONS[ch]) {
      if (pending) out += "्";
      out += OL_CONS[ch];
      pending = true;
      continue;
    }
    if (OL_VOWEL[ch]) {
      out += pending ? OL_VOWEL[ch][1] : OL_VOWEL[ch][0];
      pending = false;
      continue;
    }
    pending = false;
    out += ch;
  }
  return out;
}

export async function speak(text, { lang = "hi-IN", rate = 0.92 } = {}) {
  const raw = String(text || "").trim();
  if (!raw || raw === "—") return;
  const t = (lang.startsWith("sat") || /[\u1c50-\u1c7f]/.test(raw)) ? olToDeva(raw) : raw;
  if (navigator.onLine) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw, lang, keys: storage.getApiKeys() })
      });
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 40 && !(blob.type || "").includes("json")) {
          try { ttsAudio && ttsAudio.pause(); } catch { /* noop */ }
          const url = URL.createObjectURL(blob);
          ttsAudio = new Audio(url);
          ttsAudio.onended = () => { URL.revokeObjectURL(url); ttsAudio = null; };
          await ttsAudio.play();
          return;
        }
      }
    } catch { /* fallback */ }
  }
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "hi-IN";
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  try { ttsAudio && ttsAudio.pause(); } catch { /* noop */ }
  ttsAudio = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function micErrorMessage(err) {
  const code = (err && (err.error || err.name || err.message)) || "";
  if (inIframe() && /NotAllowed|not-allowed|service-not-allowed|SecurityError|PermissionDenied/i.test(String(code))) {
    return "इस विंडो में माइक रुक गया। ब्राउज़र पूछे तो अनुमति दें, फिर माइक फिर दबाएँ।";
  }
  const map = {
    NotAllowedError: "माइक की अनुमति नहीं मिली। ब्राउज़र के संदेश पर अनुमति दें, फिर माइक दबाएँ।",
    "not-allowed": "माइक की अनुमति नहीं मिली। ब्राउज़र के संदेश पर अनुमति दें, फिर माइक दबाएँ।",
    PermissionDeniedError: "माइक की अनुमति अस्वीकार हुई। साइट सेटिंग में माइक्रोफ़ोन चालू करें।",
    NotFoundError: "कोई माइक्रोफ़ोन नहीं मिला।",
    "not-found": "कोई माइक्रोफ़ोन नहीं मिला।",
    NotReadableError: "माइक किसी और ऐप में व्यस्त है। वह ऐप बंद करके फिर कोशिश करें।",
    "audio-capture": "माइक से आवाज़ नहीं आ रही।",
    network: "पहचान सर्वर तक नेट नहीं है।",
    "service-not-allowed": "इस पेज पर माइक बंद है। अनुमति देकर माइक फिर दबाएँ।",
    insecure: "माइक केवल सुरक्षित पेज पर चलता है।",
    unsupported: "लाइव पहचान के लिए Chrome या Edge आज़माएँ।",
    SecurityError: "ब्राउज़र ने माइक रोक दिया। अनुमति देकर फिर माइक दबाएँ।"
  };
  return map[code] || "माइक शुरू नहीं हुआ। ब्राउज़र पूछे तो अनुमति दें, फिर माइक दबाएँ।";
}
