const KEY = "johar.v1";

const EMPTY = {
  completedLessons: {},
  wordsLearned: {},
  favorites: [],
  recentSearch: [],
  recentWords: [],
  lastLesson: "c1-ol",
  streak: { count: 0, lastDate: "" },
  practice: { attempts: 0, correct: 0, sessions: [] },
  activity: []
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, streak: { count: 0, lastDate: "" } };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private mode */ }
}

export const storage = {
  get: load,
  set(patch) {
    const next = { ...load(), ...patch };
    save(next);
    return next;
  },
  touchStreak() {
    const d = load();
    const t = today();
    if (d.streak.lastDate === t) return d;
    const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    d.streak.count = d.streak.lastDate === y ? d.streak.count + 1 : 1;
    d.streak.lastDate = t;
    save(d);
    return d;
  },
  completeLesson(id) {
    const d = load();
    d.completedLessons[id] = Date.now();
    d.lastLesson = id;
    d.activity.unshift({ t: Date.now(), kind: "lesson", label: id });
    d.activity = d.activity.slice(0, 20);
    save(d);
    this.touchStreak();
    return d;
  },
  learnWord(id) {
    const d = load();
    if (!d.wordsLearned[id]) d.wordsLearned[id] = Date.now();
    d.recentWords = [id, ...d.recentWords.filter((x) => x !== id)].slice(0, 8);
    save(d);
    return d;
  },
  toggleFav(id) {
    const d = load();
    d.favorites = d.favorites.includes(id)
      ? d.favorites.filter((x) => x !== id)
      : [id, ...d.favorites];
    save(d);
    return d;
  },
  pushSearch(q) {
    if (!q) return load();
    const d = load();
    d.recentSearch = [q, ...d.recentSearch.filter((x) => x !== q)].slice(0, 8);
    save(d);
    return d;
  },
  recordPractice(correct, total, type) {
    const d = load();
    d.practice.attempts += total;
    d.practice.correct += correct;
    d.practice.sessions.unshift({ t: Date.now(), correct, total, type });
    d.practice.sessions = d.practice.sessions.slice(0, 12);
    d.activity.unshift({ t: Date.now(), kind: "practice", label: `${correct}/${total}` });
    d.activity = d.activity.slice(0, 20);
    save(d);
    this.touchStreak();
    return d;
  },
  getApiKeys() {
    try { return JSON.parse(localStorage.getItem("vaani_api_keys") || "{}"); }
    catch { return {}; }
  },
  setApiKey(service, key) {
    const keys = this.getApiKeys();
    if (!key) delete keys[service];
    else keys[service] = key.trim();
    localStorage.setItem("vaani_api_keys", JSON.stringify(keys));
  }
};
