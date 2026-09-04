"""Stream Class 1–5 teaching files into SQLite FTS. Never loads a whole 4GB file."""
from __future__ import annotations

import json
import os
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEACH = ROOT / "data" / "teach"
DROP = TEACH / "drop"
DB = TEACH / "index.sqlite"
CHUNK = 64 * 1024
MAX_DOC = 1200
EXTS = {".jsonl", ".txt", ".md"}


def _connect() -> sqlite3.Connection:
    TEACH.mkdir(parents=True, exist_ok=True)
    DROP.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(DB), check_same_thread=False)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA synchronous=NORMAL")
    con.execute(
        """CREATE VIRTUAL TABLE IF NOT EXISTS teach USING fts5(
            id UNINDEXED, cls UNINDEXED, subject, q, a, sat, tags,
            tokenize='unicode61'
        )"""
    )
    con.execute("CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)")
    return con


def _stamp() -> str:
    parts = []
    for p in sorted(TEACH.rglob("*")):
        if p.is_file() and p.suffix.lower() in EXTS:
            st = p.stat()
            parts.append(f"{p.name}:{int(st.st_mtime)}:{st.st_size}")
    return "|".join(parts)


def _iter_jsonl(path: Path):
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        for i, line in enumerate(f):
            line = line.strip()
            if not line or line[0] != "{":
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if not isinstance(rec, dict):
                continue
            yield {
                "id": str(rec.get("id") or f"{path.stem}-{i}"),
                "cls": str(rec.get("cls") or ""),
                "subject": str(rec.get("subject") or ""),
                "q": str(rec.get("q") or "")[:400],
                "a": str(rec.get("a") or rec.get("text") or "")[:MAX_DOC],
                "sat": str(rec.get("sat") or "")[:400],
                "tags": str(rec.get("tags") or "")[:400],
            }


def _iter_text(path: Path):
    buf: list[str] = []
    n = 0
    idx = 0
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        while True:
            block = f.read(CHUNK)
            if not block:
                break
            buf.append(block)
            n += len(block)
            if n < 4000 and block:
                continue
            text = "".join(buf)
            buf = []
            n = 0
            paras = [p.strip() for p in text.replace("\r", "\n").split("\n\n") if p.strip()]
            for para in paras:
                if len(para) < 40:
                    continue
                idx += 1
                yield {
                    "id": f"{path.stem}-{idx}",
                    "cls": "",
                    "subject": path.stem,
                    "q": para[:180],
                    "a": para[:MAX_DOC],
                    "sat": "",
                    "tags": path.stem,
                }
    rest = "".join(buf).strip()
    if len(rest) >= 40:
        idx += 1
        yield {
            "id": f"{path.stem}-{idx}",
            "cls": "",
            "subject": path.stem,
            "q": rest[:180],
            "a": rest[:MAX_DOC],
            "sat": "",
            "tags": path.stem,
        }


def _iter_all():
    for path in sorted(TEACH.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        if path.name.lower().startswith("readme"):
            continue
        if path.suffix.lower() == ".jsonl":
            yield from _iter_jsonl(path)
        else:
            yield from _iter_text(path)


def rebuild_if_needed() -> None:
    con = _connect()
    cur = con.execute("SELECT v FROM meta WHERE k='stamp'")
    row = cur.fetchone()
    stamp = _stamp()
    if row and row[0] == stamp:
        con.close()
        return
    con.execute("DELETE FROM teach")
    batch = []
    for doc in _iter_all():
        batch.append((doc["id"], doc["cls"], doc["subject"], doc["q"], doc["a"], doc["sat"], doc["tags"]))
        if len(batch) >= 80:
            con.executemany("INSERT INTO teach(id,cls,subject,q,a,sat,tags) VALUES (?,?,?,?,?,?,?)", batch)
            batch.clear()
    if batch:
        con.executemany("INSERT INTO teach(id,cls,subject,q,a,sat,tags) VALUES (?,?,?,?,?,?,?)", batch)
    con.execute("INSERT OR REPLACE INTO meta(k,v) VALUES ('stamp',?)", (stamp,))
    con.commit()
    con.close()


def _fts_query(text: str) -> str:
    toks = []
    for raw in text.replace("?", " ").replace("।", " ").split():
        t = "".join(ch for ch in raw if ch.isalnum() or "\u0900" <= ch <= "\u097f" or "\u1c50" <= ch <= "\u1c7f")
        if len(t) < 2:
            continue
        toks.append('"' + t.replace('"', "") + '"')
        if len(toks) >= 8:
            break
    return " OR ".join(toks) if toks else ""


def ask(text: str, limit: int = 3) -> list[dict]:
    q = (text or "").strip()
    if len(q) < 3:
        return []
    rebuild_if_needed()
    match = _fts_query(q)
    if not match:
        return []
    con = _connect()
    try:
        rows = con.execute(
            "SELECT id, cls, subject, q, a, sat, rank FROM teach WHERE teach MATCH ? ORDER BY rank LIMIT ?",
            (match, max(1, min(limit, 5))),
        ).fetchall()
    except sqlite3.OperationalError:
        rows = []
    con.close()
    out = []
    for r in rows:
        out.append({
            "id": r[0],
            "cls": r[1],
            "subject": r[2],
            "q": r[3],
            "a": r[4],
            "sat": r[5],
        })
    return out
