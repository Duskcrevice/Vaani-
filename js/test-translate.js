/* Node sanity checks — not loaded by the browser */
const fs = require("fs");
const vm = require("vm");
const ctx = { console, window: {}, document: { addEventListener() {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/data.js", "utf8"), ctx);
vm.runInContext(
  fs.readFileSync(__dirname + "/app.js", "utf8").replace(
    /document\.addEventListener\("DOMContentLoaded", boot\);/,
    ""
  ),
  ctx
);
ctx.indexData();

const cases = [
  ["johar", "sat-hi", "नमस्ते"],
  ["ᱡᱚᱦᱟᱨ", "sat-hi", "नमस्ते"],
  ["जोहार", "sat-hi", "नमस्ते"],
  ["amak nutum chet", "sat-hi", "आपका नाम क्या है?"],
  ["dak", "sat-hi", "पानी"],
  ["ayo", "sat-hi", "माँ"],
  ["नमस्ते", "hi-sat", null],
  ["पानी", "hi-sat", null],
  ["माँ", "hi-sat", null]
];

let fail = 0;
for (const [inp, dir, expect] of cases) {
  const res = dir === "sat-hi" ? ctx.translateSatToHi(inp) : ctx.translateHiToSat(inp);
  const ok = expect ? res.out.includes(expect.replace("?", "").slice(0, 4)) || res.out.includes(expect) : res.out.length > 0 && res.conf > 0;
  if (!ok) {
    fail++;
    console.log("FAIL", inp, dir, "=>", res);
  } else {
    console.log("OK  ", inp, "=>", res.out, `(${Math.round(res.conf * 100)}%)`);
  }
}
if (fail) {
  console.error(fail + " failed");
  process.exit(1);
}
console.log("all passed", "words", ctx.WORDS.length, "phrases", ctx.PHRASES.length);
