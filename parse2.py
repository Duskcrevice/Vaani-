import json
import re
import os

raw_data = """Chapter 1: Positional Concepts & Spatial Understanding
Multiple Choice Questions (MCQs)
Where is the Ashok Chakra located on the Indian National Flag?
(a) At the top
(b) In the middle
(c) At the bottom
(d) Outside the flag
Answer: (b) In the middle
In a queue, Priya is standing before Rahul. Who will reach the counter first?
(a) Rahul
(b) Priya
(c) Both at the same time
(d) Neither
Answer: (b) Priya
Which color is at the top of the National Flag of India?
(a) Green
(b) White
(c) Saffron
(d) Blue
Answer: (c) Saffron
If a cat is sitting under a table, where is the table relative to the cat?
(a) Under
(b) Inside
(c) Above / Over
(d) Behind
Answer: (c) Above / Over
Where should garbage be thrown?
(a) Outside the dustbin
(b) Inside the dustbin
(c) On the floor
(d) Top of the desk
Answer: (b) Inside the dustbin
Fill in the Blanks (with Options)
A bird flying in the sky is __________ the house.
(above / under)
Answer: above
We keep our books __________ the school bag.
(outside / inside)
Answer: inside
The roots of a tree grow __________ the ground.
(under / top)
Answer: under
Green color strip is at the __________ of the National Flag.
(top / bottom)
Answer: bottom
An engine is placed __________ the train compartments.
(before / after)
Answer: before
Chapter 2: Shapes Around Us
Multiple Choice Questions (MCQs)
Which of the following objects will roll easily on a slope?
(a) A wooden block
(b) A playing ball
(c) A matchbox
(d) An eraser
Answer: (b) A playing ball
Which shape looks like a birthday hat?
(a) Sphere
(b) Cylinder
(c) Cone
(d) Cube
Answer: (c) Cone
Which of these objects can both roll and slide?
(a) A coin
(b) A square dice
(c) A football
(d) A paper sheet
Answer: (a) A coin
Which shape makes the most stable base for stacking a tall tower?
(a) Round balls
(b) Flat-surfaced boxes
(c) Cones
(d) Marbles
Answer: (b) Flat-surfaced boxes
What shape is an unsharpened round pencil?
(a) Cube
(b) Cone
(c) Cylinder
(d) Rectangle
Answer: (c) Cylinder
Fill in the Blanks (with Options)
A carrom striker __________ across the carrom board.
(rolls / slides)
Answer: slides
A spherical marble has a __________ surface.
(curved / flat)
Answer: curved
A dice used in Ludo is shaped like a __________.
(cube / cone)
Answer: cube
Flat objects __________ when pushed on a table.
(roll / slide)
Answer: slide
A drinking glass has a __________ shape.
(cylindrical / triangular)
Answer: cylindrical
Chapter 3: Numbers 1 to 9
Multiple Choice Questions (MCQs)
How many stars are there in the Saptarishi constellation?
(a) 5
(b) 6
(c) 7
(d) 9
Answer: (c) 7
Which number comes immediately after 4?
(a) 3
(b) 5
(c) 6
(d) 2
Answer: (b) 5
What is 1 less than 8?
(a) 9
(b) 6
(c) 7
(d) 5
Answer: (c) 7
Which number lies between 3 and 5?
(a) 2
(b) 4
(c) 6
(d) 1
Answer: (b) 4
How many letters are in the word "MATHS"?
(a) 4
(b) 5
(c) 6
(d) 3
Answer: (b) 5
Fill in the Blanks (with Options)
The largest single-digit counting number is __________.
(8 / 9)
Answer: 9
There are __________ fingers on one hand.
(5 / 10)
Answer: 5
3 mangoes and 1 more mango make __________ mangoes in total.
(4 / 5)
Answer: 4
A triangle has __________ sides.
(3 / 4)
Answer: 3
National Unity Day is celebrated on __________ October.
(15th / 31st)
Answer: 31st
Chapter 4: Making 10 & Two-Digit Intro
Multiple Choice Questions (MCQs)
What number added to 9 makes 10?
(a) 2
(b) 1
(c) 0
(d) 3
Answer: (b) 1
Which number pair adds up to 10?
(a) 5 and 4
(b) 6 and 3
(c) 5 and 5
(d) 7 and 2
Answer: (c) 5 and 5
What number do 1 Ten and 3 Ones make together?
(a) 31
(b) 13
(c) 103
(d) 4
Answer: (b) 13
If you have 4 buttons and lose all 4 of them, how many buttons remain?
(a) 4
(b) 1
(c) 0
(d) 2
Answer: (c) 0
Which is the largest number among 11, 19, and 14?
(a) 11
(b) 14
(c) 19
(d) 10
Answer: (c) 19
Fill in the Blanks (with Options)
Two tens (10 + 10) make the number __________.
(12 / 20)
Answer: 20
In the number 15, there is 1 Ten and __________ Ones.
(5 / 1)
Answer: 5
The number pair that makes 10 with 7 is __________.
(2 / 3)
Answer: 3
Taking away 5 from 5 leaves __________.
(0 / 1)
Answer: 0
Among 8, 12, and 6, the smallest number is __________.
(6 / 8)
Answer: 6
Chapter 5: Addition & Subtraction (Up to 10)
Multiple Choice Questions (MCQs)
What is 4 + 2?
(a) 5
(b) 6
(c) 7
(d) 8
Answer: (b) 6
What is the value of 9 - 3?
(a) 5
(b) 7
(c) 6
(d) 4
Answer: (c) 6
What do you get when you add 0 to any number (4 + 0)?
(a) 0
(b) 4
(c) 5
(d) 1
Answer: (b) 4
If 2 out of 7 balloons fly away, how many balloons are left?
(a) 5
(b) 4
(c) 9
(d) 6
Answer: (a) 5
On a number line, if you start at 9 and jump 3 steps backward, where do you land?
(a) 5
(b) 6
(c) 7
(d) 12
Answer: (b) 6
Fill in the Blanks (with Options)
The symbol used for addition is __________.
( + / - )
Answer: +
5 + 3 = __________.
(8 / 9)
Answer: 8
The symbol used for subtraction is __________.
( + / - )
Answer: -
8 - 8 = __________.
(8 / 0)
Answer: 0
6 + __________ = 9.
(3 / 4)
Answer: 3
Chapter 6: Numbers 10 to 20 Operations
Multiple Choice Questions (MCQs)
What is 7 + 5?
(a) 11
(b) 12
(c) 13
(d) 10
Answer: (b) 12
What is 15 - 9?
(a) 6
(b) 7
(c) 5
(d) 8
Answer: (a) 6
What is 13 + 4?
(a) 16
(b) 17
(c) 18
(d) 15
Answer: (b) 17
A bus has 18 seats and 9 children are seated. How many seats are empty?
(a) 8
(b) 9
(c) 10
(d) 7
Answer: (b) 9
A potter had 9 lamps, sold 5, and then made 7 new ones. How many lamps does he have now?
(a) 11
(b) 12
(c) 10
(d) 13
Answer: (a) 11
Fill in the Blanks (with Options)
Counting 4 beads forward from 12 on a bead string reaches __________.
(15 / 16)
Answer: 16
16 - 0 = __________.
(0 / 16)
Answer: 16
From 14 candies, if 8 are given away, __________ candies remain.
(6 / 7)
Answer: 6
10 + 4 + 2 = __________.
(16 / 14)
Answer: 16
__________ - 4 = 10.
(14 / 6)
Answer: 14
Chapter 7: Measurement
Multiple Choice Questions (MCQs)
Which non-standard unit uses the length from the tip of the thumb to the tip of the little finger?
(a) Footspan
(b) Handspan
(c) Pace
(d) Finger width
Answer: (b) Handspan
Which object is heavier?
(a) A sheet of paper
(b) A brick
(c) A feather
(d) A pencil
Answer: (b) A brick
Which container holds the maximum amount of liquid?
(a) Teaspoon
(b) Mug
(c) Jug
(d) Bucket
Answer: (d) Bucket
What is the tallest statue in the world?
(a) Statue of Liberty
(b) Statue of Unity
(c) Eiffel Tower
(d) Big Ben
Answer: (b) Statue of Unity
Which method saves more water while bathing?
(a) Using a continuous shower
(b) Using a bucket and mug
(c) Leaving the tap open
(d) Using a hose pipe
Answer: (b) Using a bucket and mug
Fill in the Blanks (with Options)
To measure the length of a room floor, we can use __________.
(handspan / footspan)
Answer: footspan
A wooden block is __________ than a sheet of paper.
(lighter / heavier)
Answer: heavier
Filling a big bucket requires __________ cups than filling a small glass.
(more / fewer)
Answer: more
A teaspoon has __________ capacity than a soup bowl.
(less / more)
Answer: less
Handspan is a __________ unit of measurement.
(standard / non-standard)
Answer: non-standard
Chapter 8: Numbers 21 to 99
Multiple Choice Questions (MCQs)
How many tens and ones are in the number 21?
(a) 1 Ten and 2 Ones
(b) 2 Tens and 1 One
(c) 2 Tens and 0 Ones
(d) 21 Tens and 0 Ones
Answer: (b) 2 Tens and 1 One
What number is formed by 7 tens and 4 ones?
(a) 47
(b) 704
(c) 74
(d) 714
Answer: (c) 74
What number comes immediately after 99?
(a) 98
(b) 100
(c) 90
(d) 101
Answer: (b) 100
What traditional art style from Maharashtra uses geometric shapes to draw human figures?
(a) Madhubani Art
(b) Warli Painting
(c) Tanjore Art
(d) Kalamkari
Answer: (b) Warli Painting
Which number is larger: 72 or 27?
(a) 27
(b) 72
(c) Both are equal
(d) None
Answer: (b) 72
Fill in the Blanks (with Options)
The number name for 35 is __________.
(Thirty-five / Fifty-three)
Answer: Thirty-five
5 Tens and 0 Ones make the number __________.
(5 / 50)
Answer: 50
The missing number in sequence 40, 41, 42, ____, 44 is __________.
(43 / 45)
Answer: 43
1 less than 100 is __________.
(99 / 90)
Answer: 99
10 more than 55 is __________.
(65 / 56)
Answer: 65
Chapter 9: Patterns
Multiple Choice Questions (MCQs)
What is the next number in the pattern: 2, 4, 6, 8, ___?
(a) 9
(b) 10
(c) 11
(d) 12
Answer: (b) 10
What is the next number in the pattern: 10, 20, 30, 40, ___?
(a) 45
(b) 50
(c) 60
(d) 55
Answer: (b) 50
Complete the pattern: 11, 22, 33, 44, ___?
(a) 45
(b) 50
(c) 55
(d) 66
Answer: (c) 55
What comes next in the shape sequence: Circle, Square, Circle, Square, ___?
(a) Triangle
(b) Square
(c) Circle
(d) Rectangle
Answer: (c) Circle
What traditional floor patterns are made at doorways in Tamil Nadu?
(a) Rangoli
(b) Kolam
(c) Alpana
(d) Mandana
Answer: (b) Kolam
Fill in the Blanks (with Options)
Next number in pattern 5, 10, 15, 20, ___ is __________.
(25 / 30)
Answer: 25
In the reverse pattern 22, 21, 20, 19, ___, the next number is __________.
(18 / 20)
Answer: 18
Patterns created using paint on fingers are called __________ art.
(Thumbprint / Block)
Answer: Thumbprint
Next in the letter series A, B, C, A, B, C, A, ___ is __________.
(B / C)
Answer: B
The sequence 100, 90, 80, 70 follows the rule of subtracting __________ each time.
(5 / 10)
Answer: 10
Chapter 10: Time & Seasons
Multiple Choice Questions (MCQs)
At what time of day does the Sun rise?
(a) Night
(b) Afternoon
(c) Morning
(d) Evening
Answer: (c) Morning
When do the Moon and stars appear in the sky?
(a) Morning
(b) Afternoon
(c) Night
(d) Noon
Answer: (c) Night
Which activity takes less time?
(a) Walking to school
(b) Riding a bicycle to school
(c) Both take equal time
(d) None
Answer: (b) Riding a bicycle to school
In which season do we wear woolen clothes?
(a) Summer
(b) Winter
(c) Monsoon
(d) Spring
Answer: (b) Winter
During which meal do we sit together with family at night?
(a) Breakfast
(b) Lunch
(c) Dinner
(d) Snacks
Answer: (c) Dinner
Fill in the Blanks (with Options)
We eat breakfast in the __________.
(morning / evening)
Answer: morning
The Sun is directly overhead in the sky during the __________.
(afternoon / night)
Answer: afternoon
Taking a full bath takes __________ time than trimming a fingernail.
(more / less)
Answer: more
We use umbrellas and raincoats during the __________ season.
(Summer / Monsoon)
Answer: Monsoon
Brushing your teeth takes a few __________.
(minutes / hours)
Answer: minutes"""

c1_map = [
    "Finding the Furry Cat!", 
    "What is Long? What is Round?",
    "Mango Treat", 
    "Making 10", 
    "How Many?",
    "Vegetable Farm", 
    "Lina's Family",
    "Playing with Numbers", 
    "Utsav",
    "How Do I Spend My Day?"
]

quiz_db_out = {}
curr_chap = -1
lines = raw_data.strip().split('\n')
total_qs = 0
for i in range(len(lines)):
    line = lines[i].strip()
    if line.startswith('Chapter '):
        curr_chap += 1
        chap_name = c1_map[curr_chap] if curr_chap < len(c1_map) else "Unknown"
        quiz_db_out[chap_name] = []
        
    elif line.startswith('Answer:'):
        # We found an answer, so let's backtrack to find the question and options
        ans_str = line.split('Answer:')[1].strip()
        ans_clean = re.sub(r'^\([a-d]\)\s*', '', ans_str)
        
        # backtrack to find '?' or '__________.'
        q_idx = i - 1
        opts = []
        while q_idx > 0:
            if '?' in lines[q_idx] or lines[q_idx].strip().endswith('__________.') or lines[q_idx].strip().endswith('..........'):
                break
            q_idx -= 1
            
        q_text = lines[q_idx].strip()
        
        # Everything between q_idx and i are options
        for j in range(q_idx + 1, i):
            opt = lines[j].strip()
            if opt:
                if re.match(r'^\([a-d]\)', opt):
                    opts.append(re.sub(r'^\([a-d]\)\s*', '', opt))
                elif '(' in opt and '/' in opt:
                    p = str(opt).replace('(','').replace(')','').split('/')
                    for x in p:
                        opts.append(x.strip())
        
        ans_idx = 0
        for idx, o in enumerate(opts):
            if o.lower() == ans_clean.lower() or ans_clean.lower() in o.lower():
                ans_idx = idx
                break
        
        quiz_db_out[chap_name].append({
            "q": q_text,
            "options": opts,
            "ans_idx": ans_idx,
            "exp": f"The correct answer is: {ans_clean}"
        })
        total_qs += 1

print(f"Parsed {total_qs} questions!")

# Dump directly to generate_ncert.py with a robust string replace
with open('generate_ncert.py', 'r', encoding='utf-8') as f:
    text = f.read()
    
# Safely replace QUIZ_DB chunk
start_idx = text.find('QUIZ_DB = {')
end_idx = text.find('def make_lesson')
if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + "QUIZ_DB = " + json.dumps(quiz_db_out, indent=4, ensure_ascii=False) + "\n\n\n" + text[end_idx:]
    with open('generate_ncert.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully dynamically injected into generate_ncert.py!")
else:
    print("Could not find QUIZ_DB anchor in file")
