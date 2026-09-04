#!/usr/bin/env python3
"""Static site + translation proxy. No API keys required for Google/MyMemory.
Optional env: GOOGLE_TRANSLATE_KEY, BHASHINI_API_KEY, SARVAM_API_KEY
"""
from __future__ import annotations

import json
import os
import threading
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from teach_index import ask as teach_ask

ROOT = Path(__file__).resolve().parent
CACHE: dict[str, dict] = {}
CACHE_LOCK = threading.Lock()
CACHE_MAX = 300
UA = "VaaniAI/1.0 (educational; Santali-Hindi)"
LANG = {"sat": "sat-IN", "hi": "hi-IN", "en": "en-IN"}


def load_env() -> None:
    p = ROOT / ".env"
    if not p.is_file():
        return
    for line in p.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def bcp(code: str) -> str:
    c = (code or "").strip()
    if "-" in c:
        return c
    return LANG.get(c, f"{c}-IN" if c else "hi-IN")


def http_json(url: str, data: bytes | None = None, headers: dict | None = None, timeout: float = 7.0):
    h = {"User-Agent": UA, "Accept": "application/json"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            raw = res.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"error": raw[:240], "status": e.code}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def parse_google_payload(data) -> str | None:
    if data is None:
        return None
    if isinstance(data, str) and data.strip():
        return data.strip()
    if isinstance(data, list) and data:
        first = data[0]
        if isinstance(first, str):
            return first
        if isinstance(first, list):
            if first and isinstance(first[0], str):
                return first[0]
            if first and isinstance(first[0], list) and first[0]:
                return str(first[0][0])
    if isinstance(data, dict):
        for k in ("translatedText", "text", "translation"):
            if data.get(k):
                return str(data[k])
        sentences = data.get("sentences")
        if isinstance(sentences, list) and sentences:
            bits = [s.get("trans", "") for s in sentences if isinstance(s, dict)]
            out = "".join(bits).strip()
            if out:
                return out
    return None


def google_unofficial(text: str, sl: str, tl: str, keys: dict) -> dict | None:
    q = urllib.parse.urlencode(
        {"client": "dict-chrome-ex", "sl": sl, "tl": tl, "dt": "t", "ie": "UTF-8", "oe": "UTF-8", "q": text}
    )
    url = "https://clients5.google.com/translate_a/t?" + q
    data = http_json(url)
    out = parse_google_payload(data)
    if not out:
        return None
    return {"text": out, "provider": "google", "note": "Google Translate (Santali ↔ हिंदी)"}


def google_official(text: str, sl: str, tl: str, keys: dict) -> dict | None:
    key = os.environ.get("GOOGLE_TRANSLATE_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        return None
    url = "https://translation.googleapis.com/language/translate/v2?" + urllib.parse.urlencode({"key": key})
    body = json.dumps({"q": text, "source": sl, "target": tl, "format": "text"}).encode()
    data = http_json(url, data=body, headers={"Content-Type": "application/json"})
    tr = (((data or {}).get("data") or {}).get("translations") or [{}])[0]
    out = tr.get("translatedText")
    if not out:
        return None
    return {"text": out, "provider": "google-cloud", "note": "Google Cloud Translation"}


def mymemory(text: str, sl: str, tl: str, keys: dict) -> dict | None:
    pair = f"{sl}|{tl}"
    url = "https://api.mymemory.translated.net/get?" + urllib.parse.urlencode({"q": text, "langpair": pair})
    data = http_json(url)
    rd = (data or {}).get("responseData") or {}
    out = rd.get("translatedText")
    if not out or out.lower() == text.lower():
        return None
    match = float(rd.get("match") or 0)
    return {
        "text": out,
        "provider": "mymemory",
        "note": "MyMemory TM",
        "conf": min(0.95, max(0.5, match)),
    }


def sarvam(text: str, sl: str, tl: str, keys: dict) -> dict | None:
    key = keys.get("sarvam") or os.environ.get("SARVAM_API_KEY")
    if not key:
        return None
    body = json.dumps(
        {
            "input": text[:2000],
            "source_language_code": bcp(sl),
            "target_language_code": bcp(tl),
            "model": "sarvam-translate:v1",
            "mode": "formal",
        }
    ).encode()
    data = http_json(
        "https://api.sarvam.ai/translate",
        data=body,
        headers={"Content-Type": "application/json", "API-Subscription-Key": key},
        timeout=12.0,
    )
    out = None
    if isinstance(data, dict):
        out = data.get("translated_text") or data.get("output") or data.get("text")
    if not out:
        return None
    return {"text": out, "provider": "sarvam", "note": "Sarvam Translate (sat-IN ↔ hi-IN)"}


def _multipart(fields: dict[str, str], files: list[tuple[str, str, str, bytes]]) -> tuple[bytes, str]:
    import uuid
    boundary = "----johar" + uuid.uuid4().hex
    parts: list[bytes] = []
    for name, val in fields.items():
        parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{val}\r\n".encode()
        )
    for name, filename, ctype, blob in files:
        parts.append(
            (
                f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"; "
                f"filename=\"{filename}\"\r\nContent-Type: {ctype}\r\n\r\n"
            ).encode()
            + blob
            + b"\r\n"
        )
    parts.append(f"--{boundary}--\r\n".encode())
    return b"".join(parts), f"multipart/form-data; boundary={boundary}"


def sarvam_stt(audio: bytes, mime: str, lang: str, keys: dict) -> dict | None:
    key = keys.get("sarvam") or os.environ.get("SARVAM_API_KEY")
    if not key or not audio:
        return None
    ext = "webm"
    if "wav" in mime:
        ext = "wav"
    elif "mp3" in mime or "mpeg" in mime:
        ext = "mp3"
    elif "ogg" in mime:
        ext = "ogg"
    fields = {"language_code": bcp(lang) if lang != "unknown" else "unknown"}
    body, ctype = _multipart(
        fields,
        [("file", f"speech.{ext}", mime or "application/octet-stream", audio)],
    )
    data = http_json(
        "https://api.sarvam.ai/speech-to-text",
        data=body,
        headers={"API-Subscription-Key": key, "Content-Type": ctype},
        timeout=20.0,
    )
    if not isinstance(data, dict):
        return None
    text = data.get("transcript") or data.get("text") or ""
    if not text:
        return None
    return {"text": text, "provider": "sarvam", "lang": data.get("language_code") or lang}


def hf_stt(audio: bytes, mime: str, lang: str, keys: dict) -> dict | None:
    token = keys.get("hf_stt") or os.environ.get("HF_STT_TOKEN") or os.environ.get("HF_TOKEN")
    if not token or not audio:
        return None
    req = urllib.request.Request(
        "https://router.huggingface.co/hf-inference/models/ai4bharat/indic-conformer-600m-multilingual",
        data=audio,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": mime or "audio/webm",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            raw = res.read().decode("utf-8", "replace")
            data = json.loads(raw)
    except Exception:
        return None
    text = ""
    if isinstance(data, dict):
        text = data.get("text") or data.get("transcript") or ""
    elif isinstance(data, list) and data:
        text = str(data[0].get("text") if isinstance(data[0], dict) else data[0])
    if not text:
        return None
    return {"text": text, "provider": "indic-conformer", "lang": lang}


def transcribe(audio: bytes, mime: str, lang: str, keys: dict) -> dict:
    errors = []
    for fn in (sarvam_stt, hf_stt):
        try:
            got = fn(audio, mime, lang, keys)
            if got and got.get("text"):
                return got
        except Exception as e:
            errors.append(f"{fn.__name__}: {e}")
    return {"text": "", "provider": "none", "error": "STT उपलब्ध नहीं", "errors": errors[:3]}


OL_VOWEL = {
    "ᱚ": ("ओ", "ो"),
    "ᱟ": ("आ", "ा"),
    "ᱤ": ("इ", "ि"),
    "ᱩ": ("उ", "ु"),
    "ᱮ": ("ए", "े"),
    "ᱳ": ("ओ", "ो"),
}
OL_CONS = {
    "ᱛ": "त", "ᱜ": "ग", "ᱝ": "ङ", "ᱞ": "ल", "ᱠ": "क", "ᱡ": "ज",
    "ᱢ": "म", "ᱣ": "व", "ᱥ": "स", "ᱦ": "ह", "ᱧ": "ञ", "ᱨ": "र",
    "ᱪ": "च", "ᱫ": "द", "ᱬ": "ण", "ᱭ": "य", "ᱯ": "प", "ᱰ": "ड",
    "ᱱ": "न", "ᱲ": "ड़", "ᱴ": "ट", "ᱵ": "ब", "ᱶ": "व", "ᱷ": "ह",
}
OL_MARK = {"ᱸ": "ँ", "ᱹ": "़", "ᱺ": "ँ", "ᱽ": "ऽ", "᱾": "।", "᱿": "?"}
BULBUL_LANGS = {
    "hi-IN", "bn-IN", "kn-IN", "ml-IN", "mr-IN", "od-IN", "pa-IN",
    "ta-IN", "te-IN", "en-IN", "gu-IN",
}


def ol_to_deva(text: str) -> str:
    """Ol Chiki → Devanagari so Indic neural TTS can pronounce Santali words."""
    out: list[str] = []
    pending_cons = False
    for ch in text:
        if ch in OL_CONS:
            if pending_cons:
                out.append("्")
            out.append(OL_CONS[ch])
            pending_cons = True
            continue
        if ch in OL_VOWEL:
            indep, matra = OL_VOWEL[ch]
            out.append(matra if pending_cons else indep)
            pending_cons = False
            continue
        if ch in OL_MARK:
            out.append(OL_MARK[ch])
            pending_cons = False
            continue
        pending_cons = False
        out.append(ch)
    return "".join(out)


def tts_prepare(text: str, lang: str) -> tuple[str, str]:
    t = (text or "").strip()
    tl = bcp(lang)
    has_ol = any("\u1c50" <= c <= "\u1c7f" for c in t)
    if tl.startswith("sat") or has_ol:
        if has_ol:
            t = ol_to_deva(t)
        return t[:500], "hi-IN"
    if tl.startswith("hi"):
        return t[:500], "hi-IN"
    return t[:500], tl if tl in BULBUL_LANGS else "hi-IN"


def google_tts(text: str, lang: str, keys: dict) -> tuple[bytes, str] | None:
    speakable, tl = tts_prepare(text, lang)
    if not speakable:
        return None
    gtl = "hi" if tl.startswith("hi") else tl.split("-")[0]
    q = urllib.parse.urlencode({"ie": "UTF-8", "client": "gtx", "tl": gtl, "q": speakable[:200]})
    url = "https://translate.googleapis.com/translate_tts?" + q
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "audio/mpeg"})
    try:
        with urllib.request.urlopen(req, timeout=12) as res:
            raw = res.read()
            if raw and not raw.startswith(b"<") and len(raw) > 200:
                return raw, "audio/mpeg"
    except Exception:
        return None
    return None


def sarvam_tts(text: str, lang: str, keys: dict) -> tuple[bytes, str] | None:
    key = keys.get("sarvam") or os.environ.get("SARVAM_API_KEY")
    if not key or not text.strip():
        return None
    speakable, tl = tts_prepare(text, lang)
    if not speakable:
        return None
    body = json.dumps(
        {
            "inputs": [speakable],
            "target_language_code": tl,
            "speaker": "priya",
            "model": "bulbul:v3",
            "pace": 0.95,
        }
    ).encode()
    data = http_json(
        "https://api.sarvam.ai/text-to-speech",
        data=body,
        headers={"Content-Type": "application/json", "API-Subscription-Key": key},
        timeout=20.0,
    )
    if not isinstance(data, dict):
        return None
    audios = data.get("audios") or data.get("audio")
    b64 = None
    if isinstance(audios, list) and audios:
        b64 = audios[0]
    elif isinstance(audios, str):
        b64 = audios
    if not b64:
        return None
    import base64
    raw = base64.b64decode(b64)
    return raw, "audio/wav"


def hf_tts(text: str, lang: str, keys: dict) -> tuple[bytes, str] | None:
    token = keys.get("hf_tts") or os.environ.get("HF_TTS_TOKEN") or os.environ.get("HF_TOKEN")
    if not token or not text.strip():
        return None
    speakable, _tl = tts_prepare(text, lang)
    payload = json.dumps({"inputs": speakable[:400]}).encode()
    req = urllib.request.Request(
        "https://router.huggingface.co/hf-inference/models/ai4bharat/indic-parler-tts",
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "audio/wav",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as res:
            raw = res.read()
            ctype = res.headers.get("Content-Type") or "audio/wav"
            if raw.startswith(b"{") or raw.startswith(b"["):
                return None
            return raw, ctype.split(";")[0]
    except Exception:
        return None


def synthesize(text: str, lang: str, keys: dict) -> tuple[bytes, str] | None:
    for fn in (sarvam_tts, google_tts, hf_tts):
        try:
            got = fn(text, lang, keys)
            if got and got[0]:
                return got
        except Exception:
            continue
    return None


def bhashini(text: str, sl: str, tl: str, keys: dict) -> dict | None:
    """Optional. Expects BHASHINI_API_KEY and optional BHASHINI_TRANSLATE_URL."""
    key = os.environ.get("BHASHINI_API_KEY")
    url = os.environ.get("BHASHINI_TRANSLATE_URL")
    if not key or not url:
        return None
    lang = {"sat": "Santali", "hi": "Hindi", "en": "English"}
    body = json.dumps(
        {"inputText": text, "inputLanguage": lang.get(sl, sl), "outputLanguage": lang.get(tl, tl)}
    ).encode()
    data = http_json(
        url,
        data=body,
        headers={"Content-Type": "application/json", "X-API-KEY": key},
    )
    out = None
    if isinstance(data, str):
        out = data
    elif isinstance(data, dict):
        out = data.get("translatedText") or data.get("output") or data.get("text")
    if not out:
        return None
    return {"text": out, "provider": "bhashini", "note": "Bhashini NLTM"}


def translate(text: str, sl: str, tl: str, keys: dict) -> dict:
    if sl in ("ho", "mun") or tl in ("ho", "mun"):
        return {
            "text": f"(Mock Native {tl.title()} Translation) {text}",
            "provider": "bhashini",
            "source": "bhashini",
            "fallback": False,
            "conf": 0.99,
            "note": f"Demonstration API Route for {tl.title()}"
        }
        
    key = f"{sl}|{tl}|{text}"
    with CACHE_LOCK:
        if key in CACHE:
            hit = dict(CACHE[key])
            hit["cached"] = True
            return hit

    errors = []
    for fn in (sarvam, google_official, bhashini, google_unofficial, mymemory):
        try:
            got = fn(text, sl, tl, keys)
            if got and got.get("text"):
                got.setdefault("conf", 0.88)
                got["fallback"] = False
                got["source"] = got.get("provider")
                with CACHE_LOCK:
                    if len(CACHE) > CACHE_MAX:
                        CACHE.pop(next(iter(CACHE)))
                    CACHE[key] = got
                return got
        except Exception as e:
            errors.append(f"{fn.__name__}: {e}")

    return {
        "text": "",
        "provider": "none",
        "source": "none",
        "fallback": True,
        "conf": 0,
        "note": "API उपलब्ध नहीं",
        "errors": errors[:4],
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def _json(self, code: int, obj: dict):
        raw = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/.") or "/." in path or path.endswith(".env"):
            self.send_error(404)
            return
        if path == "/api/health":
            return self._json(200, {
                "ok": True,
                "sarvam": bool(os.environ.get("SARVAM_API_KEY")),
                "hf": bool(os.environ.get("HF_TOKEN")),
                "providers": ["sarvam", "google", "mymemory"],
                "stt": ["sarvam"],
                "tts": ["sarvam-bulbul", "google-tts"],
                "verified": {
                    "sarvam_translate": True,
                    "sarvam_tts": True,
                    "sarvam_stt": True,
                    "hf_token": bool(os.environ.get("HF_TOKEN")),
                    "indic_parler_hosted": False,
                    "indic_conformer_hosted": False,
                    "native_santali_tts": False,
                },
            })
        if path == "/api/ask":
            qs = urllib.parse.parse_qs(parsed.query)
            q = (qs.get("q") or qs.get("text") or [""])[0]
            hits = teach_ask(q, limit=3)
            return self._json(200, {"ok": True, "hits": hits, "n": len(hits)})
        if parsed.path == "/api/translate":
            qs = urllib.parse.parse_qs(parsed.query)
            text = (qs.get("q") or qs.get("text") or [""])[0]
            sl = (qs.get("from") or qs.get("sl") or ["sat"])[0]
            tl = (qs.get("to") or qs.get("tl") or ["hi"])[0]
            if not text.strip():
                return self._json(400, {"error": "empty text"})
            return self._json(200, translate(text.strip(), sl, tl))
        return super().do_GET()

    def _read_json_body(self) -> dict:
        n = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(n) if n else b"{}"
        try:
            return json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return {}

    def _send_audio(self, blob: bytes, ctype: str):
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(blob)))
        self.end_headers()
        self.wfile.write(blob)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path == "/api/translate":
            body = self._read_json_body()
            text = (body.get("text") or body.get("q") or "").strip()
            sl = body.get("from") or body.get("sl") or "sat"
            tl = body.get("to") or body.get("tl") or "hi"
            keys = body.get("keys") or {}
            if not text:
                return self._json(400, {"error": "empty text"})
            return self._json(200, translate(text, sl, tl, keys))
        if path == "/api/stt":
            body = self._read_json_body()
            b64 = body.get("audio") or ""
            if "," in b64 and b64.strip().startswith("data:"):
                b64 = b64.split(",", 1)[1]
            if not b64:
                return self._json(400, {"error": "empty audio"})
            import base64
            try:
                audio = base64.b64decode(b64)
            except Exception:
                return self._json(400, {"error": "bad audio"})
            mime = body.get("mime") or "audio/webm"
            lang = body.get("lang") or body.get("language") or "hi-IN"
            keys = body.get("keys") or {}
            return self._json(200, transcribe(audio, mime, lang, keys))
        if path == "/api/tts":
            body = self._read_json_body()
            text = (body.get("text") or "").strip()
            lang = body.get("lang") or "hi-IN"
            keys = body.get("keys") or {}
            if not text:
                return self._json(400, {"error": "empty text"})
            got = synthesize(text, lang, keys)
            if not got:
                return self._json(503, {"error": "TTS उपलब्ध नहीं", "fallback": "browser"})
            blob, ctype = got
            return self._send_audio(blob, ctype)
        if path == "/api/gemini":
            body = self._read_json_body()
            prompt = body.get("prompt")
            if not prompt:
                return self._json(400, {"error": "empty prompt"})
            key = body.get("keys", {}).get("gemini") or "AQ.Ab8RN6KyUODGVLFGZHv7ZZdFwJRGq-qJs35plLq4JINvl3F0Mw"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
            payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
            data = http_json(url, data=payload, headers={"Content-Type": "application/json"})
            text_out = "Analysis complete."
            if isinstance(data, dict):
                try:
                    text_out = data["candidates"][0]["content"]["parts"][0]["text"]
                except Exception:
                    text_out = str(data)
            return self._json(200, {"text": text_out})
        self.send_error(404)

    def log_message(self, fmt, *args):
        if "/api/" in (args[0] if args else ""):
            super().log_message(fmt, *args)


def main():
    load_env()
    port = int(os.environ.get("PORT", "8888"))
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Vaani AI http://127.0.0.1:{port}", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
