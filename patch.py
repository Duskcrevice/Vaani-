data = open('mridang_data.py', encoding='utf-8').read()
orig = open('generate_ncert.py', encoding='utf-8').read()
import re
new = re.sub(r'eng_c2 = \["Chapter 1.+?range\(2, 11\)\]', data, orig, flags=re.DOTALL)
open('generate_ncert.py', 'w', encoding='utf-8').write(new)
