import re

# We will read generate_ncert.py, find QUIZ_DB and FC_DB, and carefully insert the remaining Chapter 8 & 9 entries
with open('generate_ncert.py', 'r', encoding='utf-8') as f:
    text = f.read()

chap8_quizzes = [
    {"q": "There are 7 cars, and each car has 4 wheels. What is the total number of wheels?", "options": ["21", "28", "24", "32"], "ans_idx": 1, "exp": "The correct answer is: 28"},
    {"q": "If 25 roses are packed into vases with 5 roses in each vase, how many vases are needed?", "options": ["4", "5", "6", "10"], "ans_idx": 1, "exp": "The correct answer is: 5"},
    {"q": "What is 5 x 4?", "options": ["15", "20", "24", "25"], "ans_idx": 1, "exp": "The correct answer is: 20"},
    {"q": "Sharing 27 candles equally into 3 boxes places how many candles in each box?", "options": ["7", "8", "9", "6"], "ans_idx": 2, "exp": "The correct answer is: 9"},
    {"q": "4 x 5 gives the same result as 5 x ________.", "options": ["4", "3"], "ans_idx": 0, "exp": "The correct answer is: 4"},
    {"q": "8 packets with 5 bindis each equals ________ bindis in total.", "options": ["40", "35"], "ans_idx": 0, "exp": "The correct answer is: 40"},
    {"q": "Dividing 18 items equally among 2 people gives ________ items to each person.", "options": ["9", "8"], "ans_idx": 0, "exp": "The correct answer is: 9"},
    {"q": "Adding the table of 3 and table of 4 gives the table of ________.", "options": ["7", "8"], "ans_idx": 0, "exp": "The correct answer is: 7"},
    {"q": "A tailor puts 6 buttons on a shirt. For 30 buttons, he can complete ________ shirts.", "options": ["5", "6"], "ans_idx": 0, "exp": "The correct answer is: 5"}
]

chap9_fc = [
    ("How many months are there in a year?", "12 months.", "12 months."),
    ("Which season comes with blooming flowers and singing birds?", "Spring.", "Spring."),
    ("In which season do leaves fall from trees?", "Autumn.", "Autumn."),
    ("How many days are there in a standard week?", "7 days.", "7 days."),
    ("Which months usually have 31 days?", "January, March, May, July, August, October, December.", "January, March, May, July, August..."),
    ("Which month has the fewest number of days?", "February.", "February."),
    ("Name the fastest train in India mentioned in the travel story.", "Vande Bharat.", "Vande Bharat."),
    ("How many hours are there in 1 full day?", "24 hours.", "24 hours."),
    ("On an analog clock, what does the short hand show?", "The Hour.", "The Hour."),
    ("On an analog clock, what does the long hand show?", "The Minute.", "The Minute.")
]

chap9_quiz = [
    {"q": "In which season do peacocks dance and frogs hop with water drops?", "options": ["Winter", "Rainy / Monsoon", "Summer", "Autumn"], "ans_idx": 1, "exp": "The correct answer is: Rainy / Monsoon"},
    {"q": "Which of the following months has exactly 30 days?", "options": ["January", "March", "April", "May"], "ans_idx": 2, "exp": "The correct answer is: April"},
    {"q": "If the short hand of a clock is at 6 and the long hand is at 12, what time is it?", "options": ["12 O'clock", "6 O'clock", "3 O'clock", "9 O'clock"], "ans_idx": 1, "exp": "The correct answer is: 6 O'clock"},
    {"q": "Which festival is celebrated during the Spring season?", "options": ["Baisakhi / Holi", "Christmas", "Independence Day", "Dussehra"], "ans_idx": 0, "exp": "The correct answer is: Baisakhi / Holi"},
    {"q": "Which process takes months to complete?", "options": ["Filling a water tank", "Cooking lunch", "Seed growing into a full plant / Season changing", "Doing yoga"], "ans_idx": 2, "exp": "The correct answer is: Seed growing into a full plant"},
    {"q": "The month of February has ________ or 29 days.", "options": ["28", "30"], "ans_idx": 0, "exp": "The correct answer is: 28"},
    {"q": "There are ________ days in a week.", "options": ["7", "12"], "ans_idx": 0, "exp": "The correct answer is: 7"},
    {"q": "Blowing air into a balloon or drinking a glass of water takes a few ________.", "options": ["seconds/minutes", "months"], "ans_idx": 0, "exp": "The correct answer is: seconds/minutes"},
    {"q": "The hour hand on a clock is ________ than the minute hand.", "options": ["shorter", "longer"], "ans_idx": 0, "exp": "The correct answer is: shorter"},
    {"q": "The total number of days in April (30) and March (31) combined is ________ days.", "options": ["61", "60"], "ans_idx": 0, "exp": "The correct answer is: 61"}
]

# INJECT CHAPTER 8 REST OF QUIZZES
import json
chap8_q_str = ""
for q in chap8_quizzes:
    chap8_q_str += f',\n      {json.dumps(q, ensure_ascii=False)}'
text = re.sub(r'("Grouping and Sharing": \[\s*\{[^\}]+\})\]', r'\1' + chap8_q_str.replace('\\', '\\\\') + ']', text)

# INJECT CHAPTER 9 FC
chap9_fc_str = f'    "Which Season is it?": {chap9_fc},\n'
fc_end_idx = text.find('}\n\nQUIZ_DB = {')
if fc_end_idx != -1:
    text = text[:fc_end_idx] + ",\n" + chap9_fc_str + text[fc_end_idx:]

# INJECT CHAPTER 9 QUIZ
chap9_q_str = f'    "Which Season is it?": {json.dumps(chap9_quiz, ensure_ascii=False)},\n'
q_end_idx = text.find('}\n\ndef make_lesson')
if q_end_idx == -1:
    q_end_idx = text.find('}\n\n\ndef make_lesson')

if q_end_idx != -1:
    text = text[:q_end_idx] + ",\n" + chap9_q_str + text[q_end_idx:]

with open('generate_ncert.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Chapter 8 & 9 successfully appended!")
