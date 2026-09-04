import re
text = open('generate_ncert.py', encoding='utf-8').read()
def repl(m):
    return f'("{m.group(1)}", "{m.group(2)}", "{m.group(2)}")'
text = re.sub(r'\("([^"]+)", "([^"]+ vocabulary word [^"]+)"\)', repl, text)
open('generate_ncert.py', 'w', encoding='utf-8').write(text)
