import { DICTIONARY, TOPICS, relatedWords, exampleFor } from "../data/dictionary.js";
import { allLessons, unitById, neighbors, flatUnits } from "../data/lessons.js";
import { OL_LETTERS } from "../data/olchiki.js";
import { buildPracticeSet } from "../data/exercises.js";
import { NCERT_DATA } from "../data/ncert.js?v=4";
import { storage } from "../services/storage.js";
import { translationService, scoreAgainstLexicon } from "../services/translation.js";
import { speechCaps, listen, stopListen, speak, stopSpeak, requestMic, micErrorMessage, startChunkLoop, stopChunkLoop, releaseMic, hasWebSpeech, micIsMuted } from "../services/speech.js";
import { romanToHindi, convertLastRomanWord, HI_KEYS, TYPE_LANGS } from "../services/hindi-ime.js";
import { I18N } from "../js/i18n.js";

const $app = () => document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const ui = {
  script: "ol",
  srcLang: "sat",
  tgtLang: "hi",
  dictQ: "",
  dictTopic: "all",
  favOnly: false,
  practice: null,
  listen: false,
  liveTalk: false,
  echoSat: true,
  typeLang: "ol",
  srcText: "",
  appLang: localStorage.getItem("vaani_uilang") || "en",
  ncertState: {
    cls: null,
    sub: null,
    les: null,
    mode: null,
    lang: "en",
    quizIndex: 0,
    flipped: false,
    score: 0,
    finished: false
  }
};

window.t = function (key) {
  if (!I18N || !I18N[key]) return key;
  return I18N[key][ui.appLang] || I18N[key].en || key;
};

function route() {
  const raw = (location.hash || "#/").replace(/^#/, "");
  const p = raw.split("/").filter(Boolean);
  return { name: p[0] || "home", a: p[1] || "", b: decodeURIComponent(p[2] || "") };
}
function go(hash) {
  if (ui.listen) stopAllMic();
  const h = hash.startsWith("#") ? hash : "#" + hash;
  if (location.hash !== h) location.hash = h;
  render();
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 5200);
}

function wordById(id) {
  return DICTIONARY.find((w) => w.id === id) || null;
}

function satOf(w) {
  if (!w) return "";
  if (ui.script === "dev") return w.dev;
  if (ui.script === "rom") return w.rom0;
  return w.ol;
}

function dualSpeak(hi, sat) {
  const h = esc(hi || "");
  const s = esc(sat || hi || "");
  return `<span class="speak-pair" role="group" aria-label="सुनें">
    <button type="button" class="icon speak-hi" data-act="speak-hi" data-say="${h}" title="हिंदी आवाज़" aria-label="हिंदी सुनें">हि</button>
    <button type="button" class="icon speak-sat" data-act="speak-sat" data-say="${s}" title="संताली आवाज़" aria-label="संताली सुनें">ᱚ</button>
  </span>`;
}

function currentHiText() {
  const src = document.getElementById("srcInput");
  const tgt = document.getElementById("tgtOutput");
  if (ui.srcLang === "hi") return (src && src.value) || "";
  const t = tgt && tgt.textContent !== "—" ? tgt.textContent : "";
  return t || "";
}

function currentSatText() {
  const src = document.getElementById("srcInput");
  const tgt = document.getElementById("tgtOutput");
  if (ui.srcLang === "sat") return (src && src.value) || "";
  const t = tgt && tgt.textContent !== "—" ? tgt.textContent : "";
  return t || "";
}

function navActive(name) {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.classList.toggle("on", el.dataset.nav === name);
    el.setAttribute("aria-current", el.dataset.nav === name ? "page" : "false");
  });
}

function onlineBanner() {
  const bar = document.getElementById("netBar");
  if (!bar) return;
  bar.classList.toggle("show", !navigator.onLine);
}

/* ---------- HOME (STUDENT DASHBOARD) ---------- */
function viewHome() {
  storage.touchStreak();
  const d = storage.get();
  const units = flatUnits();
  const lessons = allLessons();
  const done = Object.keys(d.completedLessons).length;
  const streak = d.streak.count || 0;
  const learned = Object.keys(d.wordsLearned).length;
  const practiceAttempts = d.practice.attempts || 0;
  const cont = unitById(d.lastLesson) || units[0];

  // Class Progress Calculator
  const classProgressHtml = lessons.map(L => {
    const total = L.units.length;
    const completed = L.units.filter(u => d.completedLessons[u.id]).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return `
      <div class="dash-progress-row">
        <span class="dash-class-label">Class ${L.cls}</span>
        <div class="dash-progress-wrap"><div class="dash-progress-fill" style="width:${pct}%"></div></div>
        <span class="dash-progress-text">${completed}/${total}</span>
      </div>
    `;
  }).join("");

  // Recent Activity Builder
  const activities = d.activity && d.activity.length ? d.activity.slice(0, 4) : [];
  const activityHtml = activities.length
    ? activities.map(a => `<div class="dash-recent-item">✓ ${a.kind === "lesson" ? "Completed a lesson" : "Completed practice"}: <strong>${esc(a.label)}</strong></div>`).join("")
    : `<div class="dash-recent-item muted">No recent activity yet. Start learning!</div>`;

  return `
  <div class="dashboard-wrap">
    
    <!-- 1. Restored Tribal Art Hero -->
    <section class="card" style="display: flex; gap: 20px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      <div class="hero-content" style="flex:1; min-width: 250px;">
        <p class="muted">ᱡᱚᱦᱟᱨ · Vaani AI</p>
        <h1 style="font-size: 2.2rem; margin: 10px 0; line-height:1.2;">${t("hero_title")}</h1>
        <p style="color:var(--ink-soft); line-height: 1.5;">${t("hero_subtitle")}</p>
        <div style="margin-top: 20px;">
          <a class="btn" href="#/learn">${t("btn_start_learn")}</a>
          <a class="btn ghost" style="margin-left: 10px;" href="#/dictionary">${t("btn_open_dict")}</a>
        </div>
      </div>
      <img src="assets/hero.jpg" alt="Vaani AI Art" style="border-radius: 12px; width: 380px; max-width: 100%;">
    </section>

    <!-- 2. Learning Overview -->
    <section class="dash-grid-4">
      <div class="dash-stat-card">
        <span class="dash-stat-n">${done}</span>
        <span class="dash-stat-lbl">${t("stat_lessons")}</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-n">${learned}</span>
        <span class="dash-stat-lbl">${t("stat_words")}</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-n">${practiceAttempts}</span>
        <span class="dash-stat-lbl">${t("stat_prac")}</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-n">${streak} <small>Days</small></span>
        <span class="dash-stat-lbl">${t("stat_streak")}</span>
      </div>
    </section>

    <section class="card" style="margin-top:20px; margin-bottom:20px;">
      <h2 style="font-size:1.1rem; margin-bottom:15px;">NCERT Directory Access</h2>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn outline" style="color:var(--primary); font-weight:600;" href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">📚 Portal: Download Official NCERT Books (Class 1-12 | English/Hindi/Urdu)</a>
      </div>
    </section>

    <div class="dash-grid-2-col">
      <!-- 3. Continue Learning -->
      <section class="dash-section card dash-continue">
        <h2>${t("cont_learn")}</h2>
        <div class="dash-lesson-preview">
          <span class="dash-lesson-badge">Class ${cont.cls}</span>
          <h3>${esc(cont.hi)}</h3>
          <p class="satline">${esc(cont.sat)}</p>
          
          <a class="btn dash-btn-primary" href="#/learn/${cont.cls}/${cont.id}">${t("cont_learn")}</a>
        </div>
      </section>

      <!-- 4. Class Progress -->
      <section class="dash-section card dash-class-prog">
        <div class="dash-spread-header">
           <h2>${t("cls_prog")}</h2>
        </div>
        <div class="dash-progress-list">
          ${classProgressHtml}
        </div>
        <a class="dash-text-link" href="#/progress">${t("view_prog")} &rarr;</a>
      </section>
    </div>

    <!-- 5. Quick Learning Actions -->
    <section class="dash-section">
      <h2 class="dash-section-title">${t("quick_act")}</h2>
      <div class="dash-grid-4">
        <a class="dash-action-card" href="#/learn">
          <span class="dash-action-icon">ᱚ</span>
          <h3>${t("nav_learn")}</h3>
          <p>${t("desc_learn")}</p>
          <span class="dash-action-link">${t("btn_start_learn")}</span>
        </a>
        <a class="dash-action-card" href="#/dictionary">
          <span class="dash-action-icon">അ</span>
          <h3>${t("nav_dict")}</h3>
          <p>${t("desc_dict")}</p>
          <span class="dash-action-link">${t("btn_open_dict")}</span>
        </a>
        <a class="dash-action-card" href="#/translate">
          <span class="dash-action-icon">⇄</span>
          <h3>${t("nav_trans")}</h3>
          <p>${t("desc_trans")}</p>
          <span class="dash-action-link">${t("nav_trans")}</span>
        </a>
        <a class="dash-action-card" href="#/practice">
          <span class="dash-action-icon">✎</span>
          <h3>${t("nav_prac")}</h3>
          <p>${t("desc_prac")}</p>
          <span class="dash-action-link">${t("btn_practice_now")}</span>
        </a>
      </div>
    </section>

    <!-- 6. Recent Activity -->
    <section class="dash-section card">
      <h2>${t("recent_act")}</h2>
      <div class="dash-activity-list">
        ${activityHtml}
      </div>
    </section>

  </div>`;
}

/* ---------- LEARN ---------- */
function viewLearnList(cls) {
  const lessons = allLessons();
  const d = storage.get();
  const current = Number(cls) || 1;
  const L = lessons.find((x) => x.cls === current) || lessons[0];
  const tabs = lessons.map((x) => `<a class="chip ${x.cls === L.cls ? "on" : ""}" href="#/learn/${x.cls}">${t("lbl_class")} ${x.cls}</a>`).join("");
  const cards = L.units.map((u) => {
    const ok = !!d.completedLessons[u.id];
    return `<a class="lesson-card ${ok ? "done" : ""}" href="#/learn/${L.cls}/${u.id}">
      <span class="badge">${ok ? t("lbl_done") : t("lbl_class") + " " + L.cls}</span>
      <strong>${esc(u.hi)}</strong>
      <span class="satline">${esc(u.sat)}</span>
    </a>`;
  }).join("");
  return `
    <header class="page-h"><h1>${t("nav_learn")}</h1><p class="muted">${esc(L.ncert)}</p></header>
    <div class="chip-row">${tabs}</div>
    <h2 class="class-title">${esc(L.titleHi)}</h2>
    <p class="satline">${esc(L.titleSat)}</p>
    <div class="lesson-grid">${cards}</div>`;
}

function viewLesson(cls, id) {
  const u = unitById(id);
  if (!u) return viewLearnList(cls);
  const d = storage.get();
  const { prev, next } = neighbors(id);
  const done = !!d.completedLessons[id];
  const words = (u.words || []).map((wid) => DICTIONARY.find((w) => w.id === wid || w.rom0 === wid || w.hi0 === wid)).filter(Boolean);
  const letters = u.letters ? OL_LETTERS.map((l) => `<div class="letter" aria-label="${esc(l.name)}"><b>${esc(l.ol)}</b><small>${esc(l.name)} · ${esc(l.rom)}</small>${dualSpeak(l.hi, l.ol)}</div>`).join("") : "";
  const wordCards = words.map((w) => `
    <article class="wcard">
      ${dualSpeak(w.hi0, w.dev || w.ol)}
      <a href="#/dictionary/${encodeURIComponent(w.id)}"><span class="w-sat">${esc(w.ol)}</span></a>
      <span class="rom">${esc(w.rom0)}</span>
      <span class="w-hi">${esc(w.hi0)}</span>
    </article>`).join("");
  const ex = u.example;
  const quizWord = words[0];
  const quiz = quizWord ? (() => {
    const opts = [quizWord.hi0, ...DICTIONARY.filter((x) => x.id !== quizWord.id).slice(3, 6).map((x) => x.hi0)];
    return `<div class="ex-box">
      <h3>अभ्यास</h3>
      <p>${esc(quizWord.ol)} का अर्थ चुनें</p>
      <div class="opts">${opts.map((o) => `<button class="opt" data-act="quick" data-ok="${o === quizWord.hi0}" data-word="${esc(quizWord.id)}">${esc(o)}</button>`).join("")}</div>
      <p class="hint" id="quickHint"></p>
    </div>`;
  })() : "";

  return `
    <p class="crumb"><a href="#/learn/${u.cls}">कक्षा ${u.cls}</a> · पाठ</p>
    <article class="card lesson-view">
      <header class="spread">
        <div>
          <h1>${esc(u.hi)}</h1>
          <p class="satline">${esc(u.sat)}</p>
        </div>
        <span class="badge ${done ? "ok" : ""}">${done ? "पूर्ण" : "अपूर्ण"}</span>
      </header>
      <p class="prose">${esc(u.body).replace(/\n/g, "<br>")}</p>
      ${letters ? `<div class="letters">${letters}</div>` : ""}
      <div class="word-row">${wordCards}</div>
      ${ex ? `<blockquote class="example"><span class="ol-md">${esc(ex.ol)}</span><span class="rom">${esc(ex.rom)}</span><span>${esc(ex.hi)}</span>
        ${dualSpeak(ex.hi, ex.ol)}</blockquote>` : ""}
      ${quiz}
      <div class="spread actions">
        ${prev ? `<a class="btn ghost" href="#/learn/${prev.cls}/${prev.id}">← ${esc(prev.hi)}</a>` : `<span></span>`}
        <button class="btn" data-act="complete" data-id="${esc(u.id)}" data-words="${esc(words.map((w) => w.id).join(","))}">${done ? "फिर से पूर्ण चिह्नित करें" : "पाठ पूरा हुआ"}</button>
        ${next ? `<a class="btn" href="#/learn/${next.cls}/${next.id}">${esc(next.hi)} →</a>` : `<a class="btn ghost" href="#/practice">अभ्यास</a>`}
      </div>
    </article>`;
}

/* ---------- DICTIONARY ---------- */
function viewDictionary(openId) {
  const d = storage.get();
  const q = ui.dictQ.trim().toLowerCase();
  let rows = DICTIONARY.filter((w) => {
    if (ui.favOnly && !d.favorites.includes(w.id)) return false;
    if (ui.dictTopic !== "all" && w.topic !== ui.dictTopic) return false;
    if (!q) return true;
    const blob = [w.ol, w.rom.join(" "), w.dev, w.hi.join(" "), w.en, w.id].join(" ").toLowerCase();
    return blob.includes(q);
  });
  const open = openId ? wordById(openId) : null;
  const topics = `<button class="chip ${ui.dictTopic === "all" ? "on" : ""}" data-act="topic" data-id="all">सभी</button>` +
    TOPICS.map((t) => `<button class="chip ${ui.dictTopic === t.id ? "on" : ""}" data-act="topic" data-id="${t.id}">${esc(t.hi)}</button>`).join("");
  const recent = d.recentSearch.length
    ? `<div class="chip-row muted-row">हाल की खोज: ${d.recentSearch.map((s) => `<button class="chip" data-act="searchset" data-q="${esc(s)}">${esc(s)}</button>`).join("")}</div>` : "";

  const detail = open ? wordDetail(open, d) : "";
  const grid = rows.slice(0, 120).map((w) => `
    <a class="wcard dict ${d.favorites.includes(w.id) ? "fav" : ""}" href="#/dictionary/${encodeURIComponent(w.id)}">
      <span class="w-sat">${esc(w.ol)}</span>
      <span class="rom">${esc(w.rom0)}</span>
      <span class="w-hi">${esc(w.hi0)}</span>
      <span class="w-meta">${esc(w.pos.hi)} · कक्षा ${w.cls}</span>
    </a>`).join("");

  return `
    <header class="page-h"><h1>Dictionary · ᱟᱹᱲᱟᱹ</h1>
      <p class="muted">ओल चिकि, रोमन या हिंदी से खोजें। ${rows.length} शब्द</p></header>
    <div class="filters">
      <label class="sr-only" for="dictQ">शब्द खोज</label>
      <input id="dictQ" type="search" lang="${ui.typeLang.startsWith("hi") ? "hi" : "en"}" value="${esc(ui.dictQ)}" placeholder="ᱡᱚᱦᱟᱨ · johar · namaste / नमस्ते" />
      <button class="chip ${ui.favOnly ? "on" : ""}" data-act="favonly">★ पसंदीदा</button>
      <button class="chip ${ui.typeLang === "hi-phonetic" ? "on" : ""}" data-act="typelang" data-id="hi-phonetic">हिंदी टाइप</button>
      <button class="chip ${ui.typeLang === "en" ? "on" : ""}" data-act="typelang" data-id="en">English</button>
    </div>
    <div class="chip-row scroll">${topics}</div>
    ${recent}
    ${detail}
    <div class="word-grid">${grid || `<p class="muted">कोई शब्द नहीं मिला।</p>`}</div>`;
}

function wordDetail(w, d) {
  const fav = d.favorites.includes(w.id);
  const rel = relatedWords(w);
  const ex = exampleFor(w);
  return `<article class="card detail">
    <div class="spread">
      <div>
        <p class="ol-lg">${esc(w.ol)}</p>
        <p class="rom">${esc(w.rom0)} · ${esc(w.dev)}</p>
      </div>
      <div class="icon-col">
        ${dualSpeak(w.hi0, w.dev || w.ol)}
        <button class="icon ${fav ? "on" : ""}" data-act="fav" data-id="${esc(w.id)}" aria-pressed="${fav}" aria-label="पसंदीदा">★</button>
      </div>
    </div>
    <p class="hi-lg">${esc(w.hi0)}${w.en ? " · " + esc(w.en) : ""}</p>
    <p class="muted">${esc(w.pos.hi)} (${esc(w.pos.en)}) · कक्षा ${w.cls} · ${esc((TOPICS.find((t) => t.id === w.topic) || {}).hi || w.topic)}</p>
    ${ex ? `<blockquote class="example"><span>${esc(ex.ol)}</span><span class="rom">${esc(ex.rom)}</span><span>${esc(ex.hi)}</span>${dualSpeak(ex.hi, ex.ol)}</blockquote>` : ""}
    ${rel.length ? `<p class="muted">संबंधित</p><div class="chip-row">${rel.map((r) => `<a class="chip" href="#/dictionary/${encodeURIComponent(r.id)}">${esc(r.ol)} · ${esc(r.hi0)}</a>`).join("")}</div>` : ""}
    <button class="btn ghost" data-act="learned" data-id="${esc(w.id)}">सीखा चिह्नित करें</button>
  </article>`;
}

/* ---------- TRANSLATE ---------- */
function viewTranslate() {
  const caps = speechCaps();
  const getBtn = (act, id, lbl) => `<button class="${ui[act] === id ? "on" : ""}" data-act="${act === 'srcLang' ? 'src' : 'tgt'}" data-id="${id}">${lbl}</button>`;
  return `
    <header class="page-h"><h1>${t("nav_trans")}</h1>
      <p class="muted">${t("trans_desc")}</p></header>
    <div class="toolbar">
      <div class="seg" role="group" aria-label="Source">
        ${getBtn("srcLang", "sat", t("lang_sat"))}
        ${getBtn("srcLang", "hi", t("lang_hi"))}
        ${getBtn("srcLang", "en", t("lang_en"))}
      </div>
      <span style="font-size: 1.1rem; padding-top: 3px; color: var(--ink-soft); font-weight: 700;">→</span>
      <div class="seg" role="group" aria-label="Target">
        ${getBtn("tgtLang", "sat", t("lang_sat"))}
        ${getBtn("tgtLang", "hi", t("lang_hi"))}
        ${getBtn("tgtLang", "en", t("lang_en"))}
      </div>
      <div class="seg" role="group" aria-label="Script">
        <button class="${ui.script === "ol" ? "on" : ""}" data-act="script" data-id="ol">${t("script_ol")}</button>
        <button class="${ui.script === "dev" ? "on" : ""}" data-act="script" data-id="dev">${t("script_dev")}</button>
        <button class="${ui.script === "rom" ? "on" : ""}" data-act="script" data-id="rom">${t("script_rom")}</button>
      </div>
      <button type="button" class="btn ${ui.liveTalk ? "live" : "ghost"}" data-act="live-talk" id="liveBtn">${t("btn_live")}</button>
    </div>
    <p class="hint" id="liveHelp">${ui.liveTalk ? t("hint_live_on") : t("hint_live_off")}</p>
    <div class="work">
      <div class="box">
        <label for="srcInput">${t("lbl_src")}</label>
        <textarea id="srcInput" rows="6" placeholder="${ui.srcLang === "sat" ? "ᱡᱚᱦᱟᱨ · जोहार · johar" : (ui.srcLang === "hi" ? "नमस्ते" : "Hello")}"></textarea>
        <div class="box-actions">
          <button class="btn" id="micBtn" data-act="mic">${ui.listen ? t("btn_stop") : (ui.liveTalk ? t("btn_live") : t("btn_mic"))}</button>
          <button class="btn ghost" data-act="speak-hi-side">♪ ${t("lang_hi")}</button>
          <button class="btn ghost" data-act="speak-sat-side">♪ ${t("lang_sat")}</button>
          <button class="btn ghost" data-act="clear">${t("btn_clear")}</button>
          ${ui.typeLang === "hi-phonetic" ? `<button class="btn ghost" data-act="hi-convert">${t("btn_hiconvert")}</button>` : ""}
        </div>
        <p class="hint" id="micHint">${caps.note}</p>
      </div>
      <button class="swap" data-act="swap" aria-label="${t("btn_swap")}">⇄</button>
      <div class="box">
        <label>${t("nav_trans")}</label>
        <div id="tgtOutput" aria-live="polite">—</div>
        <p id="tgtRom" class="rom"></p>
        <div class="box-actions">
          <button class="btn ghost" data-act="copy">${t("btn_copy")}</button>
          <button class="btn" data-act="speak-hi-side">♪ ${t("lang_hi")}</button>
          <button class="btn" data-act="speak-sat-side">♪ ${t("lang_sat")}</button>
          <button class="btn ghost" data-act="stop-speak">${t("btn_stop")}</button>
        </div>
      </div>
    </div>
    <div class="meta-row" id="confMeta"></div>
    <aside id="teachHelp" class="teach-help" hidden></aside>
    <div class="kb" id="kbWrap"></div>
    <p class="hint">${t("lbl_ex")}</p>
    <div class="examples">
      <button data-act="ex" data-s="sat" data-t="hi" data-ex="ᱡᱚᱦᱟᱨ">ᱡᱚᱦᱟᱨ</button>
      <button data-act="ex" data-s="sat" data-t="hi" data-ex="amak nutum chet">amak nutum chet</button>
      <button data-act="ex" data-s="hi" data-t="sat" data-ex="आपका नाम क्या है?">आपका नाम क्या है?</button>
      <button data-act="ex" data-s="en" data-t="sat" data-ex="What is your name?">What is your name?</button>
    </div>`;
}

function looksLikeAsk(text) {
  const t = String(text || "").trim();
  if (t.length < 6) return false;
  if (/[?？᱿]/.test(t)) return true;
  return /क्या|कौन|कहाँ|क्यों|कैसे|कब|कितना|बताओ|बताइए|समझाओ|अर्थ|मतलब|पाठ|कक्षा|त्योहार|राजधानी|who|what|why|how|meaning/i.test(t);
}

async function maybeTeachHelp(text) {
  const box = document.getElementById("teachHelp");
  if (!box) return;
  if (!looksLikeAsk(text) || !navigator.onLine) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  try {
    const res = await fetch("/api/ask?q=" + encodeURIComponent(text.trim().slice(0, 200)));
    const data = await res.json().catch(() => ({}));
    const hits = (data && data.hits) || [];
    if (!hits.length) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = `<h3>पाठ सहायता · कक्षा 1–5</h3>` + hits.map((h) => `
      <article>
        <p class="teach-meta">${h.cls ? "कक्षा " + esc(h.cls) : ""}${h.subject ? " · " + esc(h.subject) : ""}</p>
        <p>${esc(h.a)}</p>
        ${h.sat ? `<p class="satline">${esc(h.sat)}</p>` : ""}
      </article>`).join("");
  } catch {
    box.hidden = true;
  }
}

async function runTranslate() {
  const input = document.getElementById("srcInput");
  const out = document.getElementById("tgtOutput");
  const rom = document.getElementById("tgtRom");
  const meta = document.getElementById("confMeta");
  if (!input || !out) return;
  const text = input.value;
  if (!text.trim()) {
    out.textContent = "—";
    if (rom) rom.textContent = "";
    if (meta) meta.innerHTML = "";
    return;
  }
  out.textContent = "…";
  const from = ui.srcLang;
  const to = ui.tgtLang;
  const res = await translationService({ text, from, to, script: ui.script });
  out.textContent = res.text || "—";
  if (rom) rom.textContent = res.translit && ui.script !== "rom" ? res.translit : "";
  const pct = Math.round((res.conf || 0) * 100);
  const cls = pct >= 85 ? "high" : pct >= 50 ? "mid" : "low";
  const label = ({
    google: "Google Translate",
    "google-cloud": "Google Cloud",
    mymemory: "MyMemory",
    sarvam: "Sarvam AI",
    bhashini: "Bhashini",
    lexicon: "पाठ्यक्रम शब्दकोश",
    "local-dictionary": "स्थानीय शब्दकोश"
  })[res.provider || res.source] || (res.fallback ? "स्थानीय शब्दकोश" : "API");
  const mode = res.fallback
    ? `<span class="pill">${esc(label)}</span>`
    : `<span class="pill high">${esc(label)}</span>`;
  const offline = !navigator.onLine ? `<span class="pill mid">ऑफलाइन</span>` : "";
  meta.innerHTML = `${mode}${offline}<span class="pill ${cls}">विश्वसनीयता ${pct}%</span>
    <span class="note">${esc(res.note || "")}</span>
    ${res.unknown && res.unknown.length ? `<span class="note warn">अज्ञात: ${esc(res.unknown.join(", "))}</span>` : ""}`;
  maybeTeachHelp(text);
}

function paintOlKeys() {
  const host = document.getElementById("olKeys");
  if (!host) return;
  const letters = "ᱚᱛᱜᱝᱞᱟᱠᱡᱢᱣᱤᱥᱦᱧᱨᱩᱪᱫᱬᱭᱮᱯᱰᱱᱲᱳᱴᱵᱶᱷ".split("");
  const extra = ["ᱹ", "ᱸ", "ᱽ", " ", "᱾", "᱿", ..."᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙"];
  host.innerHTML = [...letters, ...extra].map((ch) =>
    `<button type="button" class="key ${ch === " " ? "space" : ""}" data-act="ol" data-ch="${ch === " " ? " " : esc(ch)}">${ch === " " ? "खाली" : ch}</button>`
  ).join("");
}

function paintHiKeys() {
  const host = document.getElementById("hiKeys");
  if (!host) return;
  const btn = (ch, extra = "") =>
    `<button type="button" class="key ${extra}" data-act="ol" data-ch="${esc(ch)}">${ch}</button>`;
  host.innerHTML =
    `<div class="key-row">${HI_KEYS.vowels.map((ch) => btn(ch)).join("")}</div>` +
    `<div class="key-row">${HI_KEYS.matras.map((ch) => btn(ch, "matra")).join("")}</div>` +
    HI_KEYS.rows.map((row) => `<div class="key-row">${row.map((ch) => btn(ch)).join("")}</div>`).join("") +
    `<div class="key-row">${HI_KEYS.extra.map((ch) => btn(ch)).join("")}${btn(" ", "space")}</div>`;
}

function paintKeyboard() {
  const host = document.getElementById("kbWrap");
  if (!host) return;
  const langs = TYPE_LANGS.map((t) =>
    `<button type="button" class="${ui.typeLang === t.id ? "on" : ""}" data-act="typelang" data-id="${esc(t.id)}">${esc(t.label)}</button>`
  ).join("");
  const hint = (TYPE_LANGS.find((t) => t.id === ui.typeLang) || {}).hint || "";
  let keys = "";
  if (ui.typeLang === "ol") keys = `<div class="keys" id="olKeys"></div>`;
  else if (ui.typeLang === "hi-keys") keys = `<div class="keys" id="hiKeys"></div>`;
  else if (ui.typeLang === "hi-phonetic") keys = `<p class="ime-preview" id="imePreview">फ़ोनेटिक: namaste → नमस्ते</p>`;
  host.innerHTML = `
    <div class="type-lang">
      <span class="type-lang-label">टाइप भाषा</span>
      <div class="seg wrap" role="group" aria-label="टाइप भाषा">${langs}</div>
      <p class="hint">${esc(hint)}</p>
      ${keys}
    </div>`;
  if (ui.typeLang === "ol") paintOlKeys();
  if (ui.typeLang === "hi-keys") paintHiKeys();
  updateImePreview();
}

function insertAtCursor(el, ch) {
  if (!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const piece = ch == null ? "" : String(ch);
  el.value = el.value.slice(0, start) + piece + el.value.slice(end);
  const pos = start + piece.length;
  try { el.setSelectionRange(pos, pos); } catch { /* noop */ }
  el.focus();
  ui.srcText = el.value;
  updateImePreview();
  runTranslate();
}

function updateImePreview() {
  const el = document.getElementById("imePreview");
  const src = document.getElementById("srcInput");
  if (!el || !src) return;
  const m = String(src.value).match(/([A-Za-z~]+)$/);
  el.textContent = m ? `${m[1]} → ${romanToHindi(m[1])}` : "फ़ोनेटिक: namaste → नमस्ते";
}

function bindSrcInput() {
  const src = document.getElementById("srcInput");
  if (!src) return;
  if (ui.srcText) src.value = ui.srcText;
  src.addEventListener("input", (e) => {
    if (ui.typeLang === "hi-phonetic" && (e.data === " " || e.inputType === "insertLineBreak")) {
      src.value = src.value.replace(/([A-Za-z~]+)(\s)$/u, (_, w, sp) => romanToHindi(w) + sp);
    }
    ui.srcText = src.value;
    updateImePreview();
    clearTimeout(bindSrcInput._t);
    bindSrcInput._t = setTimeout(() => runTranslate(), 280);
  });
}

/* ---------- PRACTICE (NCERT) ---------- */
function viewPractice() {
  const ns = ui.ncertState;

  // Base State: Select Class
  if (!ns.cls) {
    return `
      <header class="page-h">
        <h1>${t("nc_prac")}</h1>
        <p class="muted">${t("nc_prac_desc")}</p>
      </header>
      <div class="ncert-step">
        <h2>Select Class</h2>
        <div class="chip-row">
          ${[1, 2, 3, 4, 5].map(c => `<button class="btn ghost" data-act="nc-cls" data-val="${c}">Class ${c}</button>`).join("")}
        </div>
      </div>
    `;
  }

  const clsData = NCERT_DATA.find(d => d.cls === ns.cls) || { subjects: [] };

  // Select Subject
  if (!ns.sub) {
    return `
      <header class="page-h">
        <h1>Class ${ns.cls} Subjects</h1>
        <button class="btn ghost" data-act="nc-reset">← Back</button>
      </header>
      <div class="ncert-grid">
        ${clsData.subjects.map(s => `
          <button class="nc-card subject-card" data-act="nc-sub" data-val="${s.id}">
            <h3>${esc(s.en)}</h3>
            <p class="muted" style="margin-bottom:4px;">${esc(s.hi)}</p>
            ${s.sat ? `<p class="muted satline" style="color:var(--forest)">${esc(s.sat)}</p>` : ""}
          </button>
        `).join("")}
      </div>
    `;
  }

  const subData = clsData.subjects.find(s => s.id === ns.sub);

  // Select Lesson
  if (!ns.les) {
    return `
      <header class="page-h">
        <h1>${esc(subData.en)} · Class ${ns.cls}</h1>
        <button class="btn ghost" data-act="nc-resetsub">← Back to Subjects</button>
      </header>
      <div class="ncert-grid">
        ${subData.lessons.map((L, idx) => `
          <div class="nc-card lesson-card">
            <h3>Ch ${idx + 1}: ${esc(L.en)}</h3>
            <p class="muted" style="margin-bottom:4px;">अध्याय ${idx + 1}: ${esc(L.hi)}</p>
            ${L.sat ? `<p class="muted satline" style="margin-bottom:12px;color:var(--forest)">${idx + 1}: ${esc(L.sat)}</p>` : `<div style="height:12px;"></div>`}
            <div class="chip-row">
              ${L.pdf ? `<button class="btn ghost btn-sm" style="color:var(--primary); font-weight:600;" data-act="nc-les" data-mode="pdf" data-les="${L.id}">📖 ${ui.appLang === 'en' ? 'Book' : (ui.appLang === 'hi' ? 'किताब' : 'ᱯᱚᱛᱚᱵ')}</button>` : ""}
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="flash" data-les="${L.id}">Flashcards</button>
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="quiz" data-les="${L.id}">Quiz</button>
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="video" data-les="${L.id}">▶ Video</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
  const lesData = subData.lessons.find(l => l.id === ns.les);

  // Render Specific Modes
  if (ns.mode === "flash") return viewFlashcards(lesData);
  if (ns.mode === "quiz") return viewQuiz(lesData);
  if (ns.mode === "pdf") return viewPdfReader(lesData);
  if (ns.mode === "video") return viewShortVideo(lesData);

  return "";
}

function viewPdfReader(lesson) {
  const pdfUrl = (ui.ncertState.lang === 'en') ? lesson.pdf : (lesson.pdf_hi || lesson.pdf);
  return `
    <header class="page-h spread">
      <h1>📖 ${esc(lesson[ui.ncertState.lang] || lesson.en)}</h1>
      <button class="btn ghost btn-sm" data-act="nc-resetles">← Back</button>
    </header>
    <div style="width:100%; height: 75vh; border-radius:12px; overflow:hidden; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
      <iframe src="${pdfUrl}#toolbar=0&navpanes=0" width="100%" height="100%" style="border:none;"></iframe>
    </div>
  `;
}

function langToggleBtn() {
  return `<button class="btn ghost" data-act="nc-lang">${ui.ncertState.lang === "en" ? "Switch to Hindi (हिंदी)" : "Switch to English"}</button>`;
}

function viewFlashcards(lesson) {
  const ns = ui.ncertState;
  const cards = lesson.flashcards || [];
  if (!cards.length) return `<p>No flashcards found.</p><button data-act="nc-resetles" class="btn">Back</button>`;

  const current = cards[ns.quizIndex];
  const lang = ns.lang;
  return `
    <header class="page-h spread">
      <div>
        <h1>Flashcards: ${esc(lesson[lang])}</h1>
        <button class="btn ghost" data-act="nc-resetles">← Back to Lessons</button>
      </div>
      <div>${langToggleBtn()}</div>
    </header>
    
    <div class="flashcard-scene" data-act="nc-flip">
      <div class="flashcard ${ns.flipped ? "flipped" : ""}">
        <div class="flashcard-face flashcard-front">
          <p class="fc-count">Card ${ns.quizIndex + 1} of ${cards.length}</p>
          <div class="fc-content">
            <h2>${esc(current.q[lang])}</h2>
            <p class="hint">(Tap to flip)</p>
          </div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="fc-content">
            <h2 class="fc-answer">${esc(current.a[lang])}</h2>
          </div>
        </div>
      </div>
    </div>
    
    <div class="spread" style="margin-top:20px;">
      <button class="btn ghost" data-act="nc-prevcard" ${ns.quizIndex === 0 ? "disabled" : ""}>Previous</button>
      <button class="btn" data-act="nc-nextcard">
        ${ns.quizIndex === cards.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  `;
}

function viewQuiz(lesson) {
  const ns = ui.ncertState;
  const quizzes = lesson.quizzes || [];
  const lang = ns.lang;

  if (ns.finished) {
    return `
      <header class="page-h"><h1>Quiz Completed!</h1></header>
      <div class="card" style="text-align:center; padding: 40px 20px;">
        <h2>You scored ${ns.score} out of ${quizzes.length}</h2>
        <button class="btn" data-act="nc-resetles" style="margin-top: 20px;">Back to Lessons</button>
      </div>
    `;
  }

  const q = quizzes[ns.quizIndex];
  return `
    <header class="page-h spread">
      <div>
        <h1>Quiz: ${esc(lesson[lang])}</h1>
        <button class="btn ghost" data-act="nc-resetles">← Cancel</button>
      </div>
      <div>${langToggleBtn()}</div>
    </header>
    <div class="ncert-quiz-wrap">
      <p class="fc-count">Question ${ns.quizIndex + 1} of ${quizzes.length}</p>
      <h2>${esc(q.q[lang])}</h2>
      
      <div class="nc-options-wrap">
        ${q.options.map((opt, i) => `
          <button class="opt nc-opt" data-act="nc-ans" data-val="${i}">${esc(opt[lang])}</button>
        `).join("")}
      </div>
      
      <div id="nc-explain-box" hidden style="margin-top:20px; padding: 15px; border-radius: 12px; background: #fff8ea; border: 1px solid var(--line);">
        <h3 id="nc-result-txt" style="margin-top:0;"></h3>
        <p>${esc(q.explanation[lang])}</p>
        <button class="btn" data-act="nc-nextq" style="margin-top: 10px;">Next Question</button>
      </div>
    </div>
  `;
}

function viewShortVideo(lesson) {
  const isLocal = lesson.video.startsWith("LOCAL_");
  const vidSrc = isLocal ? lesson.video.replace("LOCAL_", "") : `https://www.youtube.com/embed/${lesson.video}?autoplay=1&rel=0`;

  const vidElem = isLocal
    ? `<video src="${vidSrc}" controls autoplay style="width: 100%; height: auto; max-height: 75vh; border-radius: 8px; background: #000; outline: none; border: 1px solid rgba(255,255,255,0.1);"></video>`
    : `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: #000;">
         <iframe src="${vidSrc}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
       </div>`;

  return `
    <header class="page-h spread">
      <h1>Video: ${esc(lesson[ui.ncertState.lang])}</h1>
      <button class="btn ghost btn-sm" data-act="nc-resetles">← Back</button>
    </header>
    <div class="nc-video-wrap" style="text-align:center; padding: 20px; background:var(--ink); border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      ${vidElem}
    </div>
  `;
}

/* ---------- PROGRESS ---------- */
function viewProgress() {
  const d = storage.get();
  const units = flatUnits();
  const lessons = allLessons();
  const done = Object.keys(d.completedLessons).length;
  const learned = Object.keys(d.wordsLearned).length;
  const acc = d.practice.attempts ? Math.round((d.practice.correct / d.practice.attempts) * 100) : 0;
  const classes = lessons.map((L) => {
    const n = L.units.length;
    const c = L.units.filter((u) => d.completedLessons[u.id]).length;
    const pct = Math.round((c / n) * 100);
    return `<div class="class-bar"><span>कक्षा ${L.cls}</span><div class="progress"><span style="width:${pct}%"></span></div><small>${c}/${n}</small></div>`;
  }).join("");
  const act = d.activity.length
    ? `<ul class="activity">${d.activity.slice(0, 8).map((a) => `<li>${a.kind === "lesson" ? "पाठ" : "अभ्यास"} · ${esc(a.label)}</li>`).join("")}</ul>`
    : `<p class="muted">अभी गतिविधि नहीं।</p>`;
  return `
    <header class="page-h"><h1>Progress · प्रगति</h1></header>
    <section class="stats">
      <article class="stat"><span class="stat-n">${d.streak.count}</span><span>लकीर</span></article>
      <article class="stat"><span class="stat-n">${done}</span><span>पाठ</span></article>
      <article class="stat"><span class="stat-n">${learned}</span><span>शब्द</span></article>
      <article class="stat"><span class="stat-n">${acc}%</span><span>सटीकता</span></article>
    </section>
    <article class="card"><h2>कक्षा प्रगति</h2>${classes}</article>
    <article class="card"><h2>हाल की गतिविधि</h2>${act}
      <p class="muted">यह डेटा इसी ब्राउज़र में localStorage में रहता है।</p></article>`;
}

/* ---------- TEACHER AUTH ---------- */
function viewTeacherAuth(isGlobal = false) {
  const state = JSON.parse(localStorage.getItem('vaani_teacher') || '{"status":"out", "email":""}');

  if (state.status === "out") {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('assets/hero.jpg') center/cover; padding: 20px;">
        <div class="card" id="t-auth-box" style="width: 100%; max-width: 450px; text-align: center; padding: 50px 30px; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);">
          <img src="assets/logo.png" alt="Vaani AI" style="width:70px; margin-bottom: 20px;" />
          <h2 style="margin-bottom: 10px; font-size:2rem; color:var(--forest);">Vaani AI Portal</h2>
          <p style="color:var(--ink-soft); margin-bottom: 30px; font-size:1.05rem;">Enter your verified educator email address to access the integrated dashboard.</p>
          <input type="email" id="t-email" class="trans-input" style="width:100%; margin-bottom: 20px; font-size:1.15rem; padding: 15px; border-radius: 8px; border:2px solid var(--wash); text-align:center;" placeholder="educator@school.edu.in" />
          <button class="btn" style="width:100%; background:var(--forest); color:#fff; font-size:1.15rem; padding: 15px;" onclick="
            const em = document.getElementById('t-email').value;
            if(!em.includes('@')) return alert('Please enter a valid email address.');
            this.innerText = 'Sending Link...';
            this.style.opacity = '0.7';
            setTimeout(() => {
              localStorage.setItem('vaani_teacher', JSON.stringify({status: 'sent', email: em}));
              window.location.reload();
            }, 1200);
          ">✉️ Send Verification Link</button>
        </div>
      </div>
    `;
  }

  if (state.status === "sent") {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px;">
        <div class="card" style="width: 100%; max-width: 450px; text-align: center; padding: 50px 30px; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.08);">
          <div style="background:var(--wash); width:80px; height:80px; margin: 0 auto 20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem;">✉️</div>
          <h2 style="margin-bottom: 15px;">Check Your Email</h2>
          <p style="color:var(--ink-soft); margin-bottom: 30px; line-height: 1.6; font-size: 1.05rem;">We just sent a magic login link to <br><strong style="color:var(--ink);">${esc(state.email)}</strong>.</p>
          
          <div style="background:#f4f4f4; padding:25px; border-radius:12px; border: 2px dashed #d0d0d0;">
             <p style="font-size:1.05rem; color:var(--forest); margin-bottom:15px; font-weight:700;">Please Enter Your Name</p>
             <input type="text" id="t-name" class="trans-input" autocomplete="off" style="width:100%; margin-bottom: 15px; font-size:1.15rem; padding: 12px; border-radius: 8px; border:2px solid #ccc; text-align:center;" placeholder="e.g. Rahul Sharma" />
             <button class="btn" style="width:100%; background:var(--forest); color:#fff; font-size: 1.05rem; padding: 12px;" onclick="
               const n = document.getElementById('t-name').value || 'Educator';
               localStorage.setItem('vaani_teacher', JSON.stringify({status: 'in', email: '${esc(state.email)}', name: n}));
               window.location.reload();
             ">🚀 Continue to Dashboard</button>
          </div>
          
          <button class="btn ghost" style="margin-top:25px; font-size:1.05rem;" onclick="
            localStorage.setItem('vaani_teacher', JSON.stringify({status: 'out', email: ''}));
            window.location.reload();
          ">← Use a different email</button>
        </div>
      </div>
    `;
  }

  if (state.status === "in" && !isGlobal) {
    return `
      <header class="page-h spread">
         <h1>👨‍🏫 Teacher Dashboard</h1>
         <button class="btn ghost" onclick="
            localStorage.setItem('vaani_teacher', JSON.stringify({status: 'out', email: ''}));
            window.location.reload();
         ">Sign Out</button>
      </header>
      
      <div class="dash-grid-4" style="margin-bottom:20px;">
        <article class="stat card"><span class="stat-n" style="color:var(--primary);">42</span><span>Active Students</span></article>
        <article class="stat card"><span class="stat-n" style="color:var(--primary);">88%</span><span>Avg. Quiz Score</span></article>
        <article class="stat card"><span class="stat-n">15</span><span>Interventions</span></article>
        <article class="stat card"><span class="stat-n" style="color:var(--success)">2.4h</span><span>Avg. Learn Time</span></article>
      </div>

      <div class="card" style="padding: 40px; text-align:center; background: #fff8ea; border-radius:12px; border: 1px solid var(--wash); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
         <h2 style="color: var(--forest);">Welcome back, ${esc(state.name || state.email)}!</h2>
         <p style="color: var(--ink-soft); font-size:1.1rem; margin-top:15px; line-height: 1.6;">Advanced educator analytics, student progression trees, and curriculum bulk-generation tools will be available in the enterprise release of Vaani AI.</p>
         <button class="btn outline" style="margin-top: 25px;" disabled>Generate Class Report (Coming Soon)</button>
      </div>
    `;
  }
}

/* ---------- SETTINGS ---------- */
function viewSettings() {
  const keys = storage.getApiKeys();
  return `
    <header class="page-h"><h1>API Architecture Settings</h1></header>
    <p class="muted" style="margin-bottom: 20px;">Configuration for the VernacLearn Backend Services. Provided keys will override internal variables natively on HTTP fetch payloads.</p>
    
    <div class="card" style="background:#1e1e1e; color:#d4d4d4; padding:24px; border:1px solid #333; overflow-x:auto;">
      <div class="vn-tree">
        
        <!-- API Root -->
        <div class="vn-node root">
          <span class="vn-label">VernacLearn</span>
        </div>
        
        <!-- TranslationService -->
        <div class="vn-connector">│</div>
        <div class="vn-node child">
          <span class="vn-branch">├── </span><span class="vn-label">TranslationService</span>
        </div>
        <div class="vn-connector">│&nbsp;&nbsp;&nbsp;└── <span class="vn-label param">Sarvam</span></div>
        <div class="vn-input-row">
           │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-sarvam" value="${esc(keys.sarvam || "")}" placeholder="Enter SARVAM_API_KEY..." />
        </div>
        
        <!-- STTService -->
        <div class="vn-connector">│</div>
        <div class="vn-node child">
          <span class="vn-branch">├── </span><span class="vn-label">STTService</span>
        </div>
        <div class="vn-connector">│&nbsp;&nbsp;&nbsp;└── <span class="vn-label param">Indic Conformer / Sarvam</span></div>
        <div class="vn-input-row">
           │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-hf-stt" value="${esc(keys.hf_stt || "")}" placeholder="Enter HF_STT_TOKEN..." />
        </div>

        <!-- TTSService -->
        <div class="vn-connector">│</div>
        <div class="vn-node child">
          <span class="vn-branch">├── </span><span class="vn-label">TTSService</span>
        </div>
        <div class="vn-connector">│&nbsp;&nbsp;&nbsp;└── <span class="vn-label param">Indic Parler-TTS</span></div>
        <div class="vn-input-row">
           │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-hf-tts" value="${esc(keys.hf_tts || "")}" placeholder="Enter HF_TTS_TOKEN..." />
        </div>

        <!-- DictionaryService -->
        <div class="vn-connector">│</div>
        <div class="vn-node child">
          <span class="vn-branch">├── </span><span class="vn-label">DictionaryService</span> <span class="muted" style="margin-left: 10px; font-size:0.8rem;">(Static Native Lexicon)</span>
        </div>

        <!-- OfflineService -->
        <div class="vn-connector">│</div>
        <div class="vn-node child">
          <span class="vn-branch">└── </span><span class="vn-label">OfflineService</span> <span class="muted" style="margin-left: 10px; font-size:0.8rem;">(IndexedDB / PWA Worker Cache)</span>
        </div>

      </div>
    </div>
    
    <button class="btn" data-act="save-keys" style="margin-top: 20px; width: 100%;">Commit Overrides</button>
  `;
}

/* ---------- RENDER / EVENTS ---------- */
function render() {
  const r = route();
  const root = $app();

  // Enforce Global Barrier
  const authState = JSON.parse(localStorage.getItem('vaani_teacher') || '{"status":"out", "email":""}');
  const globalHeader = document.querySelector('header');
  const deskNav = document.querySelector('nav.desk');
  const bottomNav = document.querySelector('nav.bottom-nav');

  if (authState.status !== "in") {
    if (globalHeader) globalHeader.style.display = 'none';
    if (deskNav) deskNav.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';

    root.style.margin = '0';
    root.style.padding = '0';
    root.innerHTML = viewTeacherAuth(true);
    return;
  } else {
    if (globalHeader) globalHeader.style.display = 'flex';
    if (deskNav) deskNav.style.display = 'block';
    if (bottomNav) bottomNav.style.display = 'flex';
    root.style.margin = '';
    root.style.padding = '';
  }

  navActive(r.name === "" ? "home" : r.name);
  let html = "";
  if (r.name === "learn" && r.b) html = viewLesson(r.a, r.b);
  else if (r.name === "learn") html = viewLearnList(r.a);
  else if (r.name === "dictionary") html = viewDictionary(r.a);
  else if (r.name === "translate") html = viewTranslate();
  else if (r.name === "practice") html = viewPractice();
  else if (r.name === "progress") html = viewProgress();
  else if (r.name === "teacher") html = viewTeacherAuth();
  else if (r.name === "settings") html = viewSettings();
  else html = viewHome();
  root.innerHTML = html;
  root.querySelectorAll("button:not([type])").forEach((b) => { b.type = "button"; });

  document.querySelectorAll("[data-i18n]").forEach(e => {
    e.textContent = window.t(e.dataset.i18n);
  });

  if (r.name === "translate") {
    paintKeyboard();
    bindSrcInput();
    const src = document.getElementById("srcInput");
    if (src && ui.srcText) src.value = ui.srcText;
    if (ui.srcText) runTranslate();
  }
  if (r.name === "dictionary") {
    const inp = document.getElementById("dictQ");
    if (inp) {
      inp.addEventListener("input", (e) => {
        if (ui.typeLang === "hi-phonetic" && (e.data === " " || e.inputType === "insertLineBreak")) {
          inp.value = inp.value.replace(/([A-Za-z~]+)(\s)$/u, (_, w, sp) => romanToHindi(w) + sp);
        }
        ui.dictQ = inp.value;
      });
      inp.addEventListener("change", () => {
        ui.dictQ = inp.value;
        storage.pushSearch(inp.value.trim());
        render();
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { storage.pushSearch(inp.value.trim()); render(); }
      });
    }
  }
  onlineBanner();
}

function onAct(e) {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  e.preventDefault();
  const act = t.dataset.act;
  if (act === "speak" || act === "speak-hi") speak(t.dataset.say, { lang: "hi-IN" });
  if (act === "speak-sat") speak(t.dataset.say, { lang: "sat-IN" });
  if (act === "speak-hi-side") speak(currentHiText(), { lang: "hi-IN" });
  if (act === "speak-sat-side") speak(currentSatText(), { lang: "sat-IN" });
  if (act === "stop-speak") stopSpeak();

  if (act === "save-keys") {
    storage.setApiKey("sarvam", document.getElementById("ak-sarvam").value);
    storage.setApiKey("hf_stt", document.getElementById("ak-hf-stt").value);
    storage.setApiKey("hf_tts", document.getElementById("ak-hf-tts").value);
    toast("Overrides successfully deployed to VernacLearn proxy!");
    render();
  }

  if (act === "complete") {
    storage.completeLesson(t.dataset.id);
    (t.dataset.words || "").split(",").filter(Boolean).forEach((id) => storage.learnWord(id));
    toast("पाठ सहेजा गया");
    render();
  }
  if (act === "quick") {
    const ok = t.dataset.ok === "true";
    t.classList.add(ok ? "good" : "bad");
    const h = document.getElementById("quickHint");
    if (h) h.textContent = ok ? "सही — जोहार!" : "फिर देखें।";
    if (ok && t.dataset.word) storage.learnWord(t.dataset.word);
  }
  if (act === "topic") { ui.dictTopic = t.dataset.id; render(); }
  if (act === "nc-mode") {
    ui.ncertState.mode = t.dataset.val;
    render();
    if (t.dataset.val === "video") {
      const vid = document.querySelector('video');
      if (vid) {
        if (vid.requestFullscreen) vid.requestFullscreen().catch(e => console.log(e));
        else if (vid.webkitRequestFullscreen) vid.webkitRequestFullscreen();
      }
    }
  }
  if (act === "favonly") { ui.favOnly = !ui.favOnly; render(); }
  if (act === "fav") { storage.toggleFav(t.dataset.id); render(); }
  if (act === "learned") { storage.learnWord(t.dataset.id); toast("शब्द जोड़ा गया"); render(); }
  if (act === "searchset") { ui.dictQ = t.dataset.q; render(); }
  if (act === "src") {
    ui.srcLang = t.dataset.id;
    if (ui.srcLang === "hi" && ui.typeLang === "ol") ui.typeLang = "hi-phonetic";
    if (ui.srcLang === "sat" && ui.typeLang.startsWith("hi")) ui.typeLang = "ol";
    if (ui.srcLang === "en") ui.typeLang = "en";
    render();
  }
  if (act === "tgt") {
    ui.tgtLang = t.dataset.id;
    render();
  }
  if (act === "script") { ui.script = t.dataset.id; render(); }
  if (act === "typelang") { ui.typeLang = t.dataset.id; render(); }
  if (act === "hi-convert") {
    const src = document.getElementById("srcInput");
    if (src) {
      src.value = src.value.replace(/[A-Za-z~]+/g, (w) => romanToHindi(w));
      ui.srcText = src.value;
      updateImePreview();
      runTranslate();
    }
  }
  if (act === "swap") {
    const src = document.getElementById("srcInput");
    const tgt = document.getElementById("tgtOutput");
    const prev = tgt && tgt.textContent !== "—" ? tgt.textContent : "";
    const tmp = ui.srcLang;
    ui.srcLang = ui.tgtLang;
    ui.tgtLang = tmp;

    if (ui.srcLang === "hi") ui.typeLang = "hi-phonetic";
    else if (ui.srcLang === "sat" && ui.typeLang.startsWith("hi")) ui.typeLang = "ol";
    else if (ui.srcLang === "en") ui.typeLang = "en";

    ui.srcText = prev;
    render();
    const nsrc = document.getElementById("srcInput");
    if (nsrc) { nsrc.value = prev; ui.srcText = prev; runTranslate(); }
  }
  if (act === "clear") {
    const src = document.getElementById("srcInput");
    if (src) { src.value = ""; ui.srcText = ""; runTranslate(); }
  }
  if (act === "copy") {
    const t2 = document.getElementById("tgtOutput");
    if (t2 && navigator.clipboard) navigator.clipboard.writeText(t2.textContent).then(() => toast("कॉपी हो गया"));
  }
  if (act === "speak-out") speak(currentSatText() || currentHiText(), { lang: ui.srcLang === "hi" || ui.tgtLang === "hi" ? "hi-IN" : "sat-IN" });
  if (act === "ol") {
    insertAtCursor(document.getElementById("srcInput"), t.dataset.ch);
  }
  if (act === "ex") {
    ui.srcLang = t.dataset.s;
    ui.tgtLang = t.dataset.t;
    render();
    const src = document.getElementById("srcInput");
    if (src) { src.value = t.dataset.ex; runTranslate(); }
  }
  if (act === "mic") toggleMic();
  if (act === "live-talk") {
    ui.liveTalk = !ui.liveTalk;
    if (ui.liveTalk) {
      ui.srcLang = "hi";
      ui.tgtLang = "sat";
      ui.typeLang = "hi-phonetic";
    }
    if (ui.listen) stopAllMic();
    render();
  }
  if (act === "start-pr") startPractice(t.dataset.cls);
  if (act === "ans") answerPractice(t.dataset.v, t);
  if (act === "mleft") {
    ui.practice.pick = t.dataset.v;
    $app().querySelectorAll("[data-act=mleft]").forEach((x) => x.classList.toggle("on", x === t));
  }

  // NCERT ACTIONS
  const ns = ui.ncertState;
  if (act === "nc-cls") { ns.cls = parseInt(t.dataset.val, 10); ns.sub = null; ns.les = null; ns.mode = null; render(); }
  if (act === "nc-sub") { ns.sub = t.dataset.val; ns.les = null; ns.mode = null; render(); }
  if (act === "nc-les") {
    ns.les = t.dataset.les;
    ns.mode = t.dataset.mode;
    ns.quizIndex = 0; ns.score = 0; ns.flipped = false; ns.finished = false;
    render();
  }
  if (act === "nc-reset") { ns.cls = null; ns.sub = null; ns.les = null; ns.mode = null; render(); }
  if (act === "nc-resetsub") { ns.sub = null; ns.les = null; ns.mode = null; render(); }
  if (act === "nc-resetles") { ns.les = null; ns.mode = null; ns.finished = false; render(); }
  if (act === "nc-lang") { ns.lang = ns.lang === "en" ? "hi" : "en"; render(); }
  if (act === "nc-flip") { ns.flipped = !ns.flipped; render(); }
  if (act === "nc-prevcard") { if (ns.quizIndex > 0) { ns.quizIndex--; ns.flipped = false; render(); } }
  if (act === "nc-nextcard") {
    const L = NCERT_DATA.find(d => d.cls === ns.cls).subjects.find(s => s.id === ns.sub).lessons.find(l => l.id === ns.les);
    if (ns.quizIndex < L.flashcards.length - 1) { ns.quizIndex++; ns.flipped = false; render(); }
    else { ns.mode = null; ns.les = null; render(); }
  }
  if (act === "nc-ans") {
    if (t.classList.contains("done")) return; // Prevent double click
    const L = NCERT_DATA.find(d => d.cls === ns.cls).subjects.find(s => s.id === ns.sub).lessons.find(l => l.id === ns.les);
    const q = L.quizzes[ns.quizIndex];
    const isCorrect = q.options[Number(t.dataset.val)].isCorrect;

    t.classList.add(isCorrect ? "good" : "bad");
    $app().querySelectorAll(".nc-opt").forEach(btn => btn.classList.add("done"));
    if (isCorrect) ns.score++;
    else {
      const correctIdx = q.options.findIndex(o => o.isCorrect);
      $app().querySelector(`[data-val="${correctIdx}"]`).classList.add("good");
    }

    const box = document.getElementById("nc-explain-box");
    const txt = document.getElementById("nc-result-txt");
    txt.textContent = isCorrect ? "Correct! ✅" : "Incorrect ❌";
    txt.style.color = isCorrect ? "var(--good)" : "var(--bad)";
    box.hidden = false;
  }
  if (act === "nc-nextq") {
    const L = NCERT_DATA.find(d => d.cls === ns.cls).subjects.find(s => s.id === ns.sub).lessons.find(l => l.id === ns.les);
    if (ns.quizIndex < L.quizzes.length - 1) {
      ns.quizIndex++;
      render();
    } else {
      ns.finished = true;
      render();
    }
  }

  if (act === "mright") {
    const p = ui.practice;
    const q = p.items[p.i];
    const left = p.pick;
    if (!left) return toast("पहले बायाँ शब्द चुनें");
    const pair = q.pairs.find((x) => x.ol === left);
    const ok = pair && pair.hi === t.dataset.v;
    t.classList.add(ok ? "good" : "bad");
    if (ok) {
      q.pairs = q.pairs.filter((x) => x.ol !== left);
      q._left = q._left.filter((x) => x !== left);
      q._right = q._right.filter((x) => x !== t.dataset.v);
      p.pick = null;
      if (!q.pairs.length) {
        p.score++;
        setTimeout(() => { p.i++; if (p.i >= p.items.length) { p.done = true; storage.recordPractice(p.score, p.items.length, "mixed"); } render(); }, 400);
      } else render();
    }
  }
}

function setMicUi(on, message) {
  const btn = document.getElementById("micBtn");
  const hint = document.getElementById("micHint");
  const live = document.getElementById("liveBtn");
  if (btn) {
    btn.classList.toggle("live", !!on);
    btn.textContent = on ? "रोकें" : (ui.liveTalk ? "लाइव शुरू" : "माइक");
  }
  if (live) live.classList.toggle("live", !!ui.liveTalk);
  if (hint && message) hint.textContent = message;
}

function seenNorm(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeSpokenHindi(text) {
  let t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (/[\u0900-\u097f]/.test(t)) return t;
  if (!/[A-Za-z]/.test(t)) return t;
  return t.replace(/[A-Za-z~']+/g, (w) => romanToHindi(w));
}

function isJunkTranscript(text) {
  const n = seenNorm(text);
  if (!n || n.length < 2) return true;
  if (micIsMuted()) return true;
  if (lastEcho) {
    const echo = seenNorm(lastEcho);
    if (echo && (n === echo || echo.includes(n) || n.includes(echo))) return true;
  }
  const words = n.split(" ").filter(Boolean);
  const en = words.filter((w) => /^(this|that|the|is|are|a|an|to|and|as|well|correct|please|okay|ok|yes|uh|um|hmm|you|it)$/.test(w));
  if (!/[\u0900-\u097f\u1c50-\u1c7f]/.test(text) && en.length >= 2 && en.length / words.length >= 0.5) return true;
  return false;
}

function appendSrc(text) {
  const bit = String(text || "").trim();
  if (!bit) return false;
  const src = document.getElementById("srcInput");
  if (!src) return false;
  const cur = src.value || "";
  if (seenNorm(cur).endsWith(seenNorm(bit))) return false;
  if (seenNorm(cur).includes(seenNorm(bit)) && bit.length < 24) return false;
  src.value = (cur ? cur.replace(/\s+$/, "") + " " : "") + bit;
  ui.srcText = src.value;
  return true;
}

let lastEcho = "";
let echoLock = false;
async function afterSpeech(text) {
  if (micIsMuted() || echoLock) return;
  const cleaned = normalizeSpokenHindi(text);
  if (isJunkTranscript(cleaned) || isJunkTranscript(text)) return;
  if (!appendSrc(cleaned)) return;
  await runTranslate();
  if (ui.liveTalk && ui.echoSat) {
    const res = await translationService({ text: cleaned, from: "hi", to: "sat", script: ui.script });
    const sat = String(res && res.text || "").trim();
    if (sat && sat !== "—" && sat !== lastEcho) {
      lastEcho = sat;
      echoLock = true;
      try {
        await speak(sat, { lang: "sat-IN" });
      } finally {
        echoLock = false;
      }
    }
  }
}

function stopAllMic() {
  ui.listen = false;
  stopListen();
  stopChunkLoop();
  releaseMic();
  setMicUi(false, "माइक बंद।");
}

async function toggleMic() {
  if (ui.listen) {
    stopAllMic();
    setMicUi(false, "माइक बंद। फिर से बोलने के लिए माइक दबाएँ।");
    return;
  }
  if (ui.liveTalk) {
    ui.srcLang = "hi";
    ui.tgtLang = "sat";
    ui.typeLang = "hi-phonetic";
  }
  setMicUi(false, "माइक चालू हो रहा है… ब्राउज़र पूछे तो अनुमति दें।");
  if (!hasWebSpeech()) {
    try {
      await requestMic();
    } catch (e) {
      const msg = micErrorMessage(e);
      setMicUi(false, msg);
      toast(msg);
      if (e && (e.error === "unsupported" || e.error === "insecure")) return;
    }
  }
  ui.listen = true;
  const live = !!ui.liveTalk;
  setMicUi(true, live
    ? "लाइव चल रहा है — हिंदी में बोलते रहें।"
    : "सुन रहे हैं… हिंदी में बोलिए।");

  listen({
    lang: "hi-IN",
    keepAlive: true,
    score: scoreAgainstLexicon,
    onResult: (text) => { afterSpeech(text); },
    onInterim: (t) => {
      if (micIsMuted()) return;
      const h = document.getElementById("micHint");
      if (h) h.textContent = (live ? "लाइव: " : "सुन रहे हैं: ") + t;
    },
    onError: (e) => {
      if (!ui.listen) return;
      const code = e && e.error;
      if (code === "not-allowed" || code === "service-not-allowed" || code === "SecurityError") {
        const msg = micErrorMessage(e);
        toast(msg);
        stopAllMic(msg);
      }
    },
    onEnd: () => { }
  });

  if (navigator.onLine && !hasWebSpeech()) {
    startChunkLoop({
      lang: "hi-IN",
      ms: live ? 4500 : 5000,
      onText: (text) => { afterSpeech(text); }
    }).catch((e) => {
      setMicUi(true, micErrorMessage(e));
    });
  }
}

function boot() {
  storage.touchStreak();
  const root = document.getElementById("frame") || document.body;

  const langSel = document.getElementById("uiLangSelect");
  if (langSel) {
    langSel.value = ui.appLang;
    langSel.addEventListener("change", () => {
      ui.appLang = langSel.value;
      localStorage.setItem("vaani_uilang", ui.appLang);
      render();
    });
  }

  root.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (a && a.getAttribute("href")) {
      e.preventDefault();
      go(a.getAttribute("href"));
      return;
    }
    onAct(e);
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("online", onlineBanner);
  window.addEventListener("offline", onlineBanner);
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => { });
  }
}

boot();
