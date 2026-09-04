import json
import urllib.request
import os

UI_STRINGS = {
    "nav_home": "Home",
    "nav_learn": "Learn",
    "nav_dict": "Dictionary",
    "nav_trans": "Translate",
    "nav_prac": "Practice",
    "nav_prog": "Progress",
    "nav_keys": "API Keys",
    "btn_start_learn": "Start Learning",
    "btn_open_dict": "Open Dictionary",
    "btn_practice_now": "Practice Now",
    "dash_welcome": "Welcome back to Vaani AI",
    "dash_desc": "Continue your learning journey and improve your Santali skills.",
    "curr_class": "Current Class",
    "stat_lessons": "Lessons Completed",
    "stat_words": "Words Learned",
    "stat_prac": "Practices",
    "stat_streak": "Day Streak",
    "cont_learn": "Continue Learning",
    "cls_prog": "Class Progress",
    "view_prog": "View Full Progress",
    "quick_act": "Quick Actions",
    "recent_act": "Recent Activity",
    "no_act": "No recent activity yet.",
    "completed_les": "Completed a lesson",
    "completed_prac": "Completed practice",
    "back_sub": "Back to Subjects",
    "back_les": "Back to Lessons",
    "btn_cancel": "Cancel",
    "score_msg": "You scored",
    "nc_prac": "NCERT Practice",
    "nc_prac_desc": "NCERT curriculum based flashcards, quizzes, and short videos.",
    "sel_cls": "Select Class",
    "sel_sub_cls": "Subjects for Class",
    "fc_mode": "Flashcards",
    "qz_mode": "Quiz",
    "vid_mode": "Short Video",
    "tap_flip": "(Tap to flip)",
    "fc_prev": "Previous",
    "fc_next": "Next",
    "fc_finish": "Finish",
    "nxt_q": "Next Question",
    "sw_hi": "Switch to Hindi",
    "sw_en": "Switch to English",
    "sw_sat": "Switch to Santali"
}

def t_lang(text, target):
    if not text: return ""
    req = urllib.request.Request("http://127.0.0.1:8080/api/translate")
    req.add_header('Content-Type', 'application/json')
    data = json.dumps({"text": text, "from": "en", "to": target}).encode("utf-8")
    try:
        with urllib.request.urlopen(req, data, timeout=5) as f:
            res = json.loads(f.read().decode("utf-8"))
            return res.get("text", text)
    except:
        return text

def compile_i18n():
    res = {}
    print("Translating UI framework to Hindi & Santali...")
    for k, v in UI_STRINGS.items():
        hi_val = t_lang(v, "hi")
        sat_val = t_lang(hi_val, "sat") 
        res[k] = {"en": v, "hi": hi_val, "sat": sat_val}
        print(f"[{k}] {v} | {hi_val} | {sat_val}")
    
    js = f"export const I18N = {json.dumps(res, indent=2, ensure_ascii=False)};"
    with open("js/i18n.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Succesfully compiled js/i18n.js")

if __name__ == "__main__":
    compile_i18n()
