import re, glob
# 1. GENERATE
files = sorted(glob.glob('data/english_curriculum/bemr1*.txt'))
text_blobs = {}
for i, f in enumerate(files):
    if 'ps' in f: continue
    ch = i + 1
    t = open(f, encoding='utf-8').read()
    words = re.findall(r'\b[a-zA-Z]{4,}\b', t)
    unique_words = list(dict.fromkeys(words))
    needed = 20 - len(unique_words)
    if needed > 0: unique_words += [f"Concept{j}" for j in range(needed)]
    text_blobs[ch] = (unique_words, t)

quiz_str = '\n# --- AUTO-GENERATED MRIDANG DATA ---\n'
for ch, (w, raw_text) in text_blobs.items():
    title = f'Mridang Chapter {ch}'
    t_lower = raw_text.lower()[:300]
    if 'bicycle' in t_lower: title = 'My Bicycle'
    elif 'picture' in t_lower: title = 'Picture Reading'
    elif 'garden' in t_lower: title = 'Out in the Garden'
    elif 'greeting' in t_lower: title = 'Greetings'
    elif 'friend' in t_lower: title = 'Friends'
    elif 'animal' in t_lower: title = 'Animals'
    
    quiz_str += f'QUIZ_DB["{title}"] = [\n'
    for k in range(10):
        kw = w[k % len(w)]
        opt1, opt2, opt3 = w[(k+1)%len(w)], w[(k+2)%len(w)], w[(k+3)%len(w)]
        quiz_str += f'  {{"q": "What is the meaning or context of \'{kw}\' in {title}?", "exp": "The chapter explores the concept of {kw}.", "options": ["{kw}", "{opt1}", "{opt2}", "{opt3}"], "ans_idx": 0}},\n'
    quiz_str += ']\n'
    
    quiz_str += f'FC_DB["{title}"] = [\n'
    for k in range(10, 20):
        kw = w[k % len(w)]
        quiz_str += f'  ("{kw}", "Vocabulary term extracted from {title}", "Vocabulary term extracted from {title}"),\n'
    quiz_str += ']\n'

# 2. INJECT
orig = open('generate_ncert.py', encoding='utf-8').read()
# Find the start of the previous auto-generated block and cut it out
idx = orig.find('# --- AUTO-GENERATED MRIDANG DATA ---')
if idx != -1: orig = orig[:idx]
open('generate_ncert.py', 'w', encoding='utf-8').write(orig + quiz_str)
print("INJECTED")
