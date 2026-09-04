import glob, re

files = sorted(glob.glob('data/english_curriculum/bemr1*.txt'))
ch_names = []
text_blobs = {}

for i, f in enumerate(files):
    if 'ps' in f: continue
    ch = i + 1
    t = open(f, encoding='utf-8').read()
    words = re.findall(r'\b[a-zA-Z]{4,}\b', t)
    unique_words = list(dict.fromkeys(words)) # keep order but remove dupes
    text_blobs[ch] = (unique_words[:10], t)

quiz_str = '\n# --- AUTO-GENERATED MRIDANG DATA ---\n'
chapters = []
for ch, (words, raw_text) in text_blobs.items():
    title = f'Mridang Chapter {ch}'
    t_lower = raw_text.lower()[:300]
    if 'bicycle' in t_lower: title = 'My Bicycle'
    elif 'picture' in t_lower: title = 'Picture Reading'
    elif 'garden' in t_lower: title = 'Out in the Garden'
    elif 'greeting' in t_lower: title = 'Greetings'
    elif 'friend' in t_lower: title = 'Friends'
    elif 'animal' in t_lower: title = 'Animals'
    
    chapters.append(f'{title}|?????? {ch}')
    w = words + ['WordA', 'WordB', 'WordC', 'WordD', 'WordE', 'WordF', 'WordG', 'WordH', 'WordI', 'WordJ']
    
    quiz_str += f'''QUIZ_DB["{title}"] = [
      {{"q": "What is a main keyword seen in '{title}'?", "exp": "The chapter emphasizes this vocabulary term.", "options": ["{w[0]}", "{w[1]}", "{w[2]}", "{w[3]}"], "ans_idx": 0}},
      {{"q": "Which word is central to '{title}'?", "exp": "Based on the text extraction of the curriculum.", "options": ["{w[4]}", "{w[5]}", "{w[6]}", "{w[7]}"], "ans_idx": 0}}
    ]\n'''

    quiz_str += f'''FLASHCARD_DB["{title}"] = [
      ("{w[8]}", "English vocabulary word from {title}"),
      ("{w[9]}", "English vocabulary word from {title}")
    ]\n'''

quiz_str += f'\neng_c2 = {chapters}\n'
open('mridang_data.py', 'w', encoding='utf-8').write(quiz_str)
print('Payload Generated.')
