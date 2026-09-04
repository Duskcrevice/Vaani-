import json
import re

raw_data = """Chapter 11: How Many Times?
Flashcards (10 Questions & Answers)
 * Flashcard 1:
   * Q: What is another name for repeated addition?
   * A: Multiplication.
 * Flashcard 2:
   * Q: If there are 3 apples in 1 bag, how many apples are there in 4 bags?
   * A: 3 + 3 + 3 + 3 = 12 (4 \times 3 = 12).
 * Flashcard 3:
   * Q: How do you write 2 + 2 + 2 + 2 + 2 in multiplication form?
   * A: 5 times 2 or 5 \times 2.
 * Flashcard 4:
   * Q: There are 9 seats in a bus and 2 people sit on each seat. How many people are in the bus?
   * A: 18 people (9 \times 2 = 18).
 * Flashcard 5:
   * Q: What is 6 times 3?
   * A: 18.
 * Flashcard 6:
   * Q: What is the sum of 5 + 5 + 5 + 5?
   * A: 20 (4 \times 5 = 20).
 * Flashcard 7:
   * Q: A cat has 4 legs. How many legs do 3 cats have in total?
   * A: 12 legs (3 \times 4 = 12).
 * Flashcard 8:
   * Q: There are 3 baskets with 3 apples each. How many total apples are there?
   * A: 9 apples (3 \times 3 = 9).
 * Flashcard 9:
   * Q: How much is 10 + 10 + 10?
   * A: 30 (3 \times 10 = 30).
 * Flashcard 10:
   * Q: What is the addition form of "4 times 2"?
   * A: 2 + 2 + 2 + 2.
Quiz (10 MCQs & Fill-ups)
 * 4 + 4 + 4 + 4 + 4 = ________
   * (A) 15
   * (B) 20
   * (C) 25
   * Answer: (B) 20
 * 3 times 5 is equal to:
   * (A) 15
   * (B) 10
   * (C) 8
   * Answer: (A) 15
 * Fill in the blank: 2 + 2 + 2 = 3 \times _____
   * (A) 3
   * (B) 2
   * (C) 6
   * Answer: (B) 2
 * A bicycle has 2 wheels. How many wheels do 5 bicycles have in total?
   * (A) 7
   * (B) 12
   * (C) 10
   * Answer: (C) 10
 * Fill in the blank: 4 groups of 5 water bottles = _____ bottles.
   * (A) 20
   * (B) 15
   * (C) 9
   * Answer: (A) 20
 * Which is the correct addition expression for 6 \times 2?
   * (A) 6 + 6
   * (B) 2 + 2 + 2 + 2 + 2 + 2
   * (C) Both (A) and (B)
   * Answer: (C) Both (A) and (B)
 * If there are 3 erasers on a table, how many erasers will be on 5 tables?
   * (A) 15
   * (B) 8
   * (C) 12
   * Answer: (A) 15
 * Fill in the blank: 10 + 10 + 10 + 10 = 4 \times _____
   * (A) 4
   * (B) 40
   * (C) 10
   * Answer: (C) 10
 * 1 hand has 5 fingers. How many total fingers do 2 hands have?
   * (A) 10
   * (B) 7
   * (C) 52
   * Answer: (A) 10
 * Fill in the blank: 3 times 3 is equal to _____.
   * (A) 6
   * (B) 9
   * (C) 12
   * Answer: (B) 9
Chapter 12: How Much Can We Spend?
Flashcards (10 Questions & Answers)
 * Flashcard 1:
   * Q: What is the basic unit of Indian currency?
   * A: Rupees (₹) and Paise.
 * Flashcard 2:
   * Q: How many ₹5 coins do you need to make ₹10?
   * A: 2 coins (5 + 5 = 10).
 * Flashcard 3:
   * Q: If a ball costs ₹20, how many ₹10 notes do you need to give?
   * A: 2 notes.
 * Flashcard 4:
   * Q: If a toy car costs ₹14 and you have ₹10, how many more rupees do you need?
   * A: ₹4 (14 - 10 = 4).
 * Flashcard 5:
   * Q: What is the total of ₹5 + ₹2 + ₹1?
   * A: ₹8.
 * Flashcard 6:
   * Q: What is the sum of ₹10 + ₹2 + ₹2 + ₹2?
   * A: ₹16.
 * Flashcard 7:
   * Q: How many ₹5 coins make ₹20?
   * A: 4 coins (4 \times 5 = 20).
 * Flashcard 8:
   * Q: If a whistle costs ₹10 and a ball costs ₹20, what is their combined cost?
   * A: ₹30 (10 + 20 = 30).
 * Flashcard 9:
   * Q: How much is ₹10 note + ₹2 coin + ₹1 coin?
   * A: ₹13.
 * Flashcard 10:
   * Q: What is the total amount of ₹5 + ₹5 + ₹5 + ₹2 + ₹2?
   * A: ₹19.
Quiz (10 MCQs & Fill-ups)
 * What is the value of two ₹5 coins?
   * (A) ₹7
   * (B) ₹10
   * (C) ₹15
   * Answer: (B) ₹10
 * Fill in the blank: ₹10 + ₹10 = ₹_____
   * (A) 20
   * (B) 100
   * (C) 12
   * Answer: (A) 20
 * You buy a toy for ₹15 and give ₹20 to the shopkeeper. How much change will you get back?
   * (A) ₹10
   * (B) ₹5
   * (C) ₹2
   * Answer: (B) ₹5
 * Fill in the blank: ₹5 + ₹2 + ₹1 = ₹_____
   * (A) 7
   * (B) 8
   * (C) 9
   * Answer: (B) 8
 * Which combination equals ₹12?
   * (A) ₹10 + ₹2
   * (B) ₹5 + ₹5 + ₹1
   * (C) ₹10 + ₹5
   * Answer: (A) ₹10 + ₹2
 * Fill in the blank: To make ₹20, you need _____ ₹10 notes.
   * (A) 1
   * (B) 2
   * (C) 3
   * Answer: (B) 2
 * If a pencil costs ₹5 and an eraser costs ₹3, what is the total cost?
   * (A) ₹8
   * (B) ₹15
   * (C) ₹2
   * Answer: (A) ₹8
 * Fill in the blank: ₹5 + ₹5 + ₹5 = ₹_____
   * (A) 10
   * (B) 15
   * (C) 20
   * Answer: (B) 15
 * What is the minimum number of coins/notes needed to make ₹49 using ₹20, ₹20, ₹5, ₹2, ₹2?
   * (A) 4
   * (B) 5
   * (C) 6
   * Answer: (B) 5
 * Fill in the blank: ₹10 note − ₹4 = ₹_____
   * (A) 6
   * (B) 14
   * (C) 5
   * Answer: (A) 6
Chapter 13: So Many Toys
Flashcards (10 Questions & Answers)
 * Flashcard 1:
   * Q: How many legs does a spider have?
   * A: 8 legs.
 * Flashcard 2:
   * Q: Which number lies between 5 and 10 and becomes 3 more when read upside down?
   * A: 6 (upside down it becomes 9).
 * Flashcard 3:
   * Q: Which number comes just before 40?
   * A: 39.
 * Flashcard 4:
   * Q: Which number comes just after 35?
   * A: 36.
 * Flashcard 5:
   * Q: Which number is 3 more than 8 and 3 less than 14?
   * A: 11.
 * Flashcard 6:
   * Q: How many times can you subtract 5 from 25?
   * A: Mathematically only 1 time (because after that it becomes 20).
 * Flashcard 7:
   * Q: If Orange + Orange = 8, what is the value of 1 Orange?
   * A: 4.
 * Flashcard 8:
   * Q: What do you get if you add 5 to 52?
   * A: 57.
 * Flashcard 9:
   * Q: Which number comes after 50 and before 54, whose digits sum up to 7?
   * A: 52 (5 + 2 = 7).
 * Flashcard 10:
   * Q: 10 + \text{\_\_\_\_\_} = 15?
   * A: 5.
Quiz (10 MCQs & Fill-ups)
 * How many legs does a spider have?
   * (A) 6
   * (B) 8
   * (C) 10
   * Answer: (B) 8
 * Fill in the blank: The number that comes just before 40 is _____.
   * (A) 41
   * (B) 39
   * (C) 38
   * Answer: (B) 39
 * Fill in the blank: 19 + 5 = _____
   * (A) 24
   * (B) 22
   * (C) 25
   * Answer: (A) 24
 * Which number comes just after 35?
   * (A) 34
   * (B) 36
   * (C) 37
   * Answer: (B) 36
 * Fill in the blank: 22 - 8 = _____
   * (A) 12
   * (B) 14
   * (C) 16
   * Answer: (B) 14
 * If Orange = 4 and Orange + Green = 10, what is the value of Green?
   * (A) 4
   * (B) 6
   * (C) 10
   * Answer: (B) 6
 * Fill in the blank: 7 + \text{\_\_\_\_\_} = 15
   * (A) 7
   * (B) 8
   * (C) 9
   * Answer: (B) 8
 * What type of numbers are 25 and 52 to each other?
   * (A) Same numbers
   * (B) Mirror numbers (digits reversed)
   * (C) Even numbers
   * Answer: (B) Mirror numbers (digits reversed)
 * Fill in the blank: 10 - 2 = _____
   * (A) 7
   * (B) 8
   * (C) 12
   * Answer: (B) 8
 * Which of the following equals 17?
   * (A) 10 + 7
   * (B) 10 + 5
   * (C) 8 + 8
   * Answer: (A) 10 + 7"""

c1_map = {
    "Chapter 11": "How Many Times?",
    "Chapter 12": "How Much Can We Spend?",
    "Chapter 13": "So Many Toys"
}

fc_db_ext = {}
quiz_db_ext = {}

curr_chap = ""
mode = ""
lines = raw_data.strip().split('\n')

for i in range(len(lines)):
    line = lines[i].strip()
    if line.startswith("Chapter 11:"):
        curr_chap = c1_map["Chapter 11"]
        fc_db_ext[curr_chap] = []
        quiz_db_ext[curr_chap] = []
    elif line.startswith("Chapter 12:"):
        curr_chap = c1_map["Chapter 12"]
        fc_db_ext[curr_chap] = []
        quiz_db_ext[curr_chap] = []
    elif line.startswith("Chapter 13:"):
        curr_chap = c1_map["Chapter 13"]
        fc_db_ext[curr_chap] = []
        quiz_db_ext[curr_chap] = []
    
    elif line.startswith("Flashcards ("):
        mode = "fc"
    elif line.startswith("Quiz ("):
        mode = "quiz"
    
    elif mode == "fc" and line.startswith("* Q:"):
        q_text = line.split(":", 1)[1].strip()
        ans_text = ""
        if i + 1 < len(lines) and lines[i+1].strip().startswith("* A:"):
            ans_text = lines[i+1].strip().split(":", 1)[1].strip()
        fc_db_ext[curr_chap].append((q_text, ans_text, ans_text))
        
    elif mode == "quiz" and line.startswith("* Answer:"):
        ans_clean = line.split(":", 1)[1].strip()
        ans_clean = re.sub(r'^\([A-D]\)\s*', '', ans_clean)
        
        q_idx = i - 1
        opts = []
        while q_idx > 0:
            if not lines[q_idx].strip().startswith('* (A)') and not lines[q_idx].strip().startswith('* (B)') and not lines[q_idx].strip().startswith('* (C)') and not lines[q_idx].strip().startswith('* (D)'):
                break
            q_idx -= 1
            
        q_text = lines[q_idx].strip().lstrip('*').strip()
        
        for j in range(q_idx + 1, i):
            opt = lines[j].strip().lstrip('*').strip()
            if opt:
                if re.match(r'^\([A-D]\)', opt):
                    opts.append(re.sub(r'^\([A-D]\)\s*', '', opt))
        
        ans_idx = 0
        for idx, o in enumerate(opts):
            if o.lower() == ans_clean.lower() or ans_clean.lower() in o.lower():
                ans_idx = idx
                break
                
        quiz_db_ext[curr_chap].append({
            "q": q_text,
            "options": opts,
            "ans_idx": ans_idx,
            "exp": f"The correct answer is: {ans_clean}"
        })

print(f"Parsed {sum(len(v) for v in fc_db_ext.values())} FCs and {sum(len(v) for v in quiz_db_ext.values())} Quizzes")

with open('generate_ncert.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Update FC_DB string by matching its closing brace temporarily
fc_str_ext = ""
for k, v in fc_db_ext.items():
    fc_str_ext += f'    "{k}": {v},\\n'

text = text.replace('    # Class 1 Maths', '    # Class 1 Maths\\n' + fc_str_ext)

# Update QUIZ_DB string
for k, v in quiz_db_ext.items():
    # Append to the QUIZ_DB dictionary directly
    q_str = f'    "{k}": {json.dumps(v, ensure_ascii=False)},\\n'
    text = text.replace('QUIZ_DB = {', 'QUIZ_DB = {\\n' + q_str)

# Need to replace \\n with actual newline again
text = text.replace('\\n', '\n')

with open('generate_ncert.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Injected into generate_ncert.py successfully!")
