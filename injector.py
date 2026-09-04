import re
import ast

raw_data = """Chapter 1: Positional Concepts & Spatial Understanding
Q1: What term describes an object placed under a tree?
A1: Under
Q2: What term describes an object placed on top of a car or roof?
A2: Top / Above
Q3: What word is used for an object kept inside a bag?
A3: Inside
Q4: What word is used for an object kept outside a room?
A4: Outside
Q5: What position are the compartments relative to the train engine leading them?
A5: After / Behind
Q6: What position is the engine relative to the compartments following it?
A6: Before / In front of
Q7: Which color is at the top of the National Flag of India (Tiranga)?
A7: Saffron
Q8: Which color is at the bottom of the National Flag of India?
A8: Green
Q9: Where is the Ashok Chakra located on the National Flag?
A9: In the middle (on the white strip)
Q10: Should waste be thrown inside or outside the dustbin?
A10: Inside
Chapter 2: Shapes & Spatial Relationships
Q1: Is a pencil box long or round?
A1: Long
Q2: Is a playing ball long or round?
A2: Round
Q3: What action do cylindrical objects like a drum (dholak) do on a slope?
A3: Roll
Q4: What action do flat objects like a matchbox do on a slope?
A4: Slide
Q5: Can a coin roll or slide?
A5: Both (It rolls on its curved edge and slides on its flat surface)
Q6: What shape is similar to a matchbox or a brick?
A6: Rectangular / Cuboid
Q7: What shape is a birthday hat?
A7: Cone
Q8: What shape is a drinking glass or a pipe?
A8: Cylinder
Q9: Does a carrom striker slide or roll on the board?
A9: Slides
Q10: Which shape makes the most stable base for building a tall tower?
A10: Flat-surfaced objects (like square or rectangular boxes)
Chapter 3: Numbers 1 to 9
Q1: How many stars are in the Saptarishi constellation?
A1: 7 stars
Q2: What number comes immediately after 4 in counting?
A2: 5
Q3: What is 1 less than 8?
A3: 7
Q4: Which number lies between 3 and 5?
A4: 4
Q5: Which is the largest single-digit number from 1 to 9?
A5: 9
Q6: Which is the smallest non-zero counting number?
A6: 1
Q7: How many fingers are there on one hand?
A7: 5
Q8: If you have 3 mangoes and get 1 more, how many do you have in total?
A8: 4 mangoes
Q9: Are there multiple ways to show 4 fingers using one hand?
A9: Yes (using different finger combinations)
Q10: When is National Unity Day (Rashtriya Ekta Diwas) celebrated?
A10: 31st October
Chapter 4: Making 10 & Number Pairs
Q1: What does it mean if there are 0 birds on a branch?
A1: None / No birds
Q2: If you have 4 buttons and lose all 4, how many are left?
A2: 0
Q3: What number must be added to 9 to make 10?
A3: 1
Q4: What equal number pair makes 10?
A4: 5 and 5
Q5: What number do 10 and 3 make together?
A5: 13
Q6: What number do 10 and 7 make together?
A6: 17
Q7: What number do two tens (10 + 10) make?
A7: 20
Q8: How many tens and ones are in the number 15?
A8: 1 Ten and 5 Ones
Q9: Which is the largest number among 11, 19, and 14?
A9: 19
Q10: Which is the smallest number among 8, 12, and 6?
A10: 6
Chapter 5: Addition & Subtraction (Up to 10)
Q1: What is 4 + 2 altogether?
A1: 6
Q2: What is the symbol for addition in mathematics?
A2: + (Plus)
Q3: What do you get when you add 0 to any number (4 + 0)?
A3: The same number (4)
Q4: What is 5 + 3?
A4: 8
Q5: If 2 frogs jump away from 6 frogs, how many are left (6 - 2)?
A5: 4
Q6: What is the symbol for subtraction in mathematics?
A6: - (Minus)
Q7: What is 9 - 3?
A7: 6
Q8: Where is the famous Sun Temple located?
A8: Konark, Odisha
Q9: On a number line, if you jump 3 steps backward from 9, where do you land?
A9: 6
Q10: If 2 out of 7 balloons fly away, how many balloons remain?
A10: 5
Chapter 6: Numbers 10 to 20 (Addition & Subtraction)
Q1: What is 7 + 5?
A1: 12
Q2: What is 13 + 4?
A2: 17
Q3: What is 15 - 9?
A3: 6
Q4: What is 16 - 0?
A4: 16
Q5: On a bead string (Ginladi), counting 4 beads forward from 12 gives what number?
A5: 16
Q6: Moving 2 steps forward from 6 and 7 steps backward from 15 gives which same number?
A6: 8
Q7: What is an easy way to calculate 12 + 6?
A7: 10 + 2 + 6 = 10 + 8 = 18
Q8: If a bus has 18 seats and 9 children are seated, how many seats are empty?
A8: 9 seats
Q9: A potter had 9 lamps, sold 5, and made 7 new ones. How many does he have now?
A9: 11 lamps (9 - 5 + 7 = 11)
Q10: From 14 candies, some were given away leaving 6. How many were given away?
A10: 8 candies (14 - 6 = 8)
Chapter 7: Measurement (Length, Weight, Capacity)
Q1: What is the tallest statue in the world?
A1: Statue of Unity (Gujarat, India)
Q2: What is the span from the tip of the thumb to the tip of the little finger called?
A2: Handspan (Bilaant)
Q3: What non-standard unit can be used to measure small objects like an eraser?
A3: Fingers width
Q4: What measurement unit uses steps to measure room length?
A4: Footspan / Pace
Q5: Between a brick and a marble, which one is heavier?
A5: A brick
Q6: Between a sheet of paper and a wooden block, which one is lighter?
A6: A sheet of paper
Q7: Will it take more cups or more jugs to fill a bucket?
A7: More cups
Q8: Which holds more liquid: a bucket or a jug?
A8: A bucket
Q9: What is better to use for watering a plant without wasting water: a bucket or a mug?
A9: A mug
Q10: Which bathing method saves more water: using a shower or a bucket and mug?
A10: Bucket and mug
Chapter 8: Numbers 21 to 99
Q1: How many tens and ones are in the number 21?
A1: 2 Tens and 1 One
Q2: Write 35 in number words.
A2: Thirty-five
Q3: What number is formed by 5 tens and 0 ones?
A3: 50
Q4: What number is formed by 7 tens and 4 ones?
A4: 74
Q5: What number comes immediately after 99?
A5: 100
Q6: What number comes after 89?
A6: 90
Q7: Which traditional art style from Maharashtra uses geometric shapes to draw human figures?
A7: Warli Painting
Q8: Complete the sequence: 40, 41, 42, ___, 44.
A8: 43
Q9: What number is formed by 6 tens and 8 ones?
A9: 68
Q10: What is 1 less than 100?
A10: 99
Chapter 9: Patterns
Q1: Makar Sankranti, Pongal, Bihu, and Lohri are festivals associated with what theme?
A1: Harvest season / Uttarayan
Q2: What is the next number in the pattern: 2, 4, 6, 8, ___?
A2: 10 (Counting by 2s)
Q3: What is the next number in the pattern: 5, 10, 15, 20, ___?
A3: 25 (Counting by 5s)
Q4: What is the next number in the pattern: 10, 20, 30, 40, ___?
A4: 50 (Counting by 10s)
Q5: What is the next number in the pattern: 11, 22, 33, 44, ___?
A5: 55
Q6: What is the next number in the reverse pattern: 22, 21, 20, 19, ___?
A6: 18
Q7: What are traditional door floor patterns called in Tamil Nadu?
A7: Kolam
Q8: What pattern technique uses thumbprints dipped in paint?
A8: Thumbprint / Fingerprint art
Q9: Where can you observe natural patterns around you?
A9: On leaves, butterfly wings, and animal stripes (zebra/tiger)
Q10: How can rhythmic actions create a pattern?
A10: By repeating claps, snaps, or foot taps in order
Chapter 10: Time & Seasons
Q1: At what time of day does the Sun rise?
A1: Morning
Q2: When is the Sun directly overhead in the sky?
A2: Afternoon
Q3: At what time of day does the Sun set?
A3: Evening
Q4: When do the Moon and stars become visible in the sky?
A4: Night
Q5: During which part of the day do we eat breakfast?
A5: Morning
Q6: When do students usually eat lunch after returning from school?
A6: Afternoon
Q7: When does a family eat dinner?
A7: Night
Q8: Which activity takes longer: taking a full bath or trimming a fingernail?
A8: Taking a full bath
Q9: Which method takes less time to reach school: walking or riding a bicycle?
A9: Riding a bicycle
Q10: What are the 4 main seasons in India?
A10: Summer, Winter, Spring, and Monsoon"""

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

mapped = {}
curr_chap = -1
curr_q = ""
curr_a = ""

for line in raw_data.split('\\n'):
    if line.startswith('Chapter '):
        curr_chap += 1
    elif line.startswith('Q'):
        curr_q = line.split(': ', 1)[1]
    elif line.startswith('A'):
        curr_a = line.split(': ', 1)[1]
        
        chap_name = c1_map[curr_chap]
        if chap_name not in mapped:
            mapped[chap_name] = []
            
        mapped[chap_name].append((curr_q, curr_a, curr_a))

# Now modify generate_ncert.py safely
with open('generate_ncert.py', 'r', encoding='utf-8') as f:
    text = f.read()

# We just inject the mapped dictionary into FC_DB assignments
injection = ""
for k, v in mapped.items():
    injection += f'    "{k}": {v},\\n'

# Put it right after "# Class 1 Maths" natively
text = text.replace('    # Class 1 Maths', '    # Class 1 Maths\\n' + injection)

with open('generate_ncert.py', 'w', encoding='utf-8') as f:
    f.write(text)
    
print("Successfully injected 100 new flashcards!")
