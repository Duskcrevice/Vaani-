äæimport { DICTIONARY, TOPICS, relatedWords, exampleFor } from "../data/dictionary.js";
import { curriculum } from "./curriculum.js";
import { OL_LETTERS } from "../data/olchiki.js";
import { buildPracticeSet } from "../data/exercises.js";
import { NCERT_DATA } from "../data/ncert.js?v=3";
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
  return {
    name: p[0] || "home",
    a: p[1] || "",
    b: decodeURIComponent(p[2] || ""),
    c: decodeURIComponent(p[3] || ""),
    d: decodeURIComponent(p[4] || "")
  };
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
  return `<span class="speak-pair" role="group" aria-label="à¤¸à¥à¤¨à¥‡à¤‚">
    <button type="button" class="icon speak-hi" data-act="speak-hi" data-say="${h}" title="à¤¹à¤¿à¤‚à¤¦à¥€ à¤†à¤µà¤¾à¤œà¤¼" aria-label="à¤¹à¤¿à¤‚à¤¦à¥€ à¤¸à¥à¤¨à¥‡à¤‚">à¤¹à¤¿</button>
    <button type="button" class="icon speak-sat" data-act="speak-sat" data-say="${s}" title="à¤¸à¤‚à¤¤à¤¾à¤²à¥€ à¤†à¤µà¤¾à¤œà¤¼" aria-label="à¤¸à¤‚à¤¤à¤¾à¤²à¥€ à¤¸à¥à¤¨à¥‡à¤‚">á±š</button>
  </span>`;
}

function currentHiText() {
  const src = document.getElementById("srcInput");
  const tgt = document.getElementById("tgtOutput");
  if (ui.srcLang === "hi") return (src && src.value) || "";
  const t = tgt && tgt.textContent !== "â€”" ? tgt.textContent : "";
  return t || "";
}

function currentSatText() {
  const src = document.getElementById("srcInput");
  const tgt = document.getElementById("tgtOutput");
  if (ui.srcLang === "sat") return (src && src.value) || "";
  const t = tgt && tgt.textContent !== "â€”" ? tgt.textContent : "";
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
    ? activities.map(a => `<div class="dash-recent-item">âœ“ ${a.kind === "lesson" ? "Completed a lesson" : "Completed practice"}: <strong>${esc(a.label)}</strong></div>`).join("")
    : `<div class="dash-recent-item muted">No recent activity yet. Start learning!</div>`;

  return `
  <div class="dashboard-wrap">
    
    <!-- 1. Restored Tribal Art Hero -->
    <section class="card" style="display: flex; gap: 20px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      <div class="hero-content" style="flex:1; min-width: 250px;">
        <p class="muted">á±¡á±šá±¦á±Ÿá±¨ Â· Vaani AI</p>
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
        <a class="btn outline" style="color:var(--primary); font-weight:600;" href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">ğŸ“š Portal: Download Official NCERT Books (Class 1-12 | English/Hindi/Urdu)</a>
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
          <span class="dash-action-icon">á±š</span>
          <h3>${t("nav_learn")}</h3>
          <p>${t("desc_learn")}</p>
          <span class="dash-action-link">${t("btn_start_learn")}</span>
        </a>
        <a class="dash-action-card" href="#/dictionary">
          <span class="dash-action-icon">à´…</span>
          <h3>${t("nav_dict")}</h3>
          <p>${t("desc_dict")}</p>
          <span class="dash-action-link">${t("btn_open_dict")}</span>
        </a>
        <a class="dash-action-card" href="#/translate">
          <span class="dash-action-icon">â‡„</span>
          <h3>${t("nav_trans")}</h3>
          <p>${t("desc_trans")}</p>
          <span class="dash-action-link">${t("nav_trans")}</span>
        </a>
        <a class="dash-action-card" href="#/practice">
          <span class="dash-action-icon">âœ</span>
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
  const letters = u.letters ? OL_LETTERS.map((l) => `<div class="letter" aria-label="${esc(l.name)}"><b>${esc(l.ol)}</b><small>${esc(l.name)} Â· ${esc(l.rom)}</small>${dualSpeak(l.hi, l.ol)}</div>`).join("") : "";
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
      <h3>à¤…à¤­à¥à¤¯à¤¾à¤¸</h3>
      <p>${esc(quizWord.ol)} à¤•à¤¾ à¤…à¤°à¥à¤¥ à¤šà¥à¤¨à¥‡à¤‚</p>
      <div class="opts">${opts.map((o) => `<button class="opt" data-act="quick" data-ok="${o === quizWord.hi0}" data-word="${esc(quizWord.id)}">${esc(o)}</button>`).join("")}</div>
      <p class="hint" id="quickHint"></p>
    </div>`;
  })() : "";

  return `
    <p class="crumb"><a href="#/learn/${u.cls}">à¤•à¤•à¥à¤·à¤¾ ${u.cls}</a> Â· à¤ªà¤¾à¤ </p>
    <article class="card lesson-view">
      <header class="spread">
        <div>
          <h1>${esc(u.hi)}</h1>
          <p class="satline">${esc(u.sat)}</p>
        </div>
        <span class="badge ${done ? "ok" : ""}">${done ? "à¤ªà¥‚à¤°à¥à¤£" : "à¤…à¤ªà¥‚à¤°à¥à¤£"}</span>
      </header>
      <p class="prose">${esc(u.body).replace(/\n/g, "<br>")}</p>
      ${letters ? `<div class="letters">${letters}</div>` : ""}
      <div class="word-row">${wordCards}</div>
      ${ex ? `<blockquote class="example"><span class="ol-md">${esc(ex.ol)}</span><span class="rom">${esc(ex.rom)}</span><span>${esc(ex.hi)}</span>
        ${dualSpeak(ex.hi, ex.ol)}</blockquote>` : ""}
      ${quiz}
      <div class="spread actions">
        ${prev ? `<a class="btn ghost" href="#/learn/${prev.cls}/${prev.id}">â† ${esc(prev.hi)}</a>` : `<span></span>`}
        <button class="btn" data-act="complete" data-id="${esc(u.id)}" data-words="${esc(words.map((w) => w.id).join(","))}">${done ? "à¤«à¤¿à¤° à¤¸à¥‡ à¤ªà¥‚à¤°à¥à¤£ à¤šà¤¿à¤¹à¥à¤¨à¤¿à¤¤ à¤•à¤°à¥‡à¤‚" : "à¤ªà¤¾à¤  à¤ªà¥‚à¤°à¤¾ à¤¹à¥à¤†"}</button>
        ${next ? `<a class="btn" href="#/learn/${next.cls}/${next.id}">${esc(next.hi)} â†’</a>` : `<a class="btn ghost" href="#/practice">à¤…à¤­à¥à¤¯à¤¾à¤¸</a>`}
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
  const topics = `<button class="chip ${ui.dictTopic === "all" ? "on" : ""}" data-act="topic" data-id="all">à¤¸à¤­à¥€</button>` +
    TOPICS.map((t) => `<button class="chip ${ui.dictTopic === t.id ? "on" : ""}" data-act="topic" data-id="${t.id}">${esc(t.hi)}</button>`).join("");
  const recent = d.recentSearch.length
    ? `<div class="chip-row muted-row">à¤¹à¤¾à¤² à¤•à¥€ à¤–à¥‹à¤œ: ${d.recentSearch.map((s) => `<button class="chip" data-act="searchset" data-q="${esc(s)}">${esc(s)}</button>`).join("")}</div>` : "";

  const detail = open ? wordDetail(open, d) : "";
  const grid = rows.slice(0, 120).map((w) => `
    <a class="wcard dict ${d.favorites.includes(w.id) ? "fav" : ""}" href="#/dictionary/${encodeURIComponent(w.id)}">
      <span class="w-sat">${esc(w.ol)}</span>
      <span class="rom">${esc(w.rom0)}</span>
      <span class="w-hi">${esc(w.hi0)}</span>
      <span class="w-meta">${esc(w.pos.hi)} Â· à¤•à¤•à¥à¤·à¤¾ ${w.cls}</span>
    </a>`).join("");

  return `
    <header class="page-h"><h1>Dictionary Â· á±Ÿá±¹á±²á±Ÿá±¹</h1>
      <p class="muted">à¤“à¤² à¤šà¤¿à¤•à¤¿, à¤°à¥‹à¤®à¤¨ à¤¯à¤¾ à¤¹à¤¿à¤‚à¤¦à¥€ à¤¸à¥‡ à¤–à¥‹à¤œà¥‡à¤‚à¥¤ ${rows.length} à¤¶à¤¬à¥à¤¦</p></header>
    <div class="filters">
      <label class="sr-only" for="dictQ">à¤¶à¤¬à¥à¤¦ à¤–à¥‹à¤œ</label>
      <input id="dictQ" type="search" lang="${ui.typeLang.startsWith("hi") ? "hi" : "en"}" value="${esc(ui.dictQ)}" placeholder="á±¡á±šá±¦á±Ÿá±¨ Â· johar Â· namaste / à¤¨à¤®à¤¸à¥à¤¤à¥‡" />
      <button class="chip ${ui.favOnly ? "on" : ""}" data-act="favonly">â˜… à¤ªà¤¸à¤‚à¤¦à¥€à¤¦à¤¾</button>
      <button class="chip ${ui.typeLang === "hi-phonetic" ? "on" : ""}" data-act="typelang" data-id="hi-phonetic">à¤¹à¤¿à¤‚à¤¦à¥€ à¤Ÿà¤¾à¤‡à¤ª</button>
      <button class="chip ${ui.typeLang === "en" ? "on" : ""}" data-act="typelang" data-id="en">English</button>
    </div>
    <div class="chip-row scroll">${topics}</div>
    ${recent}
    ${detail}
    <div class="word-grid">${grid || `<p class="muted">à¤•à¥‹à¤ˆ à¤¶à¤¬à¥à¤¦ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤</p>`}</div>`;
}

function wordDetail(w, d) {
  const fav = d.favorites.includes(w.id);
  const rel = relatedWords(w);
  const ex = exampleFor(w);
  return `<article class="card detail">
    <div class="spread">
      <div>
        <p class="ol-lg">${esc(w.ol)}</p>
        <p class="rom">${esc(w.rom0)} Â· ${esc(w.dev)}</p>
      </div>
      <div class="icon-col">
        ${dualSpeak(w.hi0, w.dev || w.ol)}
        <button class="icon ${fav ? "on" : ""}" data-act="fav" data-id="${esc(w.id)}" aria-pressed="${fav}" aria-label="à¤ªà¤¸à¤‚à¤¦à¥€à¤¦à¤¾">â˜…</button>
      </div>
    </div>
    <p class="hi-lg">${esc(w.hi0)}${w.en ? " Â· " + esc(w.en) : ""}</p>
    <p class="muted">${esc(w.pos.hi)} (${esc(w.pos.en)}) Â· à¤•à¤•à¥à¤·à¤¾ ${w.cls} Â· ${esc((TOPICS.find((t) => t.id === w.topic) || {}).hi || w.topic)}</p>
    ${ex ? `<blockquote class="example"><span>${esc(ex.ol)}</span><span class="rom">${esc(ex.rom)}</span><span>${esc(ex.hi)}</span>${dualSpeak(ex.hi, ex.ol)}</blockquote>` : ""}
    ${rel.length ? `<p class="muted">à¤¸à¤‚à¤¬à¤‚à¤§à¤¿à¤¤</p><div class="chip-row">${rel.map((r) => `<a class="chip" href="#/dictionary/${encodeURIComponent(r.id)}">${esc(r.ol)} Â· ${esc(r.hi0)}</a>`).join("")}</div>` : ""}
    <button class="btn ghost" data-act="learned" data-id="${esc(w.id)}">à¤¸à¥€à¤–à¤¾ à¤šà¤¿à¤¹à¥à¤¨à¤¿à¤¤ à¤•à¤°à¥‡à¤‚</button>
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
      <span style="font-size: 1.1rem; padding-top: 3px; color: var(--ink-soft); font-weight: 700;">â†’</span>
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
        <textarea id="srcInput" rows="6" placeholder="${ui.srcLang === "sat" ? "á±¡á±šá±¦á±Ÿá±¨ Â· à¤œà¥‹à¤¹à¤¾à¤° Â· johar" : (ui.srcLang === "hi" ? "à¤¨à¤®à¤¸à¥à¤¤à¥‡" : "Hello")}"></textarea>
        <div class="box-actions">
          <button class="btn" id="micBtn" data-act="mic">${ui.listen ? t("btn_stop") : (ui.liveTalk ? t("btn_live") : t("btn_mic"))}</button>
          <button class="btn ghost" data-act="speak-hi-side">â™ª ${t("lang_hi")}</button>
          <button class="btn ghost" data-act="speak-sat-side">â™ª ${t("lang_sat")}</button>
          <button class="btn ghost" data-act="clear">${t("btn_clear")}</button>
          ${ui.typeLang === "hi-phonetic" ? `<button class="btn ghost" data-act="hi-convert">${t("btn_hiconvert")}</button>` : ""}
        </div>
        <p class="hint" id="micHint">${caps.note}</p>
      </div>
      <button class="swap" data-act="swap" aria-label="${t("btn_swap")}">â‡„</button>
      <div class="box">
        <label>${t("nav_trans")}</label>
        <div id="tgtOutput" aria-live="polite">â€”</div>
        <p id="tgtRom" class="rom"></p>
        <div class="box-actions">
          <button class="btn ghost" data-act="copy">${t("btn_copy")}</button>
          <button class="btn" data-act="speak-hi-side">â™ª ${t("lang_hi")}</button>
          <button class="btn" data-act="speak-sat-side">â™ª ${t("lang_sat")}</button>
          <button class="btn ghost" data-act="stop-speak">${t("btn_stop")}</button>
        </div>
      </div>
    </div>
    <div class="meta-row" id="confMeta"></div>
    <aside id="teachHelp" class="teach-help" hidden></aside>
    <div class="kb" id="kbWrap"></div>
    <p class="hint">${t("lbl_ex")}</p>
    <div class="examples">
      <button data-act="ex" data-s="sat" data-t="hi" data-ex="á±¡á±šá±¦á±Ÿá±¨">á±¡á±šá±¦á±Ÿá±¨</button>
      <button data-act="ex" data-s="sat" data-t="hi" data-ex="amak nutum chet">amak nutum chet</button>
      <button data-act="ex" data-s="hi" data-t="sat" data-ex="à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?">à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤® à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?</button>
      <button data-act="ex" data-s="en" data-t="sat" data-ex="What is your name?">What is your name?</button>
    </div>`;
}

function looksLikeAsk(text) {
  const t = String(text || "").trim();
  if (t.length < 6) return false;
  if (/[?ï¼Ÿá±¿]/.test(t)) return true;
  return /à¤•à¥à¤¯à¤¾|à¤•à¥Œà¤¨|à¤•à¤¹à¤¾à¤|à¤•à¥à¤¯à¥‹à¤‚|à¤•à¥ˆà¤¸à¥‡|à¤•à¤¬|à¤•à¤¿à¤¤à¤¨à¤¾|à¤¬à¤¤à¤¾à¤“|à¤¬à¤¤à¤¾à¤‡à¤|à¤¸à¤®à¤à¤¾à¤“|à¤…à¤°à¥à¤¥|à¤®à¤¤à¤²à¤¬|à¤ªà¤¾à¤ |à¤•à¤•à¥à¤·à¤¾|à¤¤à¥à¤¯à¥‹à¤¹à¤¾à¤°|à¤°à¤¾à¤œà¤§à¤¾à¤¨à¥€|who|what|why|how|meaning/i.test(t);
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
    box.innerHTML = `<h3>à¤ªà¤¾à¤  à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾ Â· à¤•à¤•à¥à¤·à¤¾ 1â€“5</h3>` + hits.map((h) => `
      <article>
        <p class="teach-meta">${h.cls ? "à¤•à¤•à¥à¤·à¤¾ " + esc(h.cls) : ""}${h.subject ? " Â· " + esc(h.subject) : ""}</p>
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
    out.textContent = "â€”";
    if (rom) rom.textContent = "";
    if (meta) meta.innerHTML = "";
    return;
  }
  out.textContent = "â€¦";
  const from = ui.srcLang;
  const to = ui.tgtLang;
  const res = await translationService({ text, from, to, script: ui.script });
  out.textContent = res.text || "â€”";
  if (rom) rom.textContent = res.translit && ui.script !== "rom" ? res.translit : "";
  const pct = Math.round((res.conf || 0) * 100);
  const cls = pct >= 85 ? "high" : pct >= 50 ? "mid" : "low";
  const label = ({
    google: "Google Translate",
    "google-cloud": "Google Cloud",
    mymemory: "MyMemory",
    sarvam: "Sarvam AI",
    bhashini: "Bhashini",
    lexicon: "à¤ªà¤¾à¤ à¥à¤¯à¤•à¥à¤°à¤® à¤¶à¤¬à¥à¤¦à¤•à¥‹à¤¶",
    "local-dictionary": "à¤¸à¥à¤¥à¤¾à¤¨à¥€à¤¯ à¤¶à¤¬à¥à¤¦à¤•à¥‹à¤¶"
  })[res.provider || res.source] || (res.fallback ? "à¤¸à¥à¤¥à¤¾à¤¨à¥€à¤¯ à¤¶à¤¬à¥à¤¦à¤•à¥‹à¤¶" : "API");
  const mode = res.fallback
    ? `<span class="pill">${esc(label)}</span>`
    : `<span class="pill high">${esc(label)}</span>`;
  const offline = !navigator.onLine ? `<span class="pill mid">à¤‘à¤«à¤²à¤¾à¤‡à¤¨</span>` : "";
  meta.innerHTML = `${mode}${offline}<span class="pill ${cls}">à¤µà¤¿à¤¶à¥à¤µà¤¸à¤¨à¥€à¤¯à¤¤à¤¾ ${pct}%</span>
    <span class="note">${esc(res.note || "")}</span>
    ${res.unknown && res.unknown.length ? `<span class="note warn">à¤…à¤œà¥à¤à¤¾à¤¤: ${esc(res.unknown.join(", "))}</span>` : ""}`;
  maybeTeachHelp(text);
}

function paintOlKeys() {
  const host = document.getElementById("olKeys");
  if (!host) return;
  const letters = "á±šá±›á±œá±á±á±Ÿá± á±¡á±¢á±£á±¤á±¥á±¦á±§á±¨á±©á±ªá±«á±¬á±­á±®á±¯á±°á±±á±²á±³á±´á±µá±¶á±·".split("");
  const extra = ["á±¹", "á±¸", "á±½", " ", "á±¾", "á±¿", ..."á±á±‘á±’á±“á±”á±•á±–á±—á±˜á±™"];
  host.innerHTML = [...letters, ...extra].map((ch) =>
    `<button type="button" class="key ${ch === " " ? "space" : ""}" data-act="ol" data-ch="${ch === " " ? " " : esc(ch)}">${ch === " " ? "à¤–à¤¾à¤²à¥€" : ch}</button>`
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
  else if (ui.typeLang === "hi-phonetic") keys = `<p class="ime-preview" id="imePreview">à¤«à¤¼à¥‹à¤¨à¥‡à¤Ÿà¤¿à¤•: namaste â†’ à¤¨à¤®à¤¸à¥à¤¤à¥‡</p>`;
  host.innerHTML = `
    <div class="type-lang">
      <span class="type-lang-label">à¤Ÿà¤¾à¤‡à¤ª à¤­à¤¾à¤·à¤¾</span>
      <div class="seg wrap" role="group" aria-label="à¤Ÿà¤¾à¤‡à¤ª à¤­à¤¾à¤·à¤¾">${langs}</div>
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
  el.textContent = m ? `${m[1]} â†’ ${romanToHindi(m[1])}` : "à¤«à¤¼à¥‹à¤¨à¥‡à¤Ÿà¤¿à¤•: namaste â†’ à¤¨à¤®à¤¸à¥à¤¤à¥‡";
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
        <button class="btn ghost" data-act="nc-reset">â† Back</button>
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
        <h1>${esc(subData.en)} Â· Class ${ns.cls}</h1>
        <button class="btn ghost" data-act="nc-resetsub">â† Back to Subjects</button>
      </header>
      <div class="ncert-grid">
        ${subData.lessons.map((L, idx) => `
          <div class="nc-card lesson-card">
            <h3>Ch ${idx + 1}: ${esc(L.en)}</h3>
            <p class="muted" style="margin-bottom:4px;">à¤…à¤§à¥à¤¯à¤¾à¤¯ ${idx + 1}: ${esc(L.hi)}</p>
            ${L.sat ? `<p class="muted satline" style="margin-bottom:12px;color:var(--forest)">${idx + 1}: ${esc(L.sat)}</p>` : `<div style="height:12px;"></div>`}
            <div class="chip-row">
              ${L.pdf ? `<button class="btn ghost btn-sm" style="color:var(--primary); font-weight:600;" data-act="nc-les" data-mode="pdf" data-les="${L.id}">ğŸ“– ${ui.appLang === 'en' ? 'Book' : (ui.appLang === 'hi' ? 'à¤•à¤¿à¤¤à¤¾à¤¬' : 'á±¯á±šá±›á±šá±µ')}</button>` : ""}
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="flash" data-les="${L.id}">Flashcards</button>
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="quiz" data-les="${L.id}">Quiz</button>
              <button class="btn ghost btn-sm" data-act="nc-les" data-mode="video" data-les="${L.id}">â–¶ Video</button>
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
      <h1>ğŸ“– ${esc(lesson[ui.ncertState.lang] || lesson.en)}</h1>
      <button class="btn ghost btn-sm" data-act="nc-resetles">â† Back</button>
    </header>
    <div style="width:100%; height: 75vh; border-radius:12px; overflow:hidden; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
      <iframe src="${pdfUrl}#toolbar=0&navpanes=0" width="100%" height="100%" style="border:none;"></iframe>
    </div>
  `;
}

function langToggleBtn() {
  return `<button class="btn ghost" data-act="nc-lang">${ui.ncertState.lang === "en" ? "Switch to Hindi (à¤¹à¤¿à¤‚à¤¦à¥€)" : "Switch to English"}</button>`;
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
        <button class="btn ghost" data-act="nc-resetles">â† Back to Lessons</button>
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
        <button class="btn ghost" data-act="nc-resetles">â† Cancel</button>
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
  return `
    <header class="page-h spread">
      <h1>Video: ${esc(lesson[ui.ncertState.lang])}</h1>
      <button class="btn ghost btn-sm" data-act="nc-resetles">â† Back</button>
    </header>
    <div class="nc-video-wrap" style="text-align:center; padding: 20px; background:var(--ink); border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <iframe src="https://www.youtube.com/embed/${lesson.video}?autoplay=1&rel=0" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
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
    return `<div class="class-bar"><span>à¤•à¤•à¥à¤·à¤¾ ${L.cls}</span><div class="progress"><span style="width:${pct}%"></span></div><small>${c}/${n}</small></div>`;
  }).join("");
  const act = d.activity.length
    ? `<ul class="activity">${d.activity.slice(0, 8).map((a) => `<li>${a.kind === "lesson" ? "à¤ªà¤¾à¤ " : "à¤…à¤­à¥à¤¯à¤¾à¤¸"} Â· ${esc(a.label)}</li>`).join("")}</ul>`
    : `<p class="muted">à¤…à¤­à¥€ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿ à¤¨à¤¹à¥€à¤‚à¥¤</p>`;
  return `
    <header class="page-h"><h1>Progress Â· à¤ªà¥à¤°à¤—à¤¤à¤¿</h1></header>
    <section class="stats">
      <article class="stat"><span class="stat-n">${d.streak.count}</span><span>à¤²à¤•à¥€à¤°</span></article>
      <article class="stat"><span class="stat-n">${done}</span><span>à¤ªà¤¾à¤ </span></article>
      <article class="stat"><span class="stat-n">${learned}</span><span>à¤¶à¤¬à¥à¤¦</span></article>
      <article class="stat"><span class="stat-n">${acc}%</span><span>à¤¸à¤Ÿà¥€à¤•à¤¤à¤¾</span></article>
    </section>
    <article class="card"><h2>à¤•à¤•à¥à¤·à¤¾ à¤ªà¥à¤°à¤—à¤¤à¤¿</h2>${classes}</article>
    <article class="card"><h2>à¤¹à¤¾à¤² à¤•à¥€ à¤—à¤¤à¤¿à¤µà¤¿à¤§à¤¿</h2>${act}
      <p class="muted">à¤¯à¤¹ à¤¡à¥‡à¤Ÿà¤¾ à¤‡à¤¸à¥€ à¤¬à¥à¤°à¤¾à¤‰à¤œà¤¼à¤° à¤®à¥‡à¤‚ localStorage à¤®à¥‡à¤‚ à¤°à¤¹à¤¤à¤¾ à¤¹à¥ˆà¥¤</p></article>`;
}

/* ---------- TEACHER AUTH ---------- */
function viewTeacherAuth(isGlobal = false) {
  const state = JSON.parse(localStorage.getItem('vaani_teacher') || '{"status":"out", "email":""}');

  if (state.status === "out") {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: url('assets/hero.jpg') center/cover; padding: 20px;">
        <div class="card" id="t-auth-box" style="width: 100%; max-width: 450px; text-align: center; padding: 50px 30px; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);">
          <img src="assets/logo.png" alt="Vaani AI" style="width:70px; margin-bottom: 20px;" />
          <h2 style="margin-bottom: 10px; font-size:2rem; color:var(--primary);">Vaani AI Portal</h2>
          <p style="color:var(--ink-soft); margin-bottom: 30px; font-size:1.05rem;">Enter your verified educator email address to access the integrated dashboard.</p>
          <input type="email" id="t-email" class="trans-input" style="width:100%; margin-bottom: 20px; font-size:1.15rem; padding: 15px; border-radius: 8px; border:2px solid var(--wash); text-align:center;" placeholder="educator@school.edu.in" />
          <button class="btn" style="width:100%; background:var(--primary); font-size:1.15rem; padding: 15px;" onclick="
            const em = document.getElementById('t-email').value;
            if(!em.includes('@')) return alert('Please enter a valid email address.');
            this.innerText = 'Sending Link...';
            this.style.opacity = '0.7';
            setTimeout(() => {
              localStorage.setItem('vaani_teacher', JSON.stringify({status: 'sent', email: em}));
              window.location.reload();
            }, 1200);
          ">âœ‰ï¸ Send Verification Link</button>
        </div>
      </div>
    `;
  }

  if (state.status === "sent") {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px;">
        <div class="card" style="width: 100%; max-width: 450px; text-align: center; padding: 50px 30px; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.08);">
          <div style="background:var(--wash); width:80px; height:80px; margin: 0 auto 20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem;">âœ‰ï¸</div>
          <h2 style="margin-bottom: 15px;">Check Your Email</h2>
          <p style="color:var(--ink-soft); margin-bottom: 30px; line-height: 1.6; font-size: 1.05rem;">We just sent a magic login link to <br><strong style="color:var(--ink);">${esc(state.email)}</strong>.</p>
          
          <div style="background:#f4f4f4; padding:25px; border-radius:12px; border: 2px dashed #d0d0d0;">
             <p style="font-size:0.8rem; color:#666; margin-bottom:15px; text-transform:uppercase; letter-spacing:1px; font-weight:700;">Hackathon Demo Mode Override</p>
             <button class="btn" style="width:100%; background:var(--forest); font-size: 1.05rem; padding: 12px;" onclick="
               localStorage.setItem('vaani_teacher', JSON.stringify({status: 'in', email: '${esc(state.email)}'}));
               window.location.reload();
             ">ğŸ”“ Simulate Identity Verification</button>
          </div>
          
          <button class="btn ghost" style="margin-top:25px; font-size:1.05rem;" onclick="
            localStorage.setItem('vaani_teacher', JSON.stringify({status: 'out', email: ''}));
            window.location.reload();
          ">â† Use a different email</button>
        </div>
      </div>
    `;
  }

  if (state.status === "in" && !isGlobal) {
    return `
      <header class="page-h spread">
         <h1>ğŸ‘¨â€ğŸ« Teacher Dashboard</h1>
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
         <h2 style="color: var(--primary);">Welcome back, ${esc(state.email)}!</h2>
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
        <div class="vn-connector">â”‚</div>
        <div class="vn-node child">
          <span class="vn-branch">â”œâ”€â”€ </span><span class="vn-label">TranslationService</span>
        </div>
        <div class="vn-connector">â”‚&nbsp;&nbsp;&nbsp;â””â”€â”€ <span class="vn-label param">Sarvam</span></div>
        <div class="vn-input-row">
           â”‚&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-sarvam" value="${esc(keys.sarvam || "")}" placeholder="Enter SARVAM_API_KEY..." />
        </div>
        
        <!-- STTService -->
        <div class="vn-connector">â”‚</div>
        <div class="vn-node child">
          <span class="vn-branch">â”œâ”€â”€ </span><span class="vn-label">STTService</span>
        </div>
        <div class="vn-connector">â”‚&nbsp;&nbsp;&nbsp;â””â”€â”€ <span class="vn-label param">Indic Conformer / Sarvam</span></div>
        <div class="vn-input-row">
           â”‚&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-hf-stt" value="${esc(keys.hf_stt || "")}" placeholder="Enter HF_STT_TOKEN..." />
        </div>

        <!-- TTSService -->
        <div class="vn-connector">â”‚</div>
        <div class="vn-node child">
          <span class="vn-branch">â”œâ”€â”€ </span><span class="vn-label">TTSService</span>
        </div>
        <div class="vn-connector">â”‚&nbsp;&nbsp;&nbsp;â””â”€â”€ <span class="vn-label param">Indic Parler-TTS</span></div>
        <div class="vn-input-row">
           â”‚&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" spellcheck="false" id="ak-hf-tts" value="${esc(keys.hf_tts || "")}" placeholder="Enter HF_TTS_TOKEN..." />
        </div>

        <!-- DictionaryService -->
        <div class="vn-connector">â”‚</div>
        <div class="vn-node child">
          <span class="vn-branch">â”œâ”€â”€ </span><span class="vn-label">DictionaryService</span> <span class="muted" style="margin-left: 10px; font-size:0.8rem;">(Static Native Lexicon)</span>
        </div>

        <!-- OfflineService -->
        <div class="vn-connector">â”‚</div>
        <div class="vn-node child">
          <span class="vn-branch">â””â”€â”€ </span><span class="vn-label">OfflineService</span> <span class="muted" style="margin-left: 10px; font-size:0.8rem;">(IndexedDB / PWA Worker Cache)</span>
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
  if (r.name === "dictionary") html = viewDictionary(r.a);
  else if (r.name === "translate") html = viewTranslate();
  else if (r.name === "teacher") html = viewTeacherAuth();
  else if (r.name === "settings") html = viewSettings();
  else html = viewHome(r);
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
    toast("à¤ªà¤¾à¤  à¤¸à¤¹à¥‡à¤œà¤¾ à¤—à¤¯à¤¾");
    render();
  }
  if (act === "quick") {
    const ok = t.dataset.ok === "true";
    t.classList.add(ok ? "good" : "bad");
    const h = document.getElementById("quickHint");
    if (h) h.textContent = ok ? "à¤¸à¤¹à¥€ â€” à¤œà¥‹à¤¹à¤¾à¤°!" : "à¤«à¤¿à¤° à¤¦à¥‡à¤–à¥‡à¤‚à¥¤";
    if (ok && t.dataset.word) storage.learnWord(t.dataset.word);
  }
  if (act === "topic") { ui.dictTopic = t.dataset.id; render(); }
  if (act === "favonly") { ui.favOnly = !ui.favOnly; render(); }
  if (act === "fav") { storage.toggleFav(t.dataset.id); render(); }
  if (act === "learned") { storage.learnWord(t.dataset.id); toast("à¤¶à¤¬à¥à¤¦ à¤œà¥‹à¤¡à¤¼à¤¾ à¤—à¤¯à¤¾"); render(); }
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
    const prev = tgt && tgt.textContent !== "â€”" ? tgt.textContent : "";
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
    if (t2 && navigator.clipboard) navigator.clipboard.writeText(t2.textContent).then(() => toast("à¤•à¥‰à¤ªà¥€ à¤¹à¥‹ à¤—à¤¯à¤¾"));
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
    txt.textContent = isCorrect ? "Correct! âœ…" : "Incorrect âŒ";
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
    if (!left) return toast("à¤ªà¤¹à¤²à¥‡ à¤¬à¤¾à¤¯à¤¾à¤ à¤¶à¤¬à¥à¤¦ à¤šà¥à¤¨à¥‡à¤‚");
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
    btn.textContent = on ? "à¤°à¥‹à¤•à¥‡à¤‚" : (ui.liveTalk ? "à¤²à¤¾à¤‡à¤µ à¤¶à¥à¤°à¥‚" : "à¤®à¤¾à¤‡à¤•");
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
    if (sat && sat !== "â€”" && sat !== lastEcho) {
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
  setMicUi(false, "à¤®à¤¾à¤‡à¤• à¤¬à¤‚à¤¦à¥¤");
}

async function toggleMic() {
  if (ui.listen) {
    stopAllMic();
    setMicUi(false, "à¤®à¤¾à¤‡à¤• à¤¬à¤‚à¤¦à¥¤ à¤«à¤¿à¤° à¤¸à¥‡ à¤¬à¥‹à¤²à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤®à¤¾à¤‡à¤• à¤¦à¤¬à¤¾à¤à¤à¥¤");
    return;
  }
  if (ui.liveTalk) {
    ui.srcLang = "hi";
    ui.tgtLang = "sat";
    ui.typeLang = "hi-phonetic";
  }
  setMicUi(false, "à¤®à¤¾à¤‡à¤• à¤šà¤¾à¤²à¥‚ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆâ€¦ à¤¬à¥à¤°à¤¾à¤‰à¤œà¤¼à¤° à¤ªà¥‚à¤›à¥‡ à¤¤à¥‹ à¤…à¤¨à¥à¤®à¤¤à¤¿ à¤¦à¥‡à¤‚à¥¤");
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
    ? "à¤²à¤¾à¤‡à¤µ à¤šà¤² à¤°à¤¹à¤¾ à¤¹à¥ˆ â€” à¤¹à¤¿à¤‚à¤¦à¥€ à¤®à¥‡à¤‚ à¤¬à¥‹à¤²à¤¤à¥‡ à¤°à¤¹à¥‡à¤‚à¥¤"
    : "à¤¸à¥à¤¨ à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚â€¦ à¤¹à¤¿à¤‚à¤¦à¥€ à¤®à¥‡à¤‚ à¤¬à¥‹à¤²à¤¿à¤à¥¤");

  listen({
    lang: "hi-IN",
    keepAlive: true,
    score: scoreAgainstLexicon,
    onResult: (text) => { afterSpeech(text); },
    onInterim: (t) => {
      if (micIsMuted()) return;
      const h = document.getElementById("micHint");
      if (h) h.textContent = (live ? "à¤²à¤¾à¤‡à¤µ: " : "à¤¸à¥à¤¨ à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚: ") + t;
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
_ *cascade08_`*cascade08`a *cascade08ac*cascade08cd *cascade08df*cascade08fg *cascade08gi*cascade08it *cascade08t{*cascade08{| *cascade08|~*cascade08~÷ *cascade08÷š *cascade08š *cascade08*cascade08ª *cascade08ªÉ *cascade08Éï*cascade08ïĞ *cascade08ĞÑ*cascade08ÑÒ *cascade08Ò×*cascade08×İ *cascade08İì*cascade08ìŠ	 *cascade08Š		 *cascade08	Ç	*cascade08Ç	í
 *cascade08í
ë*cascade08ëò *cascade08òö*cascade08öŒ *cascade08Œ*cascade08Ÿ *cascade08Ÿ£*cascade08£Å *cascade08Å••® *cascade08®¯*cascade08¯° *cascade08°µ*cascade08µÇ *cascade08ÇÈ*cascade08ÈÉ *cascade08ÉÎ*cascade08Îµ* *cascade08µ*¶**cascade08¶*·* *cascade08·*¹**cascade08¹*º* *cascade08º*»**cascade08»*¼* *cascade08¼*½**cascade08½*¾* *cascade08¾*Â**cascade08Â*Ã* *cascade08Ã*Æ**cascade08Æ*Ç* *cascade08Ç*Í**cascade08Í*æ* *cascade08æ*é**cascade08é*ê* *cascade08ê*ø**cascade08ø*ù* *cascade08ù*’+*cascade08’+“+ *cascade08“+•+*cascade08•+–+ *cascade08–+ª+*cascade08ª+¬+ *cascade08¬+®+*cascade08®+¯+ *cascade08¯+²+*cascade08²+³+ *cascade08³+¶+*cascade08¶+·+ *cascade08·+É+*cascade08É+Ê+ *cascade08Ê+Î+*cascade08Î+Ï+ *cascade08Ï+Ò+*cascade08Ò+é+ *cascade08é+ì+*cascade08ì+î+ *cascade08î+ï+*cascade08ï+ñ+ *cascade08ñ+ò+*cascade08ò+õ+ *cascade08õ+ƒ,*cascade08ƒ,„, *cascade08„,Œ,*cascade08Œ,, *cascade08,,*cascade08,, *cascade08,–,*cascade08–,¬, *cascade08¬,¯,*cascade08¯,±, *cascade08±,À,*cascade08À,Á, *cascade08Á,Ã,*cascade08Ã,Ú, *cascade08Ú,Ü,*cascade08Ü,İ, *cascade08İ,à,*cascade08à,á, *cascade08á,â,*cascade08â,ä, *cascade08ä,é,*cascade08é,ê, *cascade08ê,ó,*cascade08ó,ô, *cascade08ô,‡-*cascade08‡-ˆ- *cascade08ˆ-Š-*cascade08Š-Œ- *cascade08Œ--*cascade08-- *cascade08-—-*cascade08—-™- *cascade08™-Ÿ-*cascade08Ÿ-¡- *cascade08¡-£-*cascade08£-¤- *cascade08¤-¥- *cascade08¥-¦-*cascade08¦-§- *cascade08§-¨- *cascade08¨-«-*cascade08«-±- *cascade08±-²- *cascade08²-º-*cascade08º-¼- *cascade08¼-¾-*cascade08¾-¿- *cascade08¿-Ä-*cascade08Ä-Å- *cascade08Å-Ç-*cascade08Ç-È- *cascade08È-Ê-*cascade08Ê-Ë- *cascade08Ë-Ğ-*cascade08Ğ-Ñ- *cascade08Ñ-Ö-*cascade08Ö-×- *cascade08×-Ú-*cascade08Ú-Ü- *cascade08Ü-á-*cascade08á-â- *cascade08â-è-*cascade08è-é- *cascade08é-í- *cascade08í-ğ-*cascade08ğ-ñ- *cascade08ñ-€.*cascade08€.. *cascade08.‚.*cascade08‚.. *cascade08..*cascade08.“. *cascade08“.­.*cascade08­.µ. *cascade08µ.¹.*cascade08¹.º. *cascade08º.».*cascade08».Ã. *cascade08Ã.È.*cascade08È.É. *cascade08É.Ê.*cascade08Ê.Ë. *cascade08Ë.Ğ.*cascade08Ğ.Ò. *cascade08Ò.Ü.*cascade08Ü.İ. *cascade08İ.â.*cascade08â.ã. *cascade08ã.ç.*cascade08ç.è. *cascade08è.ë.*cascade08ë.ì. *cascade08ì.ñ.*cascade08ñ.ó. *cascade08ó.õ.*cascade08õ.ş. *cascade08ş.ƒ/*cascade08ƒ/„/ *cascade08„/š/*cascade08š/›/ *cascade08›//*cascade08/Ÿ/ *cascade08Ÿ/®/*cascade08®/¯/ *cascade08¯/½/*cascade08½/¾/ *cascade08¾/Ì/*cascade08Ì/Î/ *cascade08Î/Ò/*cascade08Ò/Ó/ *cascade08Ó/Ö/*cascade08Ö/ä/ *cascade08ä/‚0*cascade08‚0„0 *cascade08„0‡0*cascade08‡0Š0 *cascade08Š0‹0*cascade08‹00 *cascade0800*cascade080’0 *cascade08’0•0*cascade08•0–0 *cascade08–0—0*cascade08—0˜0 *cascade08˜0¢0*cascade08¢0£0 *cascade08£0¥0*cascade08¥0¦0 *cascade08¦0ª0*cascade08ª0«0 *cascade08«0À0*cascade08À0Á0 *cascade08Á0Æ0*cascade08Æ0Ç0 *cascade08Ç0É0*cascade08É0Ê0 *cascade08Ê0Ú0*cascade08Ú0Û0 *cascade08Û0æ0*cascade08æ0´2 *cascade08´2¿2*cascade08¿2Å2 *cascade08Å2È2*cascade08È2Ø3 *cascade08Ø3ã3*cascade08ã3ç3 *cascade08ç3ê3*cascade08ê3ƒ5 *cascade08ƒ5Š5*cascade08Š5Œ5 *cascade08Œ55*cascade085‘5 *cascade08‘5”5*cascade08”5·6 *cascade08·6¾6*cascade08¾6¿6 *cascade08¿6Â6*cascade08Â6Ç6 *cascade08Ç6Ê6*cascade08Ê6ô6 *cascade08ô6Û:*cascade08Û:à; *cascade08à;æ;*cascade08æ;é; *cascade08é;ë;*cascade08ë;ï; *cascade08ï;ò;*cascade08ò;•> *cascade08•>›>*cascade08›>> *cascade08> >*cascade08 >¤> *cascade08¤>§>*cascade08§>à? *cascade08à?æ?*cascade08æ?è? *cascade08è?ê?*cascade08ê?í? *cascade08í?ğ?*cascade08ğ?A *cascade08A–A*cascade08–A™A *cascade08™A›A*cascade08›AA *cascade08A¡A*cascade08¡A¹B *cascade08¹B¿B*cascade08¿BÃB *cascade08ÃBÅB*cascade08ÅBÇB *cascade08ÇBÊB*cascade08ÊBæC *cascade08æCğC*cascade08ğCôC *cascade08ôC÷C*cascade08÷CŠD *cascade08ŠDŒD*cascade08ŒDD *cascade08DD*cascade08D‘D *cascade08‘D”D*cascade08”D–D *cascade08–D˜D*cascade08˜D™D *cascade08™DœD*cascade08œDÊD *cascade08ÊDÔD*cascade08ÔDØD *cascade08ØDÚD*cascade08ÚDŞD *cascade08ŞDáD*cascade08áDñE *cascade08ñEûE*cascade08ûEşE *cascade08şEF*cascade08F”F *cascade08”F–F*cascade08–F—F *cascade08—F™F*cascade08™FšF *cascade08šF›F*cascade08›FœF *cascade08œF¥F*cascade08¥FÓF *cascade08ÓFİF*cascade08İFàF *cascade08àFâF*cascade08âFåF *cascade08åFèF*cascade08èF÷G *cascade08÷GH*cascade08H…H *cascade08…HˆH*cascade08ˆH›H *cascade08›HH*cascade08HH *cascade08H¡H*cascade08¡H¢H *cascade08¢H¥H*cascade08¥H¦H *cascade08¦H§H*cascade08§HªH *cascade08ªH­H*cascade08­HÛH *cascade08ÛHåH*cascade08åHéH *cascade08éHìH*cascade08ìHúI *cascade08úI„J*cascade08„J‡J *cascade08‡JŠJ*cascade08ŠJJ *cascade08JŸJ*cascade08ŸJ J *cascade08 J£J*cascade08£J¤J *cascade08¤J¨J*cascade08¨J©J *cascade08©J®J*cascade08®JÜJ *cascade08ÜJæJ*cascade08æJíJ *cascade08íJïJ*cascade08ïJñJ *cascade08ñJôJ*cascade08ôJøK *cascade08øKşK*cascade08şKƒL *cascade08ƒL…L*cascade08…L‡L *cascade08‡LŠL*cascade08ŠLÅO *cascade08ÅOÖO*cascade08ÖO¹Q *cascade08¹Q»Q*cascade08»Q¼Q *cascade08¼QÄQ*cascade08ÄQÅQ *cascade08ÅQÆQ*cascade08ÆQÉQ *cascade08ÉQËQ*cascade08ËQÌQ *cascade08ÌQÛQ*cascade08ÛQ‡S *cascade08‡S˜S*cascade08˜S’‹ *cascade08’‹˜‹ *cascade08˜‹›‹ *cascade08›‹¡‹*cascade08¡‹£‹ *cascade08£‹À‹*cascade08À‹Á‹ *cascade08Á‹Æ‹*cascade08Æ‹Ë‹ *cascade08Ë‹Ğ‹*cascade08Ğ‹Ñ‹ *cascade08Ñ‹ñ‹*cascade08ñ‹ò‹ *cascade08ò‹õ‹*cascade08õ‹ö‹ *cascade08ö‹…Œ*cascade08…Œ†Œ *cascade08†ŒŒ*cascade08Œ’Œ *cascade08’Œ”Œ*cascade08”Œ•Œ *cascade08•Œ¬Œ*cascade08¬ŒØŒ *cascade08ØŒâŒ*cascade08âŒæŒ *cascade08æŒéŒ*cascade08éŒ† *cascade08†Œ*cascade08Œ *cascade08“*cascade08“” *cascade08”–*cascade08–— *cascade08—˜*cascade08˜ğ *cascade08ğö*cascade08ö *cascade08…*cascade08…† *cascade08†‡*cascade08‡‰ *cascade08‰*cascade08 *cascade08*cascade08 *cascade08–*cascade08–— *cascade08—™*cascade08™š *cascade08šœ *cascade08œ*cascade08Ÿ *cascade08Ÿ§*cascade08§© *cascade08©ª*cascade08ª´ *cascade08´¶ *cascade08¶¾*cascade08¾¿ *cascade08¿Â*cascade08ÂÃ *cascade08ÃÊ*cascade08ÊË *cascade08ËÍ*cascade08ÍÎ *cascade08ÎĞ*cascade08ĞÑ *cascade08ÑØ*cascade08ØÚ *cascade08ÚÛ*cascade08Ûİ *cascade08İŞ *cascade08Şî*cascade08îï *cascade08ïô*cascade08ôõ *cascade08õö*cascade08ö÷ *cascade08÷ø*cascade08øù *cascade08ùş*cascade08şÿ *cascade08ÿ*cascade08‚ *cascade08‚„*cascade08„† *cascade08†‰*cascade08‰Š *cascade08Š‹*cascade08‹Œ*cascade08Œ *cascade08“*cascade08“” *cascade08”–*cascade08–— *cascade08—¤*cascade08¤¥ *cascade08¥¨*cascade08¨© *cascade08©¬*cascade08¬® *cascade08®´*cascade08´µ *cascade08µ¼*cascade08¼½ *cascade08½À*cascade08ÀÁ *cascade08ÁÄ*cascade08ÄÅ *cascade08ÅÉ*cascade08ÉÊ *cascade08ÊÛ*cascade08ÛÜ *cascade08Üß*cascade08ßá *cascade08áä*cascade08äå *cascade08åî*cascade08îğ *cascade08ğò*cascade08òó *cascade08óü*cascade08üƒ *cascade08ƒ†*cascade08† *cascade08“*cascade08“œ *cascade08œ­*cascade08­® *cascade08®¯*cascade08¯° *cascade08°¹ *cascade08¹¿*cascade08¿Ã *cascade08ÃÄ *cascade08ÄÆ*cascade08ÆÇ *cascade08ÇÓ*cascade08ÓÔ *cascade08ÔÙ*cascade08ÙÚ *cascade08ÚÛ*cascade08ÛÜ *cascade08Üİ*cascade08İŞ *cascade08Şä*cascade08äå *cascade08åç*cascade08çè *cascade08èğ*cascade08ğñ *cascade08ñò*cascade08òó*cascade08óô *cascade08ôü*cascade08üı *cascade08ı‘*cascade08‘‚‘ *cascade08‚‘ƒ‘*cascade08ƒ‘„‘ *cascade08„‘†‘*cascade08†‘ˆ‘ *cascade08ˆ‘‹‘*cascade08‹‘Œ‘ *cascade08Œ‘‘‘*cascade08‘‘•‘ *cascade08•‘—‘ *cascade08—‘™‘*cascade08™‘š‘ *cascade08š‘¡‘*cascade08¡‘¢‘ *cascade08¢‘£‘*cascade08£‘¦‘ *cascade08¦‘¨‘ *cascade08¨‘²‘*cascade08²‘³‘ *cascade08³‘´‘*cascade08´‘¶‘ *cascade08¶‘È‘ *cascade08È‘Ê‘*cascade08Ê‘Ë‘ *cascade08Ë‘Í‘*cascade08Í‘Ï‘ *cascade08Ï‘Ò‘*cascade08Ò‘Ó‘ *cascade08Ó‘Ô‘*cascade08Ô‘Ö‘ *cascade08Ö‘”’ *cascade08”’š’*cascade08š’ö’ *cascade08ö’‡“*cascade08‡“ì“ *cascade08ì“ş“*cascade08ş“ã” *cascade08ã”ğ”*cascade08ğ”ò” *cascade08ò”õ”*cascade08õ”ø• *cascade08ø•ˆ–*cascade08ˆ–Ï– *cascade08Ï–Ñ–*cascade08Ñ–Ò– *cascade08Ò–Ş–*cascade08Ş–ß– *cascade08ß–à–*cascade08à–ã– *cascade08ã–å–*cascade08å–æ– *cascade08æ–ó–*cascade08ó–ô– *cascade08ô–õ–*cascade08õ–Ê— *cascade08Ê—Í—*cascade08Í—Î— *cascade08Î—Ñ—*cascade08Ñ—Ô— *cascade08Ô—Ö—*cascade08Ö—˜˜ *cascade08˜˜¨˜*cascade08¨˜«˜ *cascade08«˜¬˜*cascade08¬˜ß˜ *cascade08ß˜ö˜*cascade08ö˜Š™ *cascade08Š™•™*cascade08•™š *cascade08šš*cascade08šš *cascade08š˜š*cascade08˜š™š *cascade08™ššš*cascade08šš¬š *cascade08¬š®š*cascade08®š¯š *cascade08¯š·š*cascade08·š¸š *cascade08¸š¹š*cascade08¹š¼š *cascade08¼š¾š*cascade08¾š¿š *cascade08¿šÆš*cascade08ÆšÇš *cascade08ÇšÈš*cascade08Èš•› *cascade08•›¤›*cascade08¤›ğ› *cascade08ğ›€œ*cascade08€œ¿œ *cascade08¿œĞœ*cascade08Ğœ· *cascade08·Ì*cascade08Ìæ *cascade08æö*cascade08ö¬Ÿ *cascade08¬Ÿ½Ÿ*cascade08½Ÿı  *cascade08ı ¡*cascade08¡Ò¡ *cascade08Ò¡á¡*cascade08á¡§¢ *cascade08§¢·¢*cascade08·¢û¢ *cascade08û¢‹£*cascade08‹£ã¤ *cascade08ã¤ñ¤*cascade08ñ¤²¥ *cascade08²¥³¥*cascade08³¥¸¥ *cascade08¸¥¾¥*cascade08¾¥¿¥ *cascade08¿¥Â¥*cascade08Â¥š¦ *cascade08š¦›¦*cascade08›¦ ¦ *cascade08 ¦¦¦*cascade08¦¦§¦ *cascade08§¦ª¦*cascade08ª¦‚§ *cascade08‚§ƒ§*cascade08ƒ§‡§ *cascade08‡§§*cascade08§§ *cascade08§‘§*cascade08‘§¢¨ *cascade08¢¨£¨*cascade08£¨¥¨ *cascade08¥¨­¨*cascade08­¨®¨ *cascade08®¨±¨*cascade08±¨¿¨ *cascade08¿¨Ñ¨*cascade08Ñ¨Ó¨ *cascade08Ó¨å¨*cascade08å¨µ· *cascade08µ·¸·*cascade08¸·¹· *cascade08¹·»·*cascade08»·Ê· *cascade08Ê·Ë·*cascade08Ë·Ì· *cascade08Ì·Ñ·*cascade08Ñ·Ò· *cascade08Ò·Ô·*cascade08Ô·€Ş *cascade08€ŞˆŞ*cascade08ˆŞ¸Ş *cascade08¸Şß *cascade08ßß*cascade08ß¥ß *cascade08¥ß­ß *cascade08­ß³ß *cascade08³ß¹ß*cascade08¹ßºß*cascade08ºß»ß *cascade08»ß¼ß*cascade08¼ß½ß *cascade08½ß¾ß *cascade08¾ß¿ß*cascade08¿ßÂß *cascade08Âßáß *cascade08áßõß*cascade08õß‰æ *cascade08‰æ¤æ*cascade08¤æµæ *cascade08µæšç*cascade08šçÇê *cascade08ÇêÈê*cascade08ÈêÉê *cascade08ÉêÏê*cascade08Ïê‘ë *cascade08‘ë ë*cascade08 ëäë *cascade08äëêë êë‰ì*cascade08‰ìßì ßìäì *cascade08äì÷ì*cascade08÷ìùì *cascade08ùì…í*cascade08…íí *cascade08íí*cascade08í–í *cascade08–í½í*cascade08½íïí *cascade08ïíûí *cascade08ûíî*cascade08îÊî *cascade08ÊîÍî*cascade08ÍîÎî *cascade08ÎîÏî*cascade08ÏîĞî *cascade08ĞîÒî*cascade08ÒîÓî *cascade08ÓîÔî*cascade08ÔîÕî *cascade08ÕîÛî*cascade08Ûîİî *cascade08İîãî*cascade08ãîäî *cascade08äîçî*cascade08çîìî *cascade08ìîîî*cascade08îîğî *cascade08ğîñî*cascade08ñîóî *cascade08óîôî*cascade08ôîöî *cascade08öîıî*cascade08ıîåï *cascade08åïëï*cascade08ëï‚ğ *cascade08‚ğğñ *cascade08ğñöñ*cascade08öñò *cascade08ò’ò*cascade08’ò“ò *cascade08“ò—ò*cascade08—ò˜ò *cascade08˜ò›ò*cascade08›òœò *cascade08œòò*cascade08ò ò *cascade08 ò¤ò*cascade08¤ò¥ò *cascade08¥ò¦ò *cascade08¦òªò*cascade08ªò«ò *cascade08«ò¬ò *cascade08¬ò¯ò*cascade08¯ò°ò *cascade08°ò²ò *cascade08²ò³ò*cascade08³ò´ò *cascade08´òµò*cascade08µò¶ò *cascade08¶ò¹ò*cascade08¹òºò *cascade08ºò»ò*cascade08»ò¼ò *cascade08¼òÀò*cascade08ÀòÂò *cascade08ÂòÃò *cascade08ÃòÄò *cascade08ÄòÆò *cascade08ÆòÊò*cascade08ÊòËò *cascade08ËòÒò *cascade08ÒòØò*cascade08Øò©ó *cascade08©ó«ó*cascade08«ó†ô *cascade08†ô‡ô*cascade08‡ôôô *cascade08ôô¬õ *cascade08¬õéõ *cascade08éõêõ *cascade08êõøõ *cascade08øõÒú *cascade08Òúôü *cascade08ôüõü *cascade08õüÕ“ *cascade08Õ“÷“ *cascade08÷“ş“*cascade08ş“Ø” *cascade08Ø”ß”*cascade08ß”•– *cascade08•–—– *cascade08—–™– *cascade08™–š– *cascade08š–– *cascade08–£– *cascade08£–¤– *cascade08¤–¥– *cascade08¥–¦–*cascade08¦–§– *cascade08§–¨– *cascade08¨–©– *cascade08©–ª–*cascade08ª–«– *cascade08«–¬–*cascade08¬–­– *cascade08­–®–*cascade08®–¯– *cascade08¯–°– *cascade08°–±–*cascade08±–´– *cascade08´–¶– *cascade08¶–Á– *cascade08Á–Â– *cascade08Â–É– *cascade08É–Ë– *cascade08Ë–Ì–*cascade08Ì–Í– *cascade08Í–Î– *cascade08Î–Ó– *cascade08Ó–Ô– *cascade08Ô–Ö– *cascade08Ö–×– *cascade08×–Û– *cascade08Û–ß– *cascade08ß–à– *cascade08à–ä– *cascade08ä–å– *cascade08å–ç– *cascade08ç–è– *cascade08è–é– *cascade08é–ê– *cascade08ê–í– *cascade08í–î–*cascade08î–ï– *cascade08ï–ğ–*cascade08ğ–Š— *cascade08Š—‹—*cascade08‹—— *cascade08——— *cascade08——˜— *cascade08˜—™—*cascade08™—š— *cascade08š—Ÿ— *cascade08Ÿ—»— *cascade08»—¼—*cascade08¼—Æ— *cascade08Æ—È—*cascade08È—Ê— *cascade08Ê—Ë—*cascade08Ë—Í— *cascade08Í—Ğ—*cascade08Ğ—Ñ— *cascade08Ñ—Ò—*cascade08Ò—Ó— *cascade08Ó—Ô— *cascade08Ô—Ö—*cascade08Ö—×— *cascade08×—Ø—*cascade08Ø—Ù— *cascade08Ù—Û— *cascade08Û—Ü— *cascade08Ü—Ş— *cascade08Ş—â— *cascade08â—ã—*cascade08ã—æ—*cascade08æ—ç— *cascade08ç—í—*cascade08í—î— *cascade08î—ï—*cascade08ï—ô—*cascade08ô—õ— *cascade08õ—ÿ—*cascade08ÿ—€˜*cascade08€˜…˜*cascade08…˜†˜ *cascade08†˜‡˜*cascade08‡˜ˆ˜*cascade08ˆ˜‰˜ *cascade08‰˜“˜*cascade08“˜”˜ *cascade08”˜—˜*cascade08—˜˜˜ *cascade08˜˜š˜*cascade08š˜œ˜ *cascade08œ˜˜*cascade08˜Ÿ˜ *cascade08Ÿ˜¡˜*cascade08¡˜¢˜ *cascade08¢˜£˜*cascade08£˜¦˜ *cascade08¦˜ª˜*cascade08ª˜«˜ *cascade08«˜¬˜*cascade08¬˜®˜ *cascade08®˜±˜*cascade08±˜²˜ *cascade08²˜³˜ *cascade08³˜´˜*cascade08´˜·˜*cascade08·˜¸˜ *cascade08¸˜¹˜ *cascade08¹˜º˜ *cascade08º˜»˜ *cascade08»˜¾˜ *cascade08¾˜À˜ *cascade08À˜Â˜*cascade08Â˜Ã˜ *cascade08Ã˜É˜*cascade08É˜Í˜ *cascade08Í˜Ï˜*cascade08Ï˜Ğ˜ *cascade08Ğ˜Ò˜*cascade08Ò˜Ó˜ *cascade08Ó˜Õ˜*cascade08Õ˜×˜ *cascade08×˜Ø˜*cascade08Ø˜Ù˜ *cascade08Ù˜Û˜ *cascade08Û˜İ˜*cascade08İ˜Ş˜ *cascade08Ş˜à˜*cascade08à˜á˜ *cascade08á˜ã˜*cascade08ã˜ä˜ *cascade08ä˜é˜*cascade08é˜ê˜ *cascade08ê˜í˜*cascade08í˜ï˜ *cascade08ï˜ğ˜*cascade08ğ˜ñ˜ *cascade08ñ˜ø˜*cascade08ø˜ú˜ *cascade08ú˜û˜*cascade08û˜ü˜ *cascade08ü˜ı˜ *cascade08ı˜ş˜*cascade08ş˜ÿ˜ *cascade08ÿ˜„™*cascade08„™…™ *cascade08…™†™*cascade08†™‡™ *cascade08‡™‰™*cascade08‰™Š™ *cascade08Š™™*cascade08™˜™ *cascade08˜™š™*cascade08š™›™ *cascade08›™œ™ *cascade08œ™™ *cascade08™ ™*cascade08 ™¢™ *cascade08¢™¤™ *cascade08¤™¨™*cascade08¨™ª™ *cascade08ª™«™*cascade08«™¬™ *cascade08¬™­™ *cascade08­™¯™*cascade08¯™±™ *cascade08±™´™*cascade08´™µ™ *cascade08µ™¶™*cascade08¶™·™ *cascade08·™¹™*cascade08¹™º™ *cascade08º™»™ *cascade08»™¾™*cascade08¾™¿™ *cascade08¿™À™ *cascade08À™Á™ *cascade08Á™Æ™*cascade08Æ™Ç™ *cascade08Ç™È™*cascade08È™É™ *cascade08É™Ê™ *cascade08Ê™Î™*cascade08Î™Ï™ *cascade08Ï™Ñ™ *cascade08Ñ™Ó™*cascade08Ó™Ô™ *cascade08Ô™Õ™ *cascade08Õ™Ö™*cascade08Ö™×™ *cascade08×™Ø™ *cascade08Ø™Ü™*cascade08Ü™İ™ *cascade08İ™á™*cascade08á™â™ *cascade08â™ç™*cascade08ç™è™ *cascade08è™ì™*cascade08ì™í™ *cascade08í™ğ™*cascade08ğ™ñ™ *cascade08ñ™ò™ *cascade08ò™õ™*cascade08õ™ö™ *cascade08ö™ø™*cascade08ø™ù™ *cascade08ù™ú™ *cascade08ú™û™*cascade08û™ü™ *cascade08ü™ı™*cascade08ı™ş™ *cascade08ş™ÿ™ *cascade08ÿ™€š *cascade08€šš *cascade08š‚š *cascade08‚šƒš *cascade08ƒš„š *cascade08„š…š *cascade08…š‡š*cascade08‡šˆš *cascade08ˆšš*cascade08šš *cascade08š’š*cascade08’š”š*cascade08”š–š *cascade08–šš *cascade08šŸš *cascade08Ÿš š *cascade08 š£š*cascade08£š¤š *cascade08¤š¥š *cascade08¥š§š*cascade08§š¨š *cascade08¨š©š *cascade08©šªš*cascade08ªš¬š*cascade08¬š­š *cascade08­š®š *cascade08®š°š *cascade08°š²š *cascade08²šµš*cascade08µšÅš *cascade08Åš©© *cascade08©©İ© *cascade08İ©í©*cascade08í©Œ« *cascade08Œ««*cascade08«« *cascade08«”«*cascade08”«–« *cascade08–«™«*cascade08™«›« *cascade08›««*cascade08«Ÿ« *cascade08Ÿ«¢«*cascade08¢«£« *cascade08£«¨«*cascade08¨«©« *cascade08©«´«*cascade08´«µ« *cascade08µ«¸«*cascade08¸«¹« *cascade08¹«Å«*cascade08Å«Æ« *cascade08Æ«É«*cascade08É«Ë« *cascade08Ë«Ì«*cascade08Ì«Í« *cascade08Í«Ö«*cascade08Ö«×« *cascade08×«Û«*cascade08Û«Ü« *cascade08Ü«ç«*cascade08ç«è« *cascade08è«ô«*cascade08ô«õ« *cascade08õ«ı«*cascade08ı«ÿ« *cascade08ÿ«¬*cascade08¬¬ *cascade08¬“¬*cascade08“¬”¬ *cascade08”¬˜¬*cascade08˜¬š¬ *cascade08š¬¦¬*cascade08¦¬¨¬ *cascade08¨¬ª¬*cascade08ª¬à¬ *cascade08à¬á¬*cascade08á¬ã¬ *cascade08ã¬ä¬*cascade08ä¬è¬ *cascade08è¬ë¬*cascade08ë¬ì¬ *cascade08ì¬ï¬*cascade08ï¬ò¬ *cascade08ò¬ó¬*cascade08ó¬•­ *cascade08•­–­*cascade08–­š­ *cascade08š­›­*cascade08›­®­ *cascade08®­¯­*cascade08¯­°­ *cascade08°­±­*cascade08±­Ã­ *cascade08Ã­Å­*cascade08Å­È­ *cascade08È­É­*cascade08É­Ú­ *cascade08Ú­û­*cascade08û­ü­ *cascade08ü­œ®*cascade08œ®©® *cascade08©®«®*cascade08«®¬® *cascade08¬®Ô®*cascade08Ô®Ü® *cascade08Ü®è®*cascade08è®ı® *cascade08ı®ÿ®*cascade08ÿ®€¯ *cascade08€¯¯*cascade08¯’¯ *cascade08’¯¤¯*cascade08¤¯¥¯ *cascade08¥¯¬¯*cascade08¬¯­¯ *cascade08­¯±¯*cascade08±¯²¯ *cascade08²¯Õ¯*cascade08Õ¯Ö¯ *cascade08Ö¯á¯*cascade08á¯ç¯ *cascade08ç¯é¯*cascade08é¯¦° *cascade08¦°¹°*cascade08¹°Ï° *cascade08Ï°Ò°*cascade08Ò°Ó° *cascade08Ó°Õ°*cascade08Õ°ô° *cascade08ô°ö°*cascade08ö°ø° *cascade08ø°ú°*cascade08ú°û° *cascade08û°ü°*cascade08ü°ı° *cascade08ı°ş°*cascade08ş°± *cascade08±±*cascade08±—± *cascade08—±˜±*cascade08˜±‚² *cascade08‚²ƒ²*cascade08ƒ²’² *cascade08’²“²*cascade08“²²² *cascade08²²³²*cascade08³²³ *cascade08³³*cascade08³Ş³ *cascade08Ş³ß³*cascade08ß³ã³ *cascade08ã³ò³*cascade08ò³ş³ *cascade08ş³€´*cascade08€´¿´ *cascade08¿´À´*cascade08À´Ê´ *cascade08Ê´Ë´*cascade08Ë´ µ *cascade08 µ¢µ*cascade08¢µÆµ *cascade08ÆµÈµ*cascade08Èµøµ *cascade08øµúµ*cascade08úµ¶ *cascade08¶¶*cascade08¶û¶ *cascade08û¶ı¶*cascade08ı¶¡· *cascade08¡·£·*cascade08£·­· *cascade08­·®·*cascade08®·¶· *cascade08¶···*cascade08··æ· *cascade08æ·õ·*cascade08õ·¾¸ *cascade08¾¸À¸*cascade08À¸Á¸ *cascade08Á¸Ä¸*cascade08Ä¸Å¸ *cascade08Å¸Æ¸*cascade08Æ¸È¸ *cascade08È¸Ë¸*cascade08Ë¸Í¸ *cascade08Í¸Ğ¸*cascade08Ğ¸Ñ¸ *cascade08Ñ¸Ô¸*cascade08Ô¸Õ¸ *cascade08Õ¸Ú¸*cascade08Ú¸Û¸ *cascade08Û¸æ¸*cascade08æ¸ç¸ *cascade08ç¸ê¸*cascade08ê¸ë¸ *cascade08ë¸÷¸*cascade08÷¸ø¸ *cascade08ø¸û¸*cascade08û¸ı¸ *cascade08ı¸ş¸*cascade08ş¸ÿ¸ *cascade08ÿ¸ˆ¹*cascade08ˆ¹‰¹ *cascade08‰¹Š¹*cascade08Š¹Œ¹ *cascade08Œ¹™¹*cascade08™¹š¹ *cascade08š¹¡¹*cascade08¡¹¢¹ *cascade08¢¹¦¹*cascade08¦¹§¹ *cascade08§¹¾¹*cascade08¾¹À¹ *cascade08À¹Â¹*cascade08Â¹è¹ *cascade08è¹é¹*cascade08é¹ë¹ *cascade08ë¹ì¹*cascade08ì¹ğ¹ *cascade08ğ¹ó¹*cascade08ó¹ô¹ *cascade08ô¹÷¹*cascade08÷¹ú¹ *cascade08ú¹û¹*cascade08û¹º *cascade08ºº*cascade08º¢º *cascade08¢º£º*cascade08£º¶º *cascade08¶º·º*cascade08·º¸º *cascade08¸º¿»*cascade08¿»À» *cascade08À»Á»*cascade08Á»Ä» *cascade08Ä»¡¼*cascade08¡¼£¼ *cascade08£¼¯¼*cascade08¯¼°¼ *cascade08°¼±¼*cascade08±¼¹¼ *cascade08¹¼º¼*cascade08º¼ñ¼ *cascade08ñ¼ó¼*cascade08ó¼À½ *cascade08À½Ñ½*cascade08Ñ½Ò½ *cascade08Ò½Õ½*cascade08Õ½Ú½ *cascade08Ú½ß½*cascade08ß½Ë¾ *cascade08Ë¾Í¾*cascade08Í¾Î¾ *cascade08Î¾Ğ¾*cascade08Ğ¾¿ *cascade08¿‚¿*cascade08‚¿”¿ *cascade08”¿–¿*cascade08–¿¢¿ *cascade08¢¿£¿*cascade08£¿®¿ *cascade08®¿´¿*cascade08´¿¸¿ *cascade08¸¿º¿*cascade08º¿ÔÀ *cascade08ÔÀİÀ*cascade08İÀâÀ *cascade08âÀäÀ*cascade08äÀ¯Á *cascade08¯ÁÒÁ*cascade08ÒÁŞÁ *cascade08ŞÁàÁ*cascade08àÁßÂ *cascade08ßÂáÂ*cascade08áÂ†Ã *cascade08†ÃˆÃ*cascade08ˆÃ˜Ã *cascade08˜Ã›Ã*cascade08›ÃœÃ *cascade08œÃÃ*cascade08ÃÃ *cascade08Ã Ã*cascade08 Ã¡Ã *cascade08¡ÃªÃ*cascade08ªÃ«Ã *cascade08«Ã¬Ã*cascade08¬Ã·Ã *cascade08·Ã¹Ã*cascade08¹ÃĞÃ *cascade08ĞÃÒÃ*cascade08ÒÃÓÃ *cascade08ÓÃÕÃ*cascade08ÕÃŠÄ *cascade08ŠÄ‹Ä*cascade08‹ÄÄ *cascade08Ä¡Ä*cascade08¡Ä­Ä *cascade08­Ä¯Ä*cascade08¯Ä–Å *cascade08–Å˜Å*cascade08˜ÅºÅ *cascade08ºÅ¼Å*cascade08¼ÅÂÅ *cascade08ÂÅÆÅ*cascade08ÆÅÇÅ *cascade08ÇÅÏÅ*cascade08ÏÅĞÅ *cascade08ĞÅÒÅ*cascade08ÒÅÓÅ *cascade08ÓÅÖÅ*cascade08ÖÅßÅ *cascade08ßÅîÅ*cascade08îÅ¤Æ *cascade08¤Æ±Æ*cascade08±ÆâÒ *cascade08âÒéë *cascade08éë²ì *cascade08²ì´ì*cascade08´ìµì *cascade08µìÀì*cascade08ÀìÁì *cascade08Áì™í *cascade08™íší *cascade08ší¢í*cascade08¢í£í *cascade08£í°í*cascade08°í±í *cascade08±íÂí*cascade08ÂíÃí *cascade08Ãí”î *cascade08”î•î *cascade08•î£î*cascade08£î¤î *cascade08¤î®î*cascade08®î¯î *cascade08¯î³î*cascade08³î´î *cascade08´îÀî *cascade08ÀîÁî *cascade08ÁîËî*cascade08ËîÌî *cascade08ÌîÔî*cascade08ÔîÖî *cascade08Öîüî*cascade08üîıî *cascade08ıî“ï*cascade08“ï—ï *cascade08—ï™ï*cascade08™ïšï *cascade08šï›ï*cascade08›ïœï *cascade08œïœğ *cascade08œğğ *cascade08ğ¡ğ*cascade08¡ğ£ğ *cascade08£ğ«ğ*cascade08«ğ¬ğ *cascade08¬ğ´ğ*cascade08´ğµğ *cascade08µğÃğ *cascade08ÃğÅğ *cascade08ÅğÈğ*cascade08ÈğÉğ *cascade08ÉğÔğ*cascade08ÔğÕğ *cascade08Õğíğ *cascade08íğîğ *cascade08îğ£ñ *cascade08£ñ©ñ *cascade08©ñ¦ò *cascade08¦ò§ò *cascade08§ò·ò *cascade08·ò¸ò *cascade08¸òÈò*cascade08ÈòÊò *cascade08Êòãò *cascade08ãòèò *cascade08èòõò*cascade08õòøò *cascade08øòŒó *cascade08Œóó *cascade08ó©ó *cascade08©óªó *cascade08ªóÉó*cascade08ÉóÓô *cascade08Óôêô *cascade08êô¥õ *cascade08¥õÇõ *cascade08ÇõŞõ *cascade08Şõßõ*cascade08ßõÑö *cascade08ÑöÁ÷ *cascade08Á÷Ã‚ *cascade08Ã‚Ÿ… *cascade08Ÿ…àŒ *cascade08àŒáŒ*cascade08áŒâŒ *cascade08âŒãŒ*cascade08ãŒïŒ *cascade08ïŒğŒ*cascade08ğŒñŒ *cascade08ñŒöŒ*cascade08öŒ’ *cascade08’“*cascade08“” *cascade08”™*cascade08™ä *cascade08äå*cascade08åæ *cascade08æë*cascade08ë« *cascade08«¤ *cascade08¤‘” *cascade08‘””*cascade08” ” *cascade08 ”¡”*cascade08¡”¢” *cascade08¢”©”*cascade08©”ª” *cascade08ª”¬”*cascade08¬”°” *cascade08°”±”*cascade08±”²” *cascade08²”·”*cascade08·”º” *cascade08º”Á”*cascade08Á”Â” *cascade08Â”Æ”*cascade08Æ”È” *cascade08È”Ë” *cascade08Ë”Ì” *cascade08Ì”Ñ”*cascade08Ñ”Ò” *cascade08Ò”Ô”*cascade08Ô”Õ” *cascade08Õ”Ö”*cascade08Ö”Ø” *cascade08Ø”Ú”*cascade08Ú”Û” *cascade08Û”Ü”*cascade08Ü”è” *cascade08è”é”*cascade08é”ê” *cascade08ê”ï”*cascade08ï”§• *cascade08§•¿•*cascade08¿•î• *cascade08î•¥– *cascade08¥–‡› *cascade08‡›ˆ›*cascade08ˆ›‰› *cascade08‰››*cascade08›–› *cascade08–›¢›*cascade08¢›£› *cascade08£›­›*cascade08­›²› *cascade08²›´›*cascade08´›¼› *cascade08¼›¿›*cascade08¿›Æœ *cascade08ÆœÇœ*cascade08ÇœÈœ *cascade08ÈœÍœ*cascade08ÍœÚœ *cascade08Úœğœ *cascade08ğœñœ *cascade08ñœùœ*cascade08ùœü *cascade08üı*cascade08ış *cascade08şƒŸ*cascade08ƒŸ‰Ÿ *cascade08‰Ÿ Ÿ *cascade08 Ÿ“¢ *cascade08“¢ì¥ *cascade08ì¥û¥*cascade08û¥Ğ¦ *cascade08Ğ¦ß¦*cascade08ß¦íµ *cascade08íµîÏ *cascade08îÏîÏ*cascade08îÏğÏ*cascade08ğÏøÒ *cascade08øÒùÒ*cascade08ùÒúÒ *cascade08úÒÿÒ*cascade08ÿÒ…Ó *cascade08…ÓšÓ *cascade08šÓçİ *cascade08çİèİ*cascade08èİĞà *cascade08Ğàãâ *cascade08ãâĞæ *cascade08ĞæÑæ*cascade08ÑæÙæ *cascade08ÙæÚæ*cascade08ÚæÛæ *cascade08ÛæÜæ*cascade08Üæäæ *cascade082Kfile:///c:/Users/HP/SIH%20antigravity/Vaani-AI/santhali-pathshala/js/app.js