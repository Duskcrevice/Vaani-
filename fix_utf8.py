import re, codecs
text = codecs.open('generate_ncert.py', 'r', 'utf-8').read()
text = re.sub(r'\?\?\?\?\?\?', 'अध्याय', text)
codecs.open('generate_ncert.py', 'w', 'utf-8').write(text)
