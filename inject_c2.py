import json
import re

raw_data = """Chapter 1: A Day at the Beach
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: How many ones are there in a 'Ten Strip' or group of 10?
   * A: 10 ones/units.
 * Flashcard 2
   * Q: How many tens and ones are there in 25?
   * A: 2 tens and 5 ones.
 * Flashcard 3
   * Q: What is the expanded form of 73?
   * A: 70 + 3 (or 7 tens and 3 ones).
 * Flashcard 4
   * Q: Which number is greater: 43 or 34?
   * A: 43 (because 43 has 4 tens, while 34 has only 3 tens).
 * Flashcard 5
   * Q: Which is smaller: 27 or 72?
   * A: 27 (because it has 2 tens, whereas 72 has 7 tens).
 * Flashcard 6
   * Q: What is the smallest 2-digit number?
   * A: 10.
 * Flashcard 7
   * Q: What is the largest 2-digit number?
   * A: 99.
 * Flashcard 8
   * Q: What is the largest 2-digit number where no digits are repeated?
   * A: 98.
 * Flashcard 9
   * Q: How many ten-strips make a 100-units grid?
   * A: 10 ten-strips.
 * Flashcard 10
   * Q: What is the position of an item that comes immediately after 1st and 2nd?
   * A: 3rd (Third).
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * How many tens and ones are present in the number 58?
   * A) 8 tens and 5 ones
   * B) 5 tens and 8 ones
   * C) 5 tens and 0 ones
   * D) 8 tens and 8 ones
   * Answer: B) 5 tens and 8 ones
 * Which of the following numbers is greater than 43?
   * A) 34
   * B) 40
   * C) 47
   * D) 29
   * Answer: C) 47
 * What is the smallest two-digit number with 3 at the tens place?
   * A) 39
   * B) 31
   * C) 30
   * D) 33
   * Answer: C) 30
 * If you combine 7 yellow ten strips and 3 red ten strips, how many total units do you get?
   * A) 70
   * B) 30
   * C) 100
   * D) 10
   * Answer: C) 100
 * Which number comes just before 20?
   * A) 21
   * B) 19
   * C) 18
   * D) 10
   * Answer: B) 19
Fill in the Blanks with Options (6–10)
 * 67 chikoos are ________ than 76 chikoos.
   * A) more
   * B) less
   * Answer: B) less
 * The expanded form 90 + 3 gives the total number ________.
   * A) 39
   * B) 93
   * Answer: B) 93
 * 1 ten strip is equal to ________ units.
   * A) 1
   * B) 10
   * Answer: B) 10
 * The number ________ is the largest two-digit number with 2 at the ones place.
   * A) 92
   * B) 29
   * Answer: A) 92
 * In ordinal positions, the boat that completes the race right at the beginning comes ________.
   * A) First
   * B) Last
   * Answer: A) First
Chapter 2: Shapes Around Us
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: How many faces does a standard cube or cuboid box have?
   * A: 6 faces.
 * Flashcard 2
   * Q: How many edges (sides) does a box/cuboid have?
   * A: 12 edges.
 * Flashcard 3
   * Q: How many corners does a cube or cuboid have?
   * A: 8 corners.
 * Flashcard 4
   * Q: Which solid 3D shape looks like a ball?
   * A: Sphere.
 * Flashcard 5
   * Q: Which 3D shape has 1 sharp corner and a flat circular base (like a birthday hat)?
   * A: Cone.
 * Flashcard 6
   * Q: Which shape does a drum or a battery cell resemble?
   * A: Cylinder.
 * Flashcard 7
   * Q: How many corners does a smooth ball (sphere) have?
   * A: Zero (0) corners.
 * Flashcard 8
   * Q: What shape does an unsharpened crayon or chalk usually resemble?
   * A: Cylinder.
 * Flashcard 9
   * Q: How many corners does a cone have?
   * A: 1 corner.
 * Flashcard 10
   * Q: What 3D shape does a book or shoe box resemble?
   * A: Cuboid.
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * How many corners does a gift box (cuboid) have in total?
   * A) 6
   * B) 8
   * C) 12
   * D) 4
   * Answer: B) 8
 * Which of these solid shapes has NO corners at all?
   * A) Cube
   * B) Sphere
   * C) Cone
   * D) Cuboid
   * Answer: B) Sphere
 * An ice cream cone has how many corners?
   * A) 0
   * B) 1
   * C) 3
   * D) 8
   * Answer: B) 1
 * How many ribbons of equal or varying length are needed to cover all the edges of a cube?
   * A) 6
   * B) 8
   * C) 10
   * D) 12
   * Answer: D) 12
 * Which object is shaped like a cylinder?
   * A) A round orange
   * B) A party hat
   * C) A battery cell / pipe
   * D) A playing die
   * Answer: C) A battery cell / pipe
Fill in the Blanks with Options (6–10)
 * A cube has ________ faces.
   * A) 6
   * B) 12
   * Answer: A) 6
 * A matka or a ball looks like a ________.
   * A) Sphere
   * B) Cylinder
   * Answer: A) Sphere
 * A party hat or shehnai end has a shape similar to a ________.
   * A) Cone
   * B) Cube
   * Answer: A) Cone
 * The total number of edges on a cuboid is ________.
   * A) 8
   * B) 12
   * Answer: B) 12
 * A smooth globe has ________ corners.
   * A) Zero
   * B) Four
   * Answer: A) Zero
Chapter 3: Fun with Numbers
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: What comes next in the pattern: 1, 4, 7, \dots?
   * A: 10 (Adding 3 each time).
 * Flashcard 2
   * Q: Complete the skip counting pattern in 5s: 40, 45, 50, \dots
   * A: 55, 60, 65.
 * Flashcard 3
   * Q: Complete the skip counting pattern in 10s: 50, 60, 70, \dots
   * A: 80, 90, 100.
 * Flashcard 4
   * Q: If you start from 0 and count in 5s, will you land on 55?
   * A: Yes.
 * Flashcard 5
   * Q: If you start from 4 and count in 2s, will you land on 17?
   * A: No (Counting in 2s from 4 gives even numbers only: 4, 6, 8... 16, 18).
 * Flashcard 6
   * Q: Complete the backward counting pattern: 100, 90, 80, \dots
   * A: 70, 60, 50.
 * Flashcard 7
   * Q: What number comes just before 40 on a number grid?
   * A: 39.
 * Flashcard 8
   * Q: If a number window is centered at 28, what number is directly above it (10 less)?
   * A: 18.
 * Flashcard 9
   * Q: If a number window is centered at 28, what number is directly below it (10 more)?
   * A: 38.
 * Flashcard 10
   * Q: How many steps backward from 20 does it take to reach 0 when counting by 1s?
   * A: 20 steps.
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * What are the missing numbers in the skip counting sequence: 10, 20, 30, ___, 50?
   * A) 35
   * B) 40
   * C) 45
   * D) 60
   * Answer: B) 40
 * If you start at 5 and count in 5s, which of these numbers will you land on?
   * A) 32
   * B) 40
   * C) 43
   * D) 48
   * Answer: B) 40
 * In a number grid, which number is 10 more than 53?
   * A) 43
   * B) 54
   * C) 63
   * D) 52
   * Answer: C) 63
 * Complete the backward pattern: 70, 65, 60, ___?
   * A) 50
   * B) 55
   * C) 58
   * D) 62
   * Answer: B) 55
 * Which number comes just before 10?
   * A) 11
   * B) 9
   * C) 8
   * D) 0
   * Answer: B) 9
Fill in the Blanks with Options (6–10)
 * Counting in steps of 2 starting from 2 gives numbers like 2, 4, 6, ________.
   * A) 7
   * B) 8
   * Answer: B) 8
 * On a number chart, the number to the immediate right of 28 is ________.
   * A) 29
   * B) 27
   * Answer: A) 29
 * If you start at 13 and skip count in 3s, you ________ land on 24.
   * A) will
   * B) will not
   * Answer: A) will
 * The number that comes just before 30 is ________.
   * A) 29
   * B) 31
   * Answer: A) 29
 * The number that is 10 less than 46 is ________.
   * A) 36
   * B) 56
   * Answer: A) 36
Chapter 4: Shadow Story (Togalu)
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: What traditional shadow puppetry art form from Karnataka is mentioned in the story?
   * A: Togalu Gombeyaata.
 * Flashcard 2
   * Q: At what time of the day is your outdoor shadow the shortest?
   * A: At noon / midday (when the sun is directly overhead).
 * Flashcard 3
   * Q: At what time of the day are shadows the longest?
   * A: Early morning and late afternoon.
 * Flashcard 4
   * Q: Which flat 2D shape has 3 corners and 3 sides?
   * A: Triangle.
 * Flashcard 5
   * Q: Which flat shape has 4 equal sides and 4 corners?
   * A: Square.
 * Flashcard 6
   * Q: Which 2D shape has no corners and no straight edges?
   * A: Circle.
 * Flashcard 7
   * Q: How many corners does an unfolded square sheet of paper have?
   * A: 4 corners.
 * Flashcard 8
   * Q: If you fold a square sheet in half by joining two opposite corners, what shape do you get?
   * A: Triangle.
 * Flashcard 9
   * Q: How many corners does a circle have?
   * A: Zero (0) corners.
 * Flashcard 10
   * Q: Can a game of "Catch the Corner" be played around a round table? Why?
   * A: No, because a round table has no corners.
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * Which shape is formed when you fold a square piece of paper in half diagonally?
   * A) Circle
   * B) Triangle
   * C) Rectangle
   * D) Oval
   * Answer: B) Triangle
 * At what time of day is a person's shadow shortest?
   * A) Early Morning
   * B) Noon / Midday
   * C) Evening
   * D) Midnight
   * Answer: B) Noon / Midday
 * How many corners does a standard triangle have?
   * A) 4
   * B) 3
   * C) 0
   * D) 2
   * Answer: B) 3
 * Tracing around a flat circular coin or bottle cap produces which 2D shape?
   * A) Square
   * B) Circle
   * C) Triangle
   * D) Rectangle
   * Answer: B) Circle
 * Why can't "Catch the Corner" be played around a circular table?
   * A) It is too big
   * B) It has no corners
   * C) It has too many corners
   * D) It is too slippery
   * Answer: B) It has no corners
Fill in the Blanks with Options (6–10)
 * Objects with curved edges (like a ball or circular plate) have ________ corners.
   * A) Zero
   * B) Four
   * Answer: A) Zero
 * Tracing a matchbox or eraser yields a ________ shape.
   * A) Rectangle
   * B) Circle
   * Answer: A) Rectangle
 * A square shape has ________ corners and 4 equal sides.
   * A) 3
   * B) 4
   * Answer: B) 4
 * Togalu Gombeyaata is a famous puppet art form from ________.
   * A) Karnataka
   * B) Punjab
   * Answer: A) Karnataka
 * In a number jump pattern: 1, 6, 11, the next tile number is ________.
   * A) 15
   * B) 16
   * Answer: B) 16
Chapter 5: Playing with Lines
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: What type of line is formed when a thread is stretched tightly upright from top to bottom?
   * A: Standing / Vertical line.
 * Flashcard 2
   * Q: What type of line is formed when a thread is stretched tightly sideways across?
   * A: Sleeping / Horizontal line.
 * Flashcard 3
   * Q: What type of line is formed when a stretched thread is tilted at an angle?
   * A: Slanting line.
 * Flashcard 4
   * Q: What line is formed when you loosen a thread so it sags?
   * A: Curved line.
 * Flashcard 5
   * Q: What kind of lines are used to draw a rainbow or a cloud?
   * A: Curved lines.
 * Flashcard 6
   * Q: What kind of line represents a standing pole?
   * A: Vertical / Standing line.
 * Flashcard 7
   * Q: What kind of line represents a flat railway track bed or sleeping person?
   * A: Horizontal / Sleeping line.
 * Flashcard 8
   * Q: What kind of line represents the side of a slide in a park?
   * A: Slanting line.
 * Flashcard 9
   * Q: When folding paper repeatedly, what appears on the paper sheet?
   * A: Fold creases (straight lines).
 * Flashcard 10
   * Q: Name a traditional Indian art form that uses basic lines and geometric shapes.
   * A: Warli / Madhubani / Kalamkari.
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * A line going straight up and down is called a:
   * A) Sleeping line
   * B) Standing / Vertical line
   * C) Slanting line
   * D) Curved line
   * Answer: B) Standing / Vertical line
 * Which type of line is used to draw a circle or moon?
   * A) Horizontal line
   * B) Vertical line
   * C) Curved line
   * D) Slanting line
   * Answer: C) Curved line
 * A thread held loosely without pulling it tight forms a:
   * A) Straight line
   * B) Curved line
   * C) Vertical line
   * D) Square
   * Answer: B) Curved line
 * The ladder resting sideways against a wall forms a:
   * A) Vertical line
   * B) Slanting line
   * C) Circular line
   * D) Curved line
   * Answer: B) Slanting line
 * A flat horizon or a sleeping log shows a:
   * A) Sleeping / Horizontal line
   * B) Standing / Vertical line
   * C) Curved line
   * D) Zig-zag line
   * Answer: A) Sleeping / Horizontal line
Fill in the Blanks with Options (6–10)
 * A tightly stretched string between two hands across forms a ________ line.
   * A) Straight
   * B) Curved
   * Answer: A) Straight
 * Drawing a sun with rays requires straight lines and a ________ line for the circle.
   * A) Curved
   * B) Slanting
   * Answer: A) Curved
 * A tree trunk growing straight up represents a ________ line.
   * A) Standing (Vertical)
   * B) Sleeping (Horizontal)
   * Answer: A) Standing (Vertical)
 * The roof slope of a hut is made using ________ lines.
   * A) Slanting
   * B) Vertical
   * Answer: A) Slanting
 * Paper folding creates distinct line ________ across the sheet.
   * A) Creases
   * B) Circles
   * Answer: A) Creases
Chapter 6: Decoration for Festival
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: What is 25 + 12?
   * A: 37.
 * Flashcard 2
   * Q: What is 43 + 58?
   * A: 101.
 * Flashcard 3
   * Q: Subtract 35 from 75 (75 - 35).
   * A: 40.
 * Flashcard 4
   * Q: What is 32 - 12?
   * A: 20.
 * Flashcard 5
   * Q: What do you get when you subtract any number from itself (e.g., 22 - 22)?
   * A: Zero (0).
 * Flashcard 6
   * Q: What do you get when you subtract zero from a number (e.g., 14 - 0)?
   * A: The same number (14).
 * Flashcard 7
   * Q: If 1 garland has 10 flowers, how many total flowers are in 4 garlands and 8 loose flowers?
   * A: 48 flowers (40 + 8).
 * Flashcard 8
   * Q: Complete the fact family: If 20 + 30 = 50, then 50 - 30 = \dots?
   * A: 20.
 * Flashcard 9
   * Q: In an addition pyramid, if the bottom two blocks are 3 and 5, what goes in the block above them?
   * A: 8 (3 + 5).
 * Flashcard 10
   * Q: If Aman skips 14 times and needs 20 skips in total, how many more skips does he need?
   * A: 6 skips (20 - 14).
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * Rohan has 12 flowers and Suwali has 53 flowers. How many flowers do they have in total?
   * A) 60
   * B) 65
   * C) 55
   * D) 75
   * Answer: B) 65
 * What is 57 + 34?
   * A) 81
   * B) 91
   * C) 97
   * D) 87
   * Answer: B) 91
 * If 14 balloons got burst out of 40 balloons, how many balloons are left?
   * A) 26
   * B) 27
   * C) 30
   * D) 16
   * Answer: B) 27
 * What is 38 - 11?
   * A) 27
   * B) 28
   * C) 17
   * D) 29
   * Answer: A) 27
 * Complete the fact family: 10 + 20 = 30, so 30 - 10 = \_\_\_?
   * A) 10
   * B) 20
   * C) 30
   * D) 0
   * Answer: B) 20
Fill in the Blanks with Options (6–10)
 * Subtracting a number from itself (e.g., 15 - 15) always leaves ________.
   * A) 0
   * B) 15
   * Answer: A) 0
 * Simarpreet had 12 color pencils and got 36 more. In total she has ________ pencils.
   * A) 48
   * B) 44
   * Answer: A) 48
 * If 14 - 0 = \_\_\_, the result is ________.
   * A) 14
   * B) 0
   * Answer: A) 14
 * 4 tens and 6 ones plus 3 tens and 9 ones gives ________.
   * A) 85
   * B) 75
   * Answer: A) 85
 * A purse has ₹78. If ₹24 is spent on wrapper and ₹37 on ribbons (Total ₹61 spent), the money left is ₹________.
   * A) 17
   * B) 27
   * Answer: A) 17
Chapter 7: Rani's Gift
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: Why did the carpenter's bed measurement differ from the King's request in the story?
   * A: Because their handspans were of different sizes.
 * Flashcard 2
   * Q: Which is non-standard unit of length: Handspan or Meter?
   * A: Handspan.
 * Flashcard 3
   * Q: Between a pumpkin and a carrot, which one is heavier?
   * A: Pumpkin.
 * Flashcard 4
   * Q: Between a lemon and a watermelon, which one is lighter?
   * A: Lemon.
 * Flashcard 5
   * Q: When using a simple balance scale, which side goes down—the heavier or the lighter side?
   * A: The heavier side.
 * Flashcard 6
   * Q: If 1 watermelon balances 4 coconuts, how many coconuts balance 2 watermelons?
   * A: 8 coconuts.
 * Flashcard 7
   * Q: If 1 glass of nimbu pani needs 1 glass water, 1 spoon sugar, and 2 spoons lemon juice, what is needed for 3 glasses?
   * A: 3 glasses water, 3 spoons sugar, 6 spoons lemon juice.
 * Flashcard 8
   * Q: What musical arrangement can be made by filling 5-7 glasses with varying levels of water and tapping them?
   * A: Jal Tarang.
 * Flashcard 9
   * Q: Which path between two points is faster to cover: the shortest line or a winding longer path?
   * A: The shortest line path.
 * Flashcard 10
   * Q: If a bag is filled with sand and another same-sized bag is filled with dry leaves, which is heavier?
   * A: The bag filled with sand.
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * Why was the bed made by the carpenter smaller than what the King wanted?
   * A) Carpenter used a small ruler
   * B) The King's handspan was larger than the carpenter's handspan
   * C) Carpenter cut the wood wrong
   * D) Bed shrank
   * Answer: B) The King's handspan was larger than the carpenter's handspan
 * On a balance scale, the pan containing the lighter object moves:
   * A) Downwards
   * B) Upwards
   * C) Stays equal
   * D) Rotates
   * Answer: B) Upwards
 * Which of the following is the heaviest fruit?
   * A) Apple
   * B) Mango
   * C) Watermelon
   * D) Lemon
   * Answer: C) Watermelon
 * To make 3 glasses of nimbu pani, how many spoons of lemon juice are needed if 1 glass needs 2 spoons?
   * A) 3
   * B) 4
   * C) 6
   * D) 5
   * Answer: C) 6
 * Jal Tarang is a musical instrument made using:
   * A) Wooden sticks
   * B) Glasses filled with different levels of water
   * C) Tight ropes
   * D) Paper cups
   * Answer: B) Glasses filled with different levels of water
Fill in the Blanks with Options (6–10)
 * A carrot is ________ than a pumpkin.
   * A) lighter
   * B) heavier
   * Answer: A) lighter
 * To reach school quickly, one should choose the ________ path.
   * A) shortest
   * B) longest
   * Answer: A) shortest
 * A paper bag filled with sand is ________ than the same bag filled with dry leaves.
   * A) heavier
   * B) lighter
   * Answer: A) heavier
 * Measuring length using handspans gives ________ results for different people.
   * A) different
   * B) same
   * Answer: A) different
 * The side of the balance scale carrying the heavier weight goes ________.
   * A) down
   * B) up
   * Answer: A) down
Chapter 8: Grouping and Sharing
Flashcards (10 Questions & Answers)
 * Flashcard 1
   * Q: What is repeated addition of the same number called?
   * A: Multiplication.
 * Flashcard 2
   * Q: Express 3 + 3 + 3 + 3 as a multiplication statement.
   * A: 4 \times 3 = 12 (4 times 3).
 * Flashcard 3
   * Q: How many total wheels are there on 4 bicycles (each having 2 wheels)?
   * A: 4 \times 2 = 8 wheels.
 * Flashcard 4
   * Q: What is 3 \times 5?
   * A: 15.
 * Flashcard 5
   * Q: Is 4 \times 3 equal to 3 \times 4?
   * A: Yes, both equal 12.
 * Flashcard 6
   * Q: If 12 gulab jamuns are shared equally between 2 children, how many does each get?
   * A: 6 gulab jamuns (12 \div 2).
 * Flashcard 7
   * Q: If you have 20 beads and put 5 beads in each bracelet, how many bracelets can you make?
   * A: 4 bracelets (20 \div 5).
 * Flashcard 8
   * Q: If 24 bananas are shared equally among 3 monkeys, how many bananas does each monkey get?
   * A: 8 bananas (24 \div 3).
 * Flashcard 9
   * Q: How do you make the table of 4 using the table of 2?
   * A: By adding the table of 2 to itself (2 + 2 = 4).
 * Flashcard 10
   * Q: How many cars are needed for 40 people if 5 people can sit in 1 car?
   * A: 8 cars (40 \div 5).
Quizzes (10 Questions with Answers)
Multiple Choice Questions (1–5)
 * How can 5 + 5 + 5 be written as a multiplication expression?
   * A) 5 \times 5
   * B) 3 \times 5
   * C) 3 + 5
   * D) 5 \times 1
   * Answer: B) 3 \times 5
 * There are 7 cars, and each car has 4 w"""

c2_map = {
    "Chapter 1": "A Day at the Beach",
    "Chapter 2": "Shapes Around Us",
    "Chapter 3": "Fun With Numbers",
    "Chapter 4": "Shadow Story",
    "Chapter 5": "Playing With Lines",
    "Chapter 6": "Decoration For Festival",
    "Chapter 7": "Rani's Gift",
    "Chapter 8": "Grouping and Sharing"
}

fc_db_ext = {}
quiz_db_ext = {}

curr_chap = ""
mode = ""
lines = raw_data.strip().split('\n')

for i in range(len(lines)):
    line = lines[i].strip()
    match = re.match(r"^Chapter\s+(\d+):", line)
    if match:
        chap_num = match.group(1)
        if f"Chapter {chap_num}" in c2_map:
            curr_chap = c2_map[f"Chapter {chap_num}"]
            fc_db_ext[curr_chap] = []
            quiz_db_ext[curr_chap] = []
    
    elif line.startswith("Flashcards ("):
        mode = "fc"
    elif line.startswith("Quizzes ("):
        mode = "quiz"
    
    elif mode == "fc" and line.startswith("* Q:"):
        q_text = line.split(":", 1)[1].strip()
        ans_text = ""
        if i + 1 < len(lines) and lines[i+1].strip().startswith("* A:"):
            ans_text = lines[i+1].strip().split(":", 1)[1].strip()
        if curr_chap in fc_db_ext:
            fc_db_ext[curr_chap].append((q_text, ans_text, ans_text))
        
    elif mode == "quiz" and line.startswith("* Answer:"):
        ans_clean = line.split("Answer:")[1].strip()
        ans_clean = re.sub(r'^[A-D]\)\s*', '', ans_clean)
        
        q_idx = i - 1
        opts = []
        while q_idx > 0:
            text_line = lines[q_idx].strip()
            if not text_line.startswith('* A)') and not text_line.startswith('* B)') and not text_line.startswith('* C)') and not text_line.startswith('* D)'):
                break
            q_idx -= 1
            
        q_text = lines[q_idx].strip().lstrip('*').strip()
        
        for j in range(q_idx + 1, i):
            opt = lines[j].strip().lstrip('*').strip()
            if opt:
                if re.match(r'^[A-D]\)', opt):
                    opts.append(re.sub(r'^[A-D]\)\s*', '', opt))
        
        ans_idx = 0
        for idx, o in enumerate(opts):
            if o.lower().startswith(ans_clean.lower()[:3]) or ans_clean.lower().startswith(o.lower()[:3]):
                ans_idx = idx
                break
                
        if curr_chap in quiz_db_ext:
            quiz_db_ext[curr_chap].append({
                "q": q_text,
                "options": opts,
                "ans_idx": ans_idx,
                "exp": f"The correct answer is: {ans_clean}"
            })

print(f"Parsed {sum(len(v) for v in fc_db_ext.values())} FCs and {sum(len(v) for v in quiz_db_ext.values())} Quizzes")

# Update generate_ncert.py
with open('generate_ncert.py', 'r', encoding='utf-8') as f:
    text = f.read()

# For Class 2, we append the FC and Quizzes directly to the ends of FC_DB and QUIZ_DB strings.
# Wait, FC_DB ends around "# Class 2 Maths". But actually, it's safer to just dynamically inject it similar to before.
fc_str_ext = ""
for k, v in fc_db_ext.items():
    fc_str_ext += f'    "{k}": {v},\n'

q_str = ""
for k, v in quiz_db_ext.items():
    q_str += f'    "{k}": {json.dumps(v, ensure_ascii=False)},\n'

# Find the end of FC_DB
fc_end_idx = text.find('}\n\nQUIZ_DB = {')
if fc_end_idx != -1:
    text = text[:fc_end_idx] + ",\n" + fc_str_ext + text[fc_end_idx:]

# Find the end of QUIZ_DB
q_end_idx = text.find('}\n\ndef make_lesson')
if q_end_idx != -1:
    text = text[:q_end_idx] + ",\n" + q_str + text[q_end_idx:]
else:
    q_end_idx = text.find('}\n\n\ndef make_lesson')
    if q_end_idx != -1:
        text = text[:q_end_idx] + ",\n" + q_str + text[q_end_idx:]


with open('generate_ncert.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Injected into generate_ncert.py successfully!")
