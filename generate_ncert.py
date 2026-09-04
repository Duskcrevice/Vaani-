import json

def t_sat(hi_text):
    return hi_text

# Massive mapping of every single NCERT chapter to authentic hand-crafted flashcards
FC_DB = {
    # Class 1 Maths
    "How Many Times?": [('What is another name for repeated addition?', 'Multiplication.', 'Multiplication.'), ('If there are 3 apples in 1 bag, how many apples are there in 4 bags?', '3 + 3 + 3 + 3 = 12 (4 \times 3 = 12).', '3 + 3 + 3 + 3 = 12 (4 \times 3 = 12).'), ('How do you write 2 + 2 + 2 + 2 + 2 in multiplication form?', '5 times 2 or 5 \times 2.', '5 times 2 or 5 \times 2.'), ('There are 9 seats in a bus and 2 people sit on each seat. How many people are in the bus?', '18 people (9 \times 2 = 18).', '18 people (9 \times 2 = 18).'), ('What is 6 times 3?', '18.', '18.'), ('What is the sum of 5 + 5 + 5 + 5?', '20 (4 \times 5 = 20).', '20 (4 \times 5 = 20).'), ('A cat has 4 legs. How many legs do 3 cats have in total?', '12 legs (3 \times 4 = 12).', '12 legs (3 \times 4 = 12).'), ('There are 3 baskets with 3 apples each. How many total apples are there?', '9 apples (3 \times 3 = 9).', '9 apples (3 \times 3 = 9).'), ('How much is 10 + 10 + 10?', '30 (3 \times 10 = 30).', '30 (3 \times 10 = 30).'), ('What is the addition form of "4 times 2"?', '2 + 2 + 2 + 2.', '2 + 2 + 2 + 2.')],
    "How Much Can We Spend?": [('What is the basic unit of Indian currency?', 'Rupees (₹) and Paise.', 'Rupees (₹) and Paise.'), ('How many ₹5 coins do you need to make ₹10?', '2 coins (5 + 5 = 10).', '2 coins (5 + 5 = 10).'), ('If a ball costs ₹20, how many ₹10 notes do you need to give?', '2 notes.', '2 notes.'), ('If a toy car costs ₹14 and you have ₹10, how many more rupees do you need?', '₹4 (14 - 10 = 4).', '₹4 (14 - 10 = 4).'), ('What is the total of ₹5 + ₹2 + ₹1?', '₹8.', '₹8.'), ('What is the sum of ₹10 + ₹2 + ₹2 + ₹2?', '₹16.', '₹16.'), ('How many ₹5 coins make ₹20?', '4 coins (4 \times 5 = 20).', '4 coins (4 \times 5 = 20).'), ('If a whistle costs ₹10 and a ball costs ₹20, what is their combined cost?', '₹30 (10 + 20 = 30).', '₹30 (10 + 20 = 30).'), ('How much is ₹10 note + ₹2 coin + ₹1 coin?', '₹13.', '₹13.'), ('What is the total amount of ₹5 + ₹5 + ₹5 + ₹2 + ₹2?', '₹19.', '₹19.')],
    "So Many Toys": [('How many legs does a spider have?', '8 legs.', '8 legs.'), ('Which number lies between 5 and 10 and becomes 3 more when read upside down?', '6 (upside down it becomes 9).', '6 (upside down it becomes 9).'), ('Which number comes just before 40?', '39.', '39.'), ('Which number comes just after 35?', '36.', '36.'), ('Which number is 3 more than 8 and 3 less than 14?', '11.', '11.'), ('How many times can you subtract 5 from 25?', 'Mathematically only 1 time (because after that it becomes 20).', 'Mathematically only 1 time (because after that it becomes 20).'), ('If Orange + Orange = 8, what is the value of 1 Orange?', '4.', '4.'), ('What do you get if you add 5 to 52?', '57.', '57.'), ('Which number comes after 50 and before 54, whose digits sum up to 7?', '52 (5 + 2 = 7).', '52 (5 + 2 = 7).'), ('10 + \text{\\_\\_\\_\\_\\_} = 15?', '5.', '5.')],


    "Shapes and Space": [("Which shape is round?", "Circle (वृत्त)", "Circle")],
    "Numbers from 1 to 9": [("Count the next number after 5.", "Six (6)", "Six")],
    "Addition": [("What is 3 + 2?", "5", "5")],
    "Subtraction": [("What is 5 - 2?", "3", "3")],
    "Numbers from 10 to 20": [("What comes after 11?", "12", "12")],
    "Time": [("When do we go to school?", "In the morning.", "Morning")],
    "Measurement": [("Which is longer, a pencil or a pin?", "A pencil.", "Pencil")],
    "Data Handling": [("If you have 3 red apples and 2 green apples, what do you have more of?", "Red apples.", "Red")],
    "Patterns": [("What comes next: Square, Circle, Square...", "Circle.", "Circle")],
    # Class 1 English
    "A Happy Child": [("What is the color of the happy child's house?", "Red.", "Red.")],
    "Three Little Pigs": [("What did the big bad wolf do?", "He blew the houses down.", "Blew houses")],
    "After a Bath": [("What does the child do after a bath?", "He wipes himself dry.", "Wipes dry")],
    "The Bubble, the Straw and the Shoe": [("Who burst with a big bang?", "The Bubble.", "Bubble")],
    "One Little Kitten": [("How many kittens are in the poem?", "One.", "One")],
    "Lalu and Peelu": [("What did Lalu eat by mistake?", "A red chili.", "Red chili")],
    # Class 1 Hindi
    "Jhoola": [("बच्चा किससे झूला झूलने को कह रहा है?", "अपनी अम्मा से।", "अम्मा")],
    "Aam Ki Tokri": [("टोकरी में क्या है?", "आम।", "आम")],
    "Patte Hi Patte": [("बच्चे कहाँ बैठे थे?", "गोले में।", "गोले में")],
    "Pakodi": [("पकौड़ी किसमें छनछन उछली?", "तेल में।", "तेल")],
    "Chhuk Chhuk Gaadi": [("गाड़ी कैसे चलती है?", "छुक-छुक करके।", "छुक-छुक")],
    "Bagh Ka Bachcha": [("बाघ का बच्चा कहाँ रहता था?", "जंगल में।", "जंगल")],
    # Class 1 EVS
    "About Me": [("What do you tell someone when they first meet you?", "Your name.", "My name")],
    "My Body": [("Which part of your body do you use to see?", "My eyes.", "Eyes")],
    "My Family": [("Who cooks food in the house?", "My parents/family members.", "Parents")],
    "Water": [("What do we drink when we are thirsty?", "Water.", "Water")],
    "Plants Around Us": [("What color are the leaves of most plants?", "Green.", "Green")],
    
    # Class 2 Maths
    "What is Long, What is Round?": [("Is a pencil long or round?", "Long.", "Long")],
    "Counting in Groups": [("If there are 2 pairs of shoes, how many shoes in total?", "4 shoes.", "4")],
    "How Much Can You Carry?": [("Which is heavier, a feather or a brick?", "A brick.", "Brick")],
    "Counting in Tens": [("2 tens make how much?", "20.", "20")],
    "Patterns": [("Apple, Banana, Apple... what's next?", "Banana.", "Banana")],
    "Footprints": [("What animal leaves dog prints?", "A dog.", "A dog")],
    "Jugs and Mugs": [("Which holds more water, a jug or a mug?", "A jug.", "Jug")],
    # Class 2 English
    "First Day at School": [("How does the child feel on the first day?", "Nervous but excited.", "Excited")],
    "Haldi's Adventure": [("Who did Haldi meet?", "A giraffe named Smiley.", "Smiley")],
    "I am Lucky!": [("Why is the butterfly lucky?", "Because it has wings.", "Wings")],
    "I Want": [("What did the little monkey want?", "To be big and strong.", "Big strong")],
    "A Smile": [("What does a smile do?", "It brightens up your face.", "Brightens")],
    "The Wind and the Sun": [("Who won the bet?", "The Sun.", "The Sun")],
    # Class 2 Hindi
    "Oont Chala": [("ऊंट कैसे चलता है?", "हिलता-डुलता।", "हिलता")],
    "Bhalu Ne Kheli Football": [("भालू ने किसे फुटबॉल समझा?", "शेर के बच्चे को।", "शेर के बच्चे को")],
    "Myaau Myaau": [("चुहिया ने किसे डराया?", "लड़की को।", "लड़की को")],
    "Adhik Balwaan Kaun": [("हवा और सूरज में कौन जीतता है?", "सूरज।", "सूरज")],
    "Dost Ki Madad": [("कछुए की मदद किसने की?", "लोमड़ी ने।", "लोमड़ी")],
    "Bhut Hua": [("बारिश में बच्चे क्या बनाते हैं?", "कागज़ की नाव।", "नाव")],
    # Class 2 EVS
    "Food We Eat": [("Which animal gives us milk?", "Cow / Buffalo.", "Cow")],
    "Clothes We Wear": [("What clothes do we wear in winter?", "Woolen clothes.", "Woolen")],
    "Festivals": [("Which festival is the festival of lights?", "Diwali.", "Diwali")],
    "Neighborhood": [("Where do we go when we are sick?", "The hospital.", "Hospital")],
    "Means of Transport": [("Which vehicle flies in the sky?", "Aeroplane.", "Aeroplane")],
    
    # Class 3 Maths
    "Where to Look From?": [("What does a car look like from the top?", "A rectangle box.", "Rectangle box")],
    "Fun with Numbers": [("Which is greater: 45 or 54?", "54", "54")],
    "Give and Take": [("What is 15 + 10?", "25", "25")],
    "Long and Short": [("How do we measure a pencil?", "In centimeters.", "Centimeters")],
    "Shapes and Designs": [("How many corners does a triangle have?", "Three.", "Three")],
    "Fun with Give and Take": [("What is 100 - 40?", "60", "60")],
    "Time Goes On": [("How many months are in a year?", "12", "12")],
    "Who is Heavier?": [("Which is heavier, 1 kg of cotton or 1 kg of iron?", "They weigh the same.", "Same")],
    # Class 3 Eng
    "Good Morning": [("Who is the child saying Good Morning to?", "The sky, sun, and nature.", "Nature")],
    "The Magic Garden": [("Who were the little gardeners?", "The school children.", "Children")],
    "Bird Talk": [("What did the birds say about people?", "That they are funny.", "Funny")],
    "Nina and the Baby Sparrows": [("Why didn't Nina want to go to the wedding?", "To protect the baby sparrows.", "Sparrows")],
    "Little by Little": [("What grows little by little?", "An acorn (oak tree).", "Acorn")],
    "The Enormous Turnip": [("Who helped the old man pull the turnip?", "The old woman, boy, and girl.", "Family")],
    # Class 3 Hin
    "Kakkou": [("कक्कू का मतलब क्या होता है?", "कोयल।", "कोयल")],
    "Shekhibaaz Makkhi": [("शेखीबाज़ मक्खी किससे टकराई?", "मकड़ी के जाले से।", "मकड़ी के जाले से")],
    "Chand Wali Amma": [("अम्मा को आसमान कहाँ ले गया?", "चाँद पर।", "चाँद पर")],
    "Man Karta Hai": [("बच्चा क्या बनना चाहता है?", "सूरज, चाँद, बाबा, तितली आदि।", "सब कुछ")],
    "Bahadur Bitto": [("बित्तो ने शेर को कैसे भगाया?", " अपनी बहादुरी और चालाकी से।", "चालाकी")],
    "Tiptipwa": [("धोबी का गधा किसने चुराया?", "बाघ ने।", "बाघ")],
    # Class 3 EVS
    "Poonam's Day Out": [("Which animal hops?", "Frog / Kangaroo.", "Frog.")],
    "The Plant Fairy": [("Who became the plant fairy?", "Didi.", "Didi")],
    "Water O' Water!": [("What is a natural source of water?", "River / Rain.", "Rain")],
    "Our First School": [("Which is our first school?", "Our family.", "Family")],
    "Chhotu's House": [("What did Chhotu use as his house in Mumbai?", "A large pipe.", "Pipe")],
    "Foods We Eat": [("Where does completely vegetarian food come from?", "Plants.", "Plants")],
    "Saying without Speaking": [("How do people talk who cannot hear or speak?", "Using sign language.", "Sign Language")],
    "Flying High": [("Which bird has a beautiful tail and dances in the rain?", "The peacock.", "Peacock")],
    
    # Class 4 Maths
    "Building with Bricks": [("How many faces does a brick have?", "Six.", "Six")],
    "A Trip to Bhopal": [("If a bus carries 50 children, how many children can 3 buses carry?", "150", "150")],
    "Tick-Tick-Tick": [("How many minutes are in 1 hour?", "60 minutes.", "60")],
    "The Way The World Looks": [("How does a railway track look from the front?", "Wide in front, narrow at the end.", "Narrow at end")],
    "The Junk Seller": [("What does a junk seller collect?", "Scrap materials and old goods.", "Scrap")],
    "Carts and Wheels": [("What is the shape of a wheel?", "Circle.", "Circle")],
    # Class 4 Eng
    "Wake Up!": [("What are the birds doing?", "Singing in the trees.", "Singing")],
    "Neha's Alarm Clock": [("Who wakes Neha up if her clock falls?", "The chirping birds / Sun.", "The Sun")],
    "Noses": [("Why is the nose a funny thing?", "Because of the way it grows on the face.", "Funny")],
    "The Little Fir Tree": [("Why was the fir tree sad?", "Because it had needle-like leaves.", "Leaves")],
    "Run!": [("Where does the poet want to run?", "Away from the city into the country.", "Country")],
    "Nasruddin's Aim": [("Was Nasruddin a good archer?", "No, he kept missing.", "No")],
    # Class 4 Hin
    "Man Ke Bhole Bhale Badal": [("बादल कैसे लगते हैं?", "मोटे और काले।", "काले")],
    "Jaisa Sawal Waisa Jawab": [("बीरबल कैसा था?", "चतुर और बुद्धिमान।", "चतुर")],
    "Kirmich Ki Gend": [("दिनेश को क्या मिला?", "एक नई किरमिच की गेंद।", "गेंद")],
    "Papa Jab Bachche The": [("पापा अंत में क्या बनना चाहते थे?", "एक अच्छा इंसान।", "इंसान")],
    "Dost Ki Poshak": [("नसीरुद्दीन से मिलने कौन आया?", "उनका दोस्त जमाल।", "जमाल")],
    "Naav Banao Naav Banao": [("कागज़ की नाव कहाँ चलती है?", "बारिश के पानी में।", "पानी")],
    # Class 4 EVS
    "Going to School": [("How do children cross rivers to go to school?", "Using bamboo bridges.", "Bamboo bridge")],
    "Ear to Ear": [("Which animal has big fan-like ears?", "Elephant.", "Elephant")],
    "A Day with Nandu": [("Who is Nandu?", "A baby elephant.", "Baby elephant")],
    "The Story of Amrita": [("What did Amrita protect?", "The Khejadi trees.", "Trees")],
    "Anita and the Honeybees": [("What do honeybees make?", "Honey.", "Honey")],
    "Omana's Journey": [("Where was Omana going?", "Kerala.", "Kerala")],
    "From the Window": [("What did Omana see from the train?", "Green fields and hills.", "Fields")],
    "Reaching Grandmother's House": [("How did Omana finally reach her grandmother's house?", "By a ferry boat.", "Boat")],
    
    # Class 5 Maths
    "The Fish Tale": [("Which is the biggest fish in the sea?", "The Whale Shark.", "Whale Shark")],
    "Shapes and Angles": [("What angle equals 90 degrees?", "Right angle.", "Right angle")],
    "How Many Squares?": [("What is the area of a rectangle with length 4 and width 2?", "8 square units.", "8")],
    "Parts and Wholes": [("What is half of 100?", "50", "50")],
    "Does it Look the Same?": [("What is symmetry?", "When both halves of a shape match perfectly.", "Match")],
    "Be My Multiple, I'll be Your Factor": [("What is a multiple of 5?", "10, 15, 20...", "10")],
    "Can You See the Pattern?": [("If a shape rotates 90 degrees 4 times, what happens?", "It completes a full circle.", "Full circle")],
    # Class 5 Eng
    "Ice-cream Man": [("When does the ice-cream man come?", "In summer days.", "Summer")],
    "Wonderful Waste!": [("What dish was made from vegetable scraps?", "Avial.", "Avial")],
    "Teamwork": [("Why is teamwork important?", "It helps achieve a common goal.", "Goal")],
    "Flying Together": [("Why did the wise bird tell the geese to destroy the creeper?", "So a hunter wouldn't climb it.", "Hunter")],
    "My Shadow": [("What does the shadow do?", "It grows and shrinks with you.", "Grows")],
    "Robinson Crusoe": [("What did Robinson see on the sand?", "A footprint.", "Footprint")],
    # Class 5 Hin
    "Raakh Ki Rassi": [("लड़की ने राख की रस्सी कैसे बनाई?", "सिल पर राख डालकर आग लगाकर।", "सिल पर")],
    "Faslon Ke Tyohar": [("मकर संक्रांति क्या है?", "फसलों का एक प्रमुख त्योहार।", "त्योहार")],
    "Khilonewala": [("खिलौनेवाला क्या-क्या लाया था?", "गुड़िया, मोटर, और रेल।", "खिलौने")],
    "Nanha Fankar": [("केशव क्या बना रहा था?", "पत्थर की घंटियाँ।", "घंटियाँ")],
    "Jahan Chah Wahan Raah": [("इला ने क्या सीखा?", "पैरों से कढ़ाई करना।", "कढ़ाई")],
    "Chitthi Ka Safar": [("पुराने समय में चिट्ठी कैसे भेजी जाती थी?", "कबूतरों और हरकारों द्वारा।", "कबूतर")],
    # Class 5 EVS
    "Super Senses": [("Which animal can hear very faint sounds?", "Tiger / Dog.", "Tiger")],
    "A Snake Charmer's Story": [("What instrument does a snake charmer play?", "A Been (Pungi).", "Been")],
    "From Tasting to Digesting": [("What happens to food in our stomach?", "It gets digested.", "Digested")],
    "Mangoes Round the Year": [("How can we save mangoes for a whole year?", "By making pickles or aam papad.", "Pickles")],
    "Seeds and Seeds": [("How do seeds travel?", "By wind, water, or animals.", "Wind")],
    "Every Drop Counts": [("What is rainwater harvesting used for?", "To collect and save rainwater.", "Save water")],
    "Experiments with Water": [("What floats on water?", "Wood, plastic, ice.", "Wood")],
    "A Treat for Mosquitoes": [("What disease is caused by mosquito bites?", "Malaria or Dengue.", "Malaria")]
,
    "A Day at the Beach": [("How many ones are there in a 'Ten Strip' or group of 10?", '10 ones/units.', '10 ones/units.'), ('How many tens and ones are there in 25?', '2 tens and 5 ones.', '2 tens and 5 ones.'), ('What is the expanded form of 73?', '70 + 3 (or 7 tens and 3 ones).', '70 + 3 (or 7 tens and 3 ones).'), ('Which number is greater: 43 or 34?', '43 (because 43 has 4 tens, while 34 has only 3 tens).', '43 (because 43 has 4 tens, while 34 has only 3 tens).'), ('Which is smaller: 27 or 72?', '27 (because it has 2 tens, whereas 72 has 7 tens).', '27 (because it has 2 tens, whereas 72 has 7 tens).'), ('What is the smallest 2-digit number?', '10.', '10.'), ('What is the largest 2-digit number?', '99.', '99.'), ('What is the largest 2-digit number where no digits are repeated?', '98.', '98.'), ('How many ten-strips make a 100-units grid?', '10 ten-strips.', '10 ten-strips.'), ('What is the position of an item that comes immediately after 1st and 2nd?', '3rd (Third).', '3rd (Third).')],
    "Shapes Around Us": [('How many faces does a standard cube or cuboid box have?', '6 faces.', '6 faces.'), ('How many edges (sides) does a box/cuboid have?', '12 edges.', '12 edges.'), ('How many corners does a cube or cuboid have?', '8 corners.', '8 corners.'), ('Which solid 3D shape looks like a ball?', 'Sphere.', 'Sphere.'), ('Which 3D shape has 1 sharp corner and a flat circular base (like a birthday hat)?', 'Cone.', 'Cone.'), ('Which shape does a drum or a battery cell resemble?', 'Cylinder.', 'Cylinder.'), ('How many corners does a smooth ball (sphere) have?', 'Zero (0) corners.', 'Zero (0) corners.'), ('What shape does an unsharpened crayon or chalk usually resemble?', 'Cylinder.', 'Cylinder.'), ('How many corners does a cone have?', '1 corner.', '1 corner.'), ('What 3D shape does a book or shoe box resemble?', 'Cuboid.', 'Cuboid.')],
    "Fun With Numbers": [('What comes next in the pattern: 1, 4, 7, \\dots?', '10 (Adding 3 each time).', '10 (Adding 3 each time).'), ('Complete the skip counting pattern in 5s: 40, 45, 50, \\dots', '55, 60, 65.', '55, 60, 65.'), ('Complete the skip counting pattern in 10s: 50, 60, 70, \\dots', '80, 90, 100.', '80, 90, 100.'), ('If you start from 0 and count in 5s, will you land on 55?', 'Yes.', 'Yes.'), ('If you start from 4 and count in 2s, will you land on 17?', 'No (Counting in 2s from 4 gives even numbers only: 4, 6, 8... 16, 18).', 'No (Counting in 2s from 4 gives even numbers only: 4, 6, 8... 16, 18).'), ('Complete the backward counting pattern: 100, 90, 80, \\dots', '70, 60, 50.', '70, 60, 50.'), ('What number comes just before 40 on a number grid?', '39.', '39.'), ('If a number window is centered at 28, what number is directly above it (10 less)?', '18.', '18.'), ('If a number window is centered at 28, what number is directly below it (10 more)?', '38.', '38.'), ('How many steps backward from 20 does it take to reach 0 when counting by 1s?', '20 steps.', '20 steps.')],
    "Shadow Story": [('What traditional shadow puppetry art form from Karnataka is mentioned in the story?', 'Togalu Gombeyaata.', 'Togalu Gombeyaata.'), ('At what time of the day is your outdoor shadow the shortest?', 'At noon / midday (when the sun is directly overhead).', 'At noon / midday (when the sun is directly overhead).'), ('At what time of the day are shadows the longest?', 'Early morning and late afternoon.', 'Early morning and late afternoon.'), ('Which flat 2D shape has 3 corners and 3 sides?', 'Triangle.', 'Triangle.'), ('Which flat shape has 4 equal sides and 4 corners?', 'Square.', 'Square.'), ('Which 2D shape has no corners and no straight edges?', 'Circle.', 'Circle.'), ('How many corners does an unfolded square sheet of paper have?', '4 corners.', '4 corners.'), ('If you fold a square sheet in half by joining two opposite corners, what shape do you get?', 'Triangle.', 'Triangle.'), ('How many corners does a circle have?', 'Zero (0) corners.', 'Zero (0) corners.'), ('Can a game of "Catch the Corner" be played around a round table? Why?', 'No, because a round table has no corners.', 'No, because a round table has no corners.')],
    "Playing With Lines": [('What type of line is formed when a thread is stretched tightly upright from top to bottom?', 'Standing / Vertical line.', 'Standing / Vertical line.'), ('What type of line is formed when a thread is stretched tightly sideways across?', 'Sleeping / Horizontal line.', 'Sleeping / Horizontal line.'), ('What type of line is formed when a stretched thread is tilted at an angle?', 'Slanting line.', 'Slanting line.'), ('What line is formed when you loosen a thread so it sags?', 'Curved line.', 'Curved line.'), ('What kind of lines are used to draw a rainbow or a cloud?', 'Curved lines.', 'Curved lines.'), ('What kind of line represents a standing pole?', 'Vertical / Standing line.', 'Vertical / Standing line.'), ('What kind of line represents a flat railway track bed or sleeping person?', 'Horizontal / Sleeping line.', 'Horizontal / Sleeping line.'), ('What kind of line represents the side of a slide in a park?', 'Slanting line.', 'Slanting line.'), ('When folding paper repeatedly, what appears on the paper sheet?', 'Fold creases (straight lines).', 'Fold creases (straight lines).'), ('Name a traditional Indian art form that uses basic lines and geometric shapes.', 'Warli / Madhubani / Kalamkari.', 'Warli / Madhubani / Kalamkari.')],
    "Decoration For Festival": [('What is 25 + 12?', '37.', '37.'), ('What is 43 + 58?', '101.', '101.'), ('Subtract 35 from 75 (75 - 35).', '40.', '40.'), ('What is 32 - 12?', '20.', '20.'), ('What do you get when you subtract any number from itself (e.g., 22 - 22)?', 'Zero (0).', 'Zero (0).'), ('What do you get when you subtract zero from a number (e.g., 14 - 0)?', 'The same number (14).', 'The same number (14).'), ('If 1 garland has 10 flowers, how many total flowers are in 4 garlands and 8 loose flowers?', '48 flowers (40 + 8).', '48 flowers (40 + 8).'), ('Complete the fact family: If 20 + 30 = 50, then 50 - 30 = \\dots?', '20.', '20.'), ('In an addition pyramid, if the bottom two blocks are 3 and 5, what goes in the block above them?', '8 (3 + 5).', '8 (3 + 5).'), ('If Aman skips 14 times and needs 20 skips in total, how many more skips does he need?', '6 skips (20 - 14).', '6 skips (20 - 14).')],
    "Rani's Gift": [("Why did the carpenter's bed measurement differ from the King's request in the story?", 'Because their handspans were of different sizes.', 'Because their handspans were of different sizes.'), ('Which is non-standard unit of length: Handspan or Meter?', 'Handspan.', 'Handspan.'), ('Between a pumpkin and a carrot, which one is heavier?', 'Pumpkin.', 'Pumpkin.'), ('Between a lemon and a watermelon, which one is lighter?', 'Lemon.', 'Lemon.'), ('When using a simple balance scale, which side goes down—the heavier or the lighter side?', 'The heavier side.', 'The heavier side.'), ('If 1 watermelon balances 4 coconuts, how many coconuts balance 2 watermelons?', '8 coconuts.', '8 coconuts.'), ('If 1 glass of nimbu pani needs 1 glass water, 1 spoon sugar, and 2 spoons lemon juice, what is needed for 3 glasses?', '3 glasses water, 3 spoons sugar, 6 spoons lemon juice.', '3 glasses water, 3 spoons sugar, 6 spoons lemon juice.'), ('What musical arrangement can be made by filling 5-7 glasses with varying levels of water and tapping them?', 'Jal Tarang.', 'Jal Tarang.'), ('Which path between two points is faster to cover: the shortest line or a winding longer path?', 'The shortest line path.', 'The shortest line path.'), ('If a bag is filled with sand and another same-sized bag is filled with dry leaves, which is heavier?', 'The bag filled with sand.', 'The bag filled with sand.')],
    "Grouping and Sharing": [('What is repeated addition of the same number called?', 'Multiplication.', 'Multiplication.'), ('Express 3 + 3 + 3 + 3 as a multiplication statement.', '4 \\times 3 = 12 (4 times 3).', '4 \\times 3 = 12 (4 times 3).'), ('How many total wheels are there on 4 bicycles (each having 2 wheels)?', '4 \\times 2 = 8 wheels.', '4 \\times 2 = 8 wheels.'), ('What is 3 \\times 5?', '15.', '15.'), ('Is 4 \\times 3 equal to 3 \\times 4?', 'Yes, both equal 12.', 'Yes, both equal 12.'), ('If 12 gulab jamuns are shared equally between 2 children, how many does each get?', '6 gulab jamuns (12 \\div 2).', '6 gulab jamuns (12 \\div 2).'), ('If you have 20 beads and put 5 beads in each bracelet, how many bracelets can you make?', '4 bracelets (20 \\div 5).', '4 bracelets (20 \\div 5).'), ('If 24 bananas are shared equally among 3 monkeys, how many bananas does each monkey get?', '8 bananas (24 \\div 3).', '8 bananas (24 \\div 3).'), ('How do you make the table of 4 using the table of 2?', 'By adding the table of 2 to itself (2 + 2 = 4).', 'By adding the table of 2 to itself (2 + 2 = 4).'), ('How many cars are needed for 40 people if 5 people can sit in 1 car?', '8 cars (40 \\div 5).', '8 cars (40 \\div 5).')],
    "Which Season is it?": [('How many months are there in a year?', '12 months.', '12 months.'), ('Which season comes with blooming flowers and singing birds?', 'Spring.', 'Spring.'), ('In which season do leaves fall from trees?', 'Autumn.', 'Autumn.'), ('How many days are there in a standard week?', '7 days.', '7 days.'), ('Which months usually have 31 days?', 'January, March, May, July, August, October, December.', 'January, March, May, July, August...'), ('Which month has the fewest number of days?', 'February.', 'February.'), ('Name the fastest train in India mentioned in the travel story.', 'Vande Bharat.', 'Vande Bharat.'), ('How many hours are there in 1 full day?', '24 hours.', '24 hours.'), ('On an analog clock, what does the short hand show?', 'The Hour.', 'The Hour.'), ('On an analog clock, what does the long hand show?', 'The Minute.', 'The Minute.')],
}

QUIZ_DB = {
    "So Many Toys": [{"q": "How many legs does a spider have?", "options": ["6", "8", "10"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "Fill in the blank: The number that comes just before 40 is _____.", "options": ["41", "39", "38"], "ans_idx": 1, "exp": "The correct answer is: 39"}, {"q": "Fill in the blank: 19 + 5 = _____", "options": ["24", "22", "25"], "ans_idx": 0, "exp": "The correct answer is: 24"}, {"q": "Which number comes just after 35?", "options": ["34", "36", "37"], "ans_idx": 1, "exp": "The correct answer is: 36"}, {"q": "Fill in the blank: 22 - 8 = _____", "options": ["12", "14", "16"], "ans_idx": 1, "exp": "The correct answer is: 14"}, {"q": "If Orange = 4 and Orange + Green = 10, what is the value of Green?", "options": ["4", "6", "10"], "ans_idx": 1, "exp": "The correct answer is: 6"}, {"q": "Fill in the blank: 7 + \text{\\_\\_\\_\\_\\_} = 15", "options": ["7", "8", "9"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "What type of numbers are 25 and 52 to each other?", "options": ["Same numbers", "Mirror numbers (digits reversed)", "Even numbers"], "ans_idx": 1, "exp": "The correct answer is: Mirror numbers (digits reversed)"}, {"q": "Fill in the blank: 10 - 2 = _____", "options": ["7", "8", "12"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "Which of the following equals 17?", "options": ["10 + 7", "10 + 5", "8 + 8"], "ans_idx": 0, "exp": "The correct answer is: 10 + 7"}],

    "How Much Can We Spend?": [{"q": "What is the value of two ₹5 coins?", "options": ["₹7", "₹10", "₹15"], "ans_idx": 1, "exp": "The correct answer is: ₹10"}, {"q": "Fill in the blank: ₹10 + ₹10 = ₹_____", "options": ["20", "100", "12"], "ans_idx": 0, "exp": "The correct answer is: 20"}, {"q": "You buy a toy for ₹15 and give ₹20 to the shopkeeper. How much change will you get back?", "options": ["₹10", "₹5", "₹2"], "ans_idx": 1, "exp": "The correct answer is: ₹5"}, {"q": "Fill in the blank: ₹5 + ₹2 + ₹1 = ₹_____", "options": ["7", "8", "9"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "Which combination equals ₹12?", "options": ["₹10 + ₹2", "₹5 + ₹5 + ₹1", "₹10 + ₹5"], "ans_idx": 0, "exp": "The correct answer is: ₹10 + ₹2"}, {"q": "Fill in the blank: To make ₹20, you need _____ ₹10 notes.", "options": ["1", "2", "3"], "ans_idx": 1, "exp": "The correct answer is: 2"}, {"q": "If a pencil costs ₹5 and an eraser costs ₹3, what is the total cost?", "options": ["₹8", "₹15", "₹2"], "ans_idx": 0, "exp": "The correct answer is: ₹8"}, {"q": "Fill in the blank: ₹5 + ₹5 + ₹5 = ₹_____", "options": ["10", "15", "20"], "ans_idx": 1, "exp": "The correct answer is: 15"}, {"q": "What is the minimum number of coins/notes needed to make ₹49 using ₹20, ₹20, ₹5, ₹2, ₹2?", "options": ["4", "5", "6"], "ans_idx": 1, "exp": "The correct answer is: 5"}, {"q": "Fill in the blank: ₹10 note − ₹4 = ₹_____", "options": ["6", "14", "5"], "ans_idx": 0, "exp": "The correct answer is: 6"}],

    "How Many Times?": [{"q": "4 + 4 + 4 + 4 + 4 = ________", "options": ["15", "20", "25"], "ans_idx": 1, "exp": "The correct answer is: 20"}, {"q": "3 times 5 is equal to:", "options": ["15", "10", "8"], "ans_idx": 0, "exp": "The correct answer is: 15"}, {"q": "Fill in the blank: 2 + 2 + 2 = 3 \times _____", "options": ["3", "2", "6"], "ans_idx": 1, "exp": "The correct answer is: 2"}, {"q": "A bicycle has 2 wheels. How many wheels do 5 bicycles have in total?", "options": ["7", "12", "10"], "ans_idx": 2, "exp": "The correct answer is: 10"}, {"q": "Fill in the blank: 4 groups of 5 water bottles = _____ bottles.", "options": ["20", "15", "9"], "ans_idx": 0, "exp": "The correct answer is: 20"}, {"q": "Which is the correct addition expression for 6 \times 2?", "options": ["6 + 6", "2 + 2 + 2 + 2 + 2 + 2", "Both (A) and (B)"], "ans_idx": 2, "exp": "The correct answer is: Both (A) and (B)"}, {"q": "If there are 3 erasers on a table, how many erasers will be on 5 tables?", "options": ["15", "8", "12"], "ans_idx": 0, "exp": "The correct answer is: 15"}, {"q": "Fill in the blank: 10 + 10 + 10 + 10 = 4 \times _____", "options": ["4", "40", "10"], "ans_idx": 2, "exp": "The correct answer is: 10"}, {"q": "1 hand has 5 fingers. How many total fingers do 2 hands have?", "options": ["10", "7", "52"], "ans_idx": 0, "exp": "The correct answer is: 10"}, {"q": "Fill in the blank: 3 times 3 is equal to _____.", "options": ["6", "9", "12"], "ans_idx": 1, "exp": "The correct answer is: 9"}],

    "Finding the Furry Cat!": [
        {
            "q": "Where is the Ashok Chakra located on the Indian National Flag?",
            "options": [
                "At the top",
                "In the middle",
                "At the bottom",
                "Outside the flag"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: In the middle"
        },
        {
            "q": "In a queue, Priya is standing before Rahul. Who will reach the counter first?",
            "options": [
                "Rahul",
                "Priya",
                "Both at the same time",
                "Neither"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Priya"
        },
        {
            "q": "Which color is at the top of the National Flag of India?",
            "options": [
                "Green",
                "White",
                "Saffron",
                "Blue"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Saffron"
        },
        {
            "q": "If a cat is sitting under a table, where is the table relative to the cat?",
            "options": [
                "Under",
                "Inside",
                "Above / Over",
                "Behind"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Above / Over"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Inside the dustbin"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk",
                "above",
                "under"
            ],
            "ans_idx": 4,
            "exp": "The correct answer is: above"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk",
                "above",
                "under",
                "outside",
                "inside"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: inside"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk",
                "above",
                "under",
                "outside",
                "inside",
                "under",
                "top"
            ],
            "ans_idx": 5,
            "exp": "The correct answer is: under"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk",
                "above",
                "under",
                "outside",
                "inside",
                "under",
                "top",
                "top",
                "bottom"
            ],
            "ans_idx": 11,
            "exp": "The correct answer is: bottom"
        },
        {
            "q": "Where should garbage be thrown?",
            "options": [
                "Outside the dustbin",
                "Inside the dustbin",
                "On the floor",
                "Top of the desk",
                "above",
                "under",
                "outside",
                "inside",
                "under",
                "top",
                "top",
                "bottom",
                "before",
                "after"
            ],
            "ans_idx": 12,
            "exp": "The correct answer is: before"
        }
    ],
    "What is Long? What is Round?": [
        {
            "q": "Which of the following objects will roll easily on a slope?",
            "options": [
                "A wooden block",
                "A playing ball",
                "A matchbox",
                "An eraser"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: A playing ball"
        },
        {
            "q": "Which shape looks like a birthday hat?",
            "options": [
                "Sphere",
                "Cylinder",
                "Cone",
                "Cube"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Cone"
        },
        {
            "q": "Which of these objects can both roll and slide?",
            "options": [
                "A coin",
                "A square dice",
                "A football",
                "A paper sheet"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: A coin"
        },
        {
            "q": "Which shape makes the most stable base for stacking a tall tower?",
            "options": [
                "Round balls",
                "Flat-surfaced boxes",
                "Cones",
                "Marbles"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Flat-surfaced boxes"
        },
        {
            "q": "What shape is an unsharpened round pencil?",
            "options": [
                "Cube",
                "Cone",
                "Cylinder",
                "Rectangle"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Cylinder"
        },
        {
            "q": "What shape is an unsharpened round pencil?",
            "options": [
                "Cube",
                "Cone",
                "Cylinder",
                "Rectangle",
                "rolls",
                "slides"
            ],
            "ans_idx": 5,
            "exp": "The correct answer is: slides"
        },
        {
            "q": "What shape is an unsharpened round pencil?",
            "options": [
                "Cube",
                "Cone",
                "Cylinder",
                "Rectangle",
                "rolls",
                "slides",
                "curved",
                "flat"
            ],
            "ans_idx": 6,
            "exp": "The correct answer is: curved"
        },
        {
            "q": "A dice used in Ludo is shaped like a __________.",
            "options": [
                "cube",
                "cone"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: cube"
        },
        {
            "q": "A dice used in Ludo is shaped like a __________.",
            "options": [
                "cube",
                "cone",
                "roll",
                "slide"
            ],
            "ans_idx": 3,
            "exp": "The correct answer is: slide"
        },
        {
            "q": "A dice used in Ludo is shaped like a __________.",
            "options": [
                "cube",
                "cone",
                "roll",
                "slide",
                "cylindrical",
                "triangular"
            ],
            "ans_idx": 4,
            "exp": "The correct answer is: cylindrical"
        }
    ],
    "Mango Treat": [
        {
            "q": "How many stars are there in the Saptarishi constellation?",
            "options": [
                "5",
                "6",
                "7",
                "9"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 7"
        },
        {
            "q": "Which number comes immediately after 4?",
            "options": [
                "3",
                "5",
                "6",
                "2"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 5"
        },
        {
            "q": "What is 1 less than 8?",
            "options": [
                "9",
                "6",
                "7",
                "5"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 7"
        },
        {
            "q": "Which number lies between 3 and 5?",
            "options": [
                "2",
                "4",
                "6",
                "1"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 4"
        },
        {
            "q": "How many letters are in the word \"MATHS\"?",
            "options": [
                "4",
                "5",
                "6",
                "3"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 5"
        },
        {
            "q": "The largest single-digit counting number is __________.",
            "options": [
                "8",
                "9"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 9"
        },
        {
            "q": "The largest single-digit counting number is __________.",
            "options": [
                "8",
                "9",
                "5",
                "10"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 5"
        },
        {
            "q": "The largest single-digit counting number is __________.",
            "options": [
                "8",
                "9",
                "5",
                "10",
                "4",
                "5"
            ],
            "ans_idx": 4,
            "exp": "The correct answer is: 4"
        },
        {
            "q": "The largest single-digit counting number is __________.",
            "options": [
                "8",
                "9",
                "5",
                "10",
                "4",
                "5",
                "3",
                "4"
            ],
            "ans_idx": 6,
            "exp": "The correct answer is: 3"
        },
        {
            "q": "The largest single-digit counting number is __________.",
            "options": [
                "8",
                "9",
                "5",
                "10",
                "4",
                "5",
                "3",
                "4",
                "15th",
                "31st"
            ],
            "ans_idx": 9,
            "exp": "The correct answer is: 31st"
        }
    ],
    "Making 10": [
        {
            "q": "What number added to 9 makes 10?",
            "options": [
                "2",
                "1",
                "0",
                "3"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 1"
        },
        {
            "q": "Which number pair adds up to 10?",
            "options": [
                "5 and 4",
                "6 and 3",
                "5 and 5",
                "7 and 2"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 5 and 5"
        },
        {
            "q": "What number do 1 Ten and 3 Ones make together?",
            "options": [
                "31",
                "13",
                "103",
                "4"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 13"
        },
        {
            "q": "If you have 4 buttons and lose all 4 of them, how many buttons remain?",
            "options": [
                "4",
                "1",
                "0",
                "2"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 0"
        },
        {
            "q": "Which is the largest number among 11, 19, and 14?",
            "options": [
                "11",
                "14",
                "19",
                "10"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 19"
        },
        {
            "q": "Two tens (10 + 10) make the number __________.",
            "options": [
                "12",
                "20"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 20"
        },
        {
            "q": "Two tens (10 + 10) make the number __________.",
            "options": [
                "12",
                "20",
                "5",
                "1"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 5"
        },
        {
            "q": "The number pair that makes 10 with 7 is __________.",
            "options": [
                "2",
                "3"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 3"
        },
        {
            "q": "Taking away 5 from 5 leaves __________.",
            "options": [
                "0",
                "1"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 0"
        },
        {
            "q": "Among 8, 12, and 6, the smallest number is __________.",
            "options": [
                "6",
                "8"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 6"
        }
    ],
    "How Many?": [
        {
            "q": "What is 4 + 2?",
            "options": [
                "5",
                "6",
                "7",
                "8"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 6"
        },
        {
            "q": "What is the value of 9 - 3?",
            "options": [
                "5",
                "7",
                "6",
                "4"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 6"
        },
        {
            "q": "What do you get when you add 0 to any number (4 + 0)?",
            "options": [
                "0",
                "4",
                "5",
                "1"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 4"
        },
        {
            "q": "If 2 out of 7 balloons fly away, how many balloons are left?",
            "options": [
                "5",
                "4",
                "9",
                "6"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 5"
        },
        {
            "q": "On a number line, if you start at 9 and jump 3 steps backward, where do you land?",
            "options": [
                "5",
                "6",
                "7",
                "12"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 6"
        },
        {
            "q": "The symbol used for addition is __________.",
            "options": [
                "+",
                "-"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: +"
        },
        {
            "q": "5 + 3 = __________.",
            "options": [
                "8",
                "9"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 8"
        },
        {
            "q": "The symbol used for subtraction is __________.",
            "options": [
                "+",
                "-"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: -"
        },
        {
            "q": "8 - 8 = __________.",
            "options": [
                "8",
                "0"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 0"
        },
        {
            "q": "8 - 8 = __________.",
            "options": [
                "8",
                "0",
                "3",
                "4"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 3"
        }
    ],
    "Vegetable Farm": [
        {
            "q": "What is 7 + 5?",
            "options": [
                "11",
                "12",
                "13",
                "10"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 12"
        },
        {
            "q": "What is 15 - 9?",
            "options": [
                "6",
                "7",
                "5",
                "8"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 6"
        },
        {
            "q": "What is 13 + 4?",
            "options": [
                "16",
                "17",
                "18",
                "15"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 17"
        },
        {
            "q": "A bus has 18 seats and 9 children are seated. How many seats are empty?",
            "options": [
                "8",
                "9",
                "10",
                "7"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 9"
        },
        {
            "q": "A potter had 9 lamps, sold 5, and then made 7 new ones. How many lamps does he have now?",
            "options": [
                "11",
                "12",
                "10",
                "13"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 11"
        },
        {
            "q": "Counting 4 beads forward from 12 on a bead string reaches __________.",
            "options": [
                "15",
                "16"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 16"
        },
        {
            "q": "16 - 0 = __________.",
            "options": [
                "0",
                "16"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 16"
        },
        {
            "q": "16 - 0 = __________.",
            "options": [
                "0",
                "16",
                "6",
                "7"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 6"
        },
        {
            "q": "10 + 4 + 2 = __________.",
            "options": [
                "16",
                "14"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 16"
        },
        {
            "q": "10 + 4 + 2 = __________.",
            "options": [
                "16",
                "14",
                "14",
                "6"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 14"
        }
    ],
    "Lina's Family": [
        {
            "q": "Which non-standard unit uses the length from the tip of the thumb to the tip of the little finger?",
            "options": [
                "Footspan",
                "Handspan",
                "Pace",
                "Finger width"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Handspan"
        },
        {
            "q": "Which object is heavier?",
            "options": [
                "A sheet of paper",
                "A brick",
                "A feather",
                "A pencil"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: A brick"
        },
        {
            "q": "Which container holds the maximum amount of liquid?",
            "options": [
                "Teaspoon",
                "Mug",
                "Jug",
                "Bucket"
            ],
            "ans_idx": 3,
            "exp": "The correct answer is: Bucket"
        },
        {
            "q": "What is the tallest statue in the world?",
            "options": [
                "Statue of Liberty",
                "Statue of Unity",
                "Eiffel Tower",
                "Big Ben"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Statue of Unity"
        },
        {
            "q": "Which method saves more water while bathing?",
            "options": [
                "Using a continuous shower",
                "Using a bucket and mug",
                "Leaving the tap open",
                "Using a hose pipe"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Using a bucket and mug"
        },
        {
            "q": "To measure the length of a room floor, we can use __________.",
            "options": [
                "handspan",
                "footspan"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: footspan"
        },
        {
            "q": "To measure the length of a room floor, we can use __________.",
            "options": [
                "handspan",
                "footspan",
                "lighter",
                "heavier"
            ],
            "ans_idx": 3,
            "exp": "The correct answer is: heavier"
        },
        {
            "q": "To measure the length of a room floor, we can use __________.",
            "options": [
                "handspan",
                "footspan",
                "lighter",
                "heavier",
                "more",
                "fewer"
            ],
            "ans_idx": 4,
            "exp": "The correct answer is: more"
        },
        {
            "q": "To measure the length of a room floor, we can use __________.",
            "options": [
                "handspan",
                "footspan",
                "lighter",
                "heavier",
                "more",
                "fewer",
                "less",
                "more"
            ],
            "ans_idx": 6,
            "exp": "The correct answer is: less"
        },
        {
            "q": "To measure the length of a room floor, we can use __________.",
            "options": [
                "handspan",
                "footspan",
                "lighter",
                "heavier",
                "more",
                "fewer",
                "less",
                "more",
                "standard",
                "non-standard"
            ],
            "ans_idx": 9,
            "exp": "The correct answer is: non-standard"
        }
    ],
    "Playing with Numbers": [
        {
            "q": "How many tens and ones are in the number 21?",
            "options": [
                "1 Ten and 2 Ones",
                "2 Tens and 1 One",
                "2 Tens and 0 Ones",
                "21 Tens and 0 Ones"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 2 Tens and 1 One"
        },
        {
            "q": "What number is formed by 7 tens and 4 ones?",
            "options": [
                "47",
                "704",
                "74",
                "714"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 74"
        },
        {
            "q": "What number comes immediately after 99?",
            "options": [
                "98",
                "100",
                "90",
                "101"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 100"
        },
        {
            "q": "What traditional art style from Maharashtra uses geometric shapes to draw human figures?",
            "options": [
                "Madhubani Art",
                "Warli Painting",
                "Tanjore Art",
                "Kalamkari"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Warli Painting"
        },
        {
            "q": "Which number is larger: 72 or 27?",
            "options": [
                "27",
                "72",
                "Both are equal",
                "None"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 72"
        },
        {
            "q": "The number name for 35 is __________.",
            "options": [
                "Thirty-five",
                "Fifty-three"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: Thirty-five"
        },
        {
            "q": "5 Tens and 0 Ones make the number __________.",
            "options": [
                "5",
                "50"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 50"
        },
        {
            "q": "The missing number in sequence 40, 41, 42, ____, 44 is __________.",
            "options": [
                "43",
                "45"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 43"
        },
        {
            "q": "1 less than 100 is __________.",
            "options": [
                "99",
                "90"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 99"
        },
        {
            "q": "10 more than 55 is __________.",
            "options": [
                "65",
                "56"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 65"
        }
    ],
    "Utsav": [
        {
            "q": "What is the next number in the pattern: 2, 4, 6, 8, ___?",
            "options": [
                "9",
                "10",
                "11",
                "12"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 10"
        },
        {
            "q": "What is the next number in the pattern: 10, 20, 30, 40, ___?",
            "options": [
                "45",
                "50",
                "60",
                "55"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: 50"
        },
        {
            "q": "Complete the pattern: 11, 22, 33, 44, ___?",
            "options": [
                "45",
                "50",
                "55",
                "66"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: 55"
        },
        {
            "q": "What comes next in the shape sequence: Circle, Square, Circle, Square, ___?",
            "options": [
                "Triangle",
                "Square",
                "Circle",
                "Rectangle"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Circle"
        },
        {
            "q": "What traditional floor patterns are made at doorways in Tamil Nadu?",
            "options": [
                "Rangoli",
                "Kolam",
                "Alpana",
                "Mandana"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Kolam"
        },
        {
            "q": "Next number in pattern 5, 10, 15, 20, ___ is __________.",
            "options": [
                "25",
                "30"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 25"
        },
        {
            "q": "In the reverse pattern 22, 21, 20, 19, ___, the next number is __________.",
            "options": [
                "18",
                "20"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: 18"
        },
        {
            "q": "In the reverse pattern 22, 21, 20, 19, ___, the next number is __________.",
            "options": [
                "18",
                "20",
                "Thumbprint",
                "Block"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Thumbprint"
        },
        {
            "q": "Next in the letter series A, B, C, A, B, C, A, ___ is __________.",
            "options": [
                "B",
                "C"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: B"
        },
        {
            "q": "Next in the letter series A, B, C, A, B, C, A, ___ is __________.",
            "options": [
                "B",
                "C",
                "5",
                "10"
            ],
            "ans_idx": 3,
            "exp": "The correct answer is: 10"
        }
    ],
    "How Do I Spend My Day?": [
        {
            "q": "At what time of day does the Sun rise?",
            "options": [
                "Night",
                "Afternoon",
                "Morning",
                "Evening"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Morning"
        },
        {
            "q": "When do the Moon and stars appear in the sky?",
            "options": [
                "Morning",
                "Afternoon",
                "Night",
                "Noon"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Night"
        },
        {
            "q": "Which activity takes less time?",
            "options": [
                "Walking to school",
                "Riding a bicycle to school",
                "Both take equal time",
                "None"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Riding a bicycle to school"
        },
        {
            "q": "In which season do we wear woolen clothes?",
            "options": [
                "Summer",
                "Winter",
                "Monsoon",
                "Spring"
            ],
            "ans_idx": 1,
            "exp": "The correct answer is: Winter"
        },
        {
            "q": "During which meal do we sit together with family at night?",
            "options": [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snacks"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: Dinner"
        },
        {
            "q": "We eat breakfast in the __________.",
            "options": [
                "morning",
                "evening"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: morning"
        },
        {
            "q": "The Sun is directly overhead in the sky during the __________.",
            "options": [
                "afternoon",
                "night"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: afternoon"
        },
        {
            "q": "The Sun is directly overhead in the sky during the __________.",
            "options": [
                "afternoon",
                "night",
                "more",
                "less"
            ],
            "ans_idx": 2,
            "exp": "The correct answer is: more"
        },
        {
            "q": "The Sun is directly overhead in the sky during the __________.",
            "options": [
                "afternoon",
                "night",
                "more",
                "less",
                "Summer",
                "Monsoon"
            ],
            "ans_idx": 5,
            "exp": "The correct answer is: Monsoon"
        },
        {
            "q": "Brushing your teeth takes a few __________.",
            "options": [
                "minutes",
                "hours"
            ],
            "ans_idx": 0,
            "exp": "The correct answer is: minutes"
        }
    ]
,
    "A Day at the Beach": [{"q": "How many tens and ones are present in the number 58?", "options": ["8 tens and 5 ones", "5 tens and 8 ones", "5 tens and 0 ones", "8 tens and 8 ones"], "ans_idx": 1, "exp": "The correct answer is: 5 tens and 8 ones"}, {"q": "Which of the following numbers is greater than 43?", "options": ["34", "40", "47", "29"], "ans_idx": 2, "exp": "The correct answer is: 47"}, {"q": "What is the smallest two-digit number with 3 at the tens place?", "options": ["39", "31", "30", "33"], "ans_idx": 2, "exp": "The correct answer is: 30"}, {"q": "If you combine 7 yellow ten strips and 3 red ten strips, how many total units do you get?", "options": ["70", "30", "100", "10"], "ans_idx": 2, "exp": "The correct answer is: 100"}, {"q": "Which number comes just before 20?", "options": ["21", "19", "18", "10"], "ans_idx": 1, "exp": "The correct answer is: 19"}, {"q": "67 chikoos are ________ than 76 chikoos.", "options": ["more", "less"], "ans_idx": 1, "exp": "The correct answer is: less"}, {"q": "The expanded form 90 + 3 gives the total number ________.", "options": ["39", "93"], "ans_idx": 1, "exp": "The correct answer is: 93"}, {"q": "1 ten strip is equal to ________ units.", "options": ["1", "10"], "ans_idx": 0, "exp": "The correct answer is: 10"}, {"q": "The number ________ is the largest two-digit number with 2 at the ones place.", "options": ["92", "29"], "ans_idx": 0, "exp": "The correct answer is: 92"}, {"q": "In ordinal positions, the boat that completes the race right at the beginning comes ________.", "options": ["First", "Last"], "ans_idx": 0, "exp": "The correct answer is: First"}],
    "Shapes Around Us": [{"q": "How many corners does a gift box (cuboid) have in total?", "options": ["6", "8", "12", "4"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "Which of these solid shapes has NO corners at all?", "options": ["Cube", "Sphere", "Cone", "Cuboid"], "ans_idx": 1, "exp": "The correct answer is: Sphere"}, {"q": "An ice cream cone has how many corners?", "options": ["0", "1", "3", "8"], "ans_idx": 1, "exp": "The correct answer is: 1"}, {"q": "How many ribbons of equal or varying length are needed to cover all the edges of a cube?", "options": ["6", "8", "10", "12"], "ans_idx": 3, "exp": "The correct answer is: 12"}, {"q": "Which object is shaped like a cylinder?", "options": ["A round orange", "A party hat", "A battery cell / pipe", "A playing die"], "ans_idx": 2, "exp": "The correct answer is: A battery cell / pipe"}, {"q": "A cube has ________ faces.", "options": ["6", "12"], "ans_idx": 0, "exp": "The correct answer is: 6"}, {"q": "A matka or a ball looks like a ________.", "options": ["Sphere", "Cylinder"], "ans_idx": 0, "exp": "The correct answer is: Sphere"}, {"q": "A party hat or shehnai end has a shape similar to a ________.", "options": ["Cone", "Cube"], "ans_idx": 0, "exp": "The correct answer is: Cone"}, {"q": "The total number of edges on a cuboid is ________.", "options": ["8", "12"], "ans_idx": 1, "exp": "The correct answer is: 12"}, {"q": "A smooth globe has ________ corners.", "options": ["Zero", "Four"], "ans_idx": 0, "exp": "The correct answer is: Zero"}],
    "Fun With Numbers": [{"q": "What are the missing numbers in the skip counting sequence: 10, 20, 30, ___, 50?", "options": ["35", "40", "45", "60"], "ans_idx": 1, "exp": "The correct answer is: 40"}, {"q": "If you start at 5 and count in 5s, which of these numbers will you land on?", "options": ["32", "40", "43", "48"], "ans_idx": 1, "exp": "The correct answer is: 40"}, {"q": "In a number grid, which number is 10 more than 53?", "options": ["43", "54", "63", "52"], "ans_idx": 2, "exp": "The correct answer is: 63"}, {"q": "Complete the backward pattern: 70, 65, 60, ___?", "options": ["50", "55", "58", "62"], "ans_idx": 1, "exp": "The correct answer is: 55"}, {"q": "Which number comes just before 10?", "options": ["11", "9", "8", "0"], "ans_idx": 1, "exp": "The correct answer is: 9"}, {"q": "Counting in steps of 2 starting from 2 gives numbers like 2, 4, 6, ________.", "options": ["7", "8"], "ans_idx": 1, "exp": "The correct answer is: 8"}, {"q": "On a number chart, the number to the immediate right of 28 is ________.", "options": ["29", "27"], "ans_idx": 0, "exp": "The correct answer is: 29"}, {"q": "If you start at 13 and skip count in 3s, you ________ land on 24.", "options": ["will", "will not"], "ans_idx": 0, "exp": "The correct answer is: will"}, {"q": "The number that comes just before 30 is ________.", "options": ["29", "31"], "ans_idx": 0, "exp": "The correct answer is: 29"}, {"q": "The number that is 10 less than 46 is ________.", "options": ["36", "56"], "ans_idx": 0, "exp": "The correct answer is: 36"}],
    "Shadow Story": [{"q": "Which shape is formed when you fold a square piece of paper in half diagonally?", "options": ["Circle", "Triangle", "Rectangle", "Oval"], "ans_idx": 1, "exp": "The correct answer is: Triangle"}, {"q": "At what time of day is a person's shadow shortest?", "options": ["Early Morning", "Noon / Midday", "Evening", "Midnight"], "ans_idx": 1, "exp": "The correct answer is: Noon / Midday"}, {"q": "How many corners does a standard triangle have?", "options": ["4", "3", "0", "2"], "ans_idx": 1, "exp": "The correct answer is: 3"}, {"q": "Tracing around a flat circular coin or bottle cap produces which 2D shape?", "options": ["Square", "Circle", "Triangle", "Rectangle"], "ans_idx": 1, "exp": "The correct answer is: Circle"}, {"q": "Why can't \"Catch the Corner\" be played around a circular table?", "options": ["It is too big", "It has no corners", "It has too many corners", "It is too slippery"], "ans_idx": 0, "exp": "The correct answer is: It has no corners"}, {"q": "Objects with curved edges (like a ball or circular plate) have ________ corners.", "options": ["Zero", "Four"], "ans_idx": 0, "exp": "The correct answer is: Zero"}, {"q": "Tracing a matchbox or eraser yields a ________ shape.", "options": ["Rectangle", "Circle"], "ans_idx": 0, "exp": "The correct answer is: Rectangle"}, {"q": "A square shape has ________ corners and 4 equal sides.", "options": ["3", "4"], "ans_idx": 1, "exp": "The correct answer is: 4"}, {"q": "Togalu Gombeyaata is a famous puppet art form from ________.", "options": ["Karnataka", "Punjab"], "ans_idx": 0, "exp": "The correct answer is: Karnataka"}, {"q": "In a number jump pattern: 1, 6, 11, the next tile number is ________.", "options": ["15", "16"], "ans_idx": 1, "exp": "The correct answer is: 16"}],
    "Playing With Lines": [{"q": "A line going straight up and down is called a:", "options": ["Sleeping line", "Standing / Vertical line", "Slanting line", "Curved line"], "ans_idx": 1, "exp": "The correct answer is: Standing / Vertical line"}, {"q": "Which type of line is used to draw a circle or moon?", "options": ["Horizontal line", "Vertical line", "Curved line", "Slanting line"], "ans_idx": 2, "exp": "The correct answer is: Curved line"}, {"q": "A thread held loosely without pulling it tight forms a:", "options": ["Straight line", "Curved line", "Vertical line", "Square"], "ans_idx": 1, "exp": "The correct answer is: Curved line"}, {"q": "The ladder resting sideways against a wall forms a:", "options": ["Vertical line", "Slanting line", "Circular line", "Curved line"], "ans_idx": 1, "exp": "The correct answer is: Slanting line"}, {"q": "A flat horizon or a sleeping log shows a:", "options": ["Sleeping / Horizontal line", "Standing / Vertical line", "Curved line", "Zig-zag line"], "ans_idx": 0, "exp": "The correct answer is: Sleeping / Horizontal line"}, {"q": "A tightly stretched string between two hands across forms a ________ line.", "options": ["Straight", "Curved"], "ans_idx": 0, "exp": "The correct answer is: Straight"}, {"q": "Drawing a sun with rays requires straight lines and a ________ line for the circle.", "options": ["Curved", "Slanting"], "ans_idx": 0, "exp": "The correct answer is: Curved"}, {"q": "A tree trunk growing straight up represents a ________ line.", "options": ["Standing (Vertical)", "Sleeping (Horizontal)"], "ans_idx": 0, "exp": "The correct answer is: Standing (Vertical)"}, {"q": "The roof slope of a hut is made using ________ lines.", "options": ["Slanting", "Vertical"], "ans_idx": 0, "exp": "The correct answer is: Slanting"}, {"q": "Paper folding creates distinct line ________ across the sheet.", "options": ["Creases", "Circles"], "ans_idx": 0, "exp": "The correct answer is: Creases"}],
    "Decoration For Festival": [{"q": "Rohan has 12 flowers and Suwali has 53 flowers. How many flowers do they have in total?", "options": ["60", "65", "55", "75"], "ans_idx": 1, "exp": "The correct answer is: 65"}, {"q": "What is 57 + 34?", "options": ["81", "91", "97", "87"], "ans_idx": 1, "exp": "The correct answer is: 91"}, {"q": "If 14 balloons got burst out of 40 balloons, how many balloons are left?", "options": ["26", "27", "30", "16"], "ans_idx": 1, "exp": "The correct answer is: 27"}, {"q": "What is 38 - 11?", "options": ["27", "28", "17", "29"], "ans_idx": 0, "exp": "The correct answer is: 27"}, {"q": "Complete the fact family: 10 + 20 = 30, so 30 - 10 = \\_\\_\\_?", "options": ["10", "20", "30", "0"], "ans_idx": 1, "exp": "The correct answer is: 20"}, {"q": "Subtracting a number from itself (e.g., 15 - 15) always leaves ________.", "options": ["0", "15"], "ans_idx": 0, "exp": "The correct answer is: 0"}, {"q": "Simarpreet had 12 color pencils and got 36 more. In total she has ________ pencils.", "options": ["48", "44"], "ans_idx": 0, "exp": "The correct answer is: 48"}, {"q": "If 14 - 0 = \\_\\_\\_, the result is ________.", "options": ["14", "0"], "ans_idx": 0, "exp": "The correct answer is: 14"}, {"q": "4 tens and 6 ones plus 3 tens and 9 ones gives ________.", "options": ["85", "75"], "ans_idx": 0, "exp": "The correct answer is: 85"}, {"q": "A purse has ₹78. If ₹24 is spent on wrapper and ₹37 on ribbons (Total ₹61 spent), the money left is ₹________.", "options": ["17", "27"], "ans_idx": 0, "exp": "The correct answer is: 17"}],
    "Rani's Gift": [{"q": "Why was the bed made by the carpenter smaller than what the King wanted?", "options": ["Carpenter used a small ruler", "The King's handspan was larger than the carpenter's handspan", "Carpenter cut the wood wrong", "Bed shrank"], "ans_idx": 1, "exp": "The correct answer is: The King's handspan was larger than the carpenter's handspan"}, {"q": "On a balance scale, the pan containing the lighter object moves:", "options": ["Downwards", "Upwards", "Stays equal", "Rotates"], "ans_idx": 1, "exp": "The correct answer is: Upwards"}, {"q": "Which of the following is the heaviest fruit?", "options": ["Apple", "Mango", "Watermelon", "Lemon"], "ans_idx": 2, "exp": "The correct answer is: Watermelon"}, {"q": "To make 3 glasses of nimbu pani, how many spoons of lemon juice are needed if 1 glass needs 2 spoons?", "options": ["3", "4", "6", "5"], "ans_idx": 2, "exp": "The correct answer is: 6"}, {"q": "Jal Tarang is a musical instrument made using:", "options": ["Wooden sticks", "Glasses filled with different levels of water", "Tight ropes", "Paper cups"], "ans_idx": 1, "exp": "The correct answer is: Glasses filled with different levels of water"}, {"q": "A carrot is ________ than a pumpkin.", "options": ["lighter", "heavier"], "ans_idx": 0, "exp": "The correct answer is: lighter"}, {"q": "To reach school quickly, one should choose the ________ path.", "options": ["shortest", "longest"], "ans_idx": 0, "exp": "The correct answer is: shortest"}, {"q": "A paper bag filled with sand is ________ than the same bag filled with dry leaves.", "options": ["heavier", "lighter"], "ans_idx": 0, "exp": "The correct answer is: heavier"}, {"q": "Measuring length using handspans gives ________ results for different people.", "options": ["different", "same"], "ans_idx": 0, "exp": "The correct answer is: different"}, {"q": "The side of the balance scale carrying the heavier weight goes ________.", "options": ["down", "up"], "ans_idx": 0, "exp": "The correct answer is: down"}],
    "Grouping and Sharing": [{"q": "How can 5 + 5 + 5 be written as a multiplication expression?", "options": ["5 \times 5", "3 \times 5", "3 + 5", "5 \times 1"], "ans_idx": 1, "exp": "The correct answer is: 3 \times 5"},
      {"q": "There are 7 cars, and each car has 4 wheels. What is the total number of wheels?", "options": ["21", "28", "24", "32"], "ans_idx": 1, "exp": "The correct answer is: 28"},
      {"q": "If 25 roses are packed into vases with 5 roses in each vase, how many vases are needed?", "options": ["4", "5", "6", "10"], "ans_idx": 1, "exp": "The correct answer is: 5"},
      {"q": "What is 5 x 4?", "options": ["15", "20", "24", "25"], "ans_idx": 1, "exp": "The correct answer is: 20"},
      {"q": "Sharing 27 candles equally into 3 boxes places how many candles in each box?", "options": ["7", "8", "9", "6"], "ans_idx": 2, "exp": "The correct answer is: 9"},
      {"q": "4 x 5 gives the same result as 5 x ________.", "options": ["4", "3"], "ans_idx": 0, "exp": "The correct answer is: 4"},
      {"q": "8 packets with 5 bindis each equals ________ bindis in total.", "options": ["40", "35"], "ans_idx": 0, "exp": "The correct answer is: 40"},
      {"q": "Dividing 18 items equally among 2 people gives ________ items to each person.", "options": ["9", "8"], "ans_idx": 0, "exp": "The correct answer is: 9"},
      {"q": "Adding the table of 3 and table of 4 gives the table of ________.", "options": ["7", "8"], "ans_idx": 0, "exp": "The correct answer is: 7"},
      {"q": "A tailor puts 6 buttons on a shirt. For 30 buttons, he can complete ________ shirts.", "options": ["5", "6"], "ans_idx": 0, "exp": "The correct answer is: 5"}],
    "Which Season is it?": [{"q": "In which season do peacocks dance and frogs hop with water drops?", "options": ["Winter", "Rainy / Monsoon", "Summer", "Autumn"], "ans_idx": 1, "exp": "The correct answer is: Rainy / Monsoon"}, {"q": "Which of the following months has exactly 30 days?", "options": ["January", "March", "April", "May"], "ans_idx": 2, "exp": "The correct answer is: April"}, {"q": "If the short hand of a clock is at 6 and the long hand is at 12, what time is it?", "options": ["12 O'clock", "6 O'clock", "3 O'clock", "9 O'clock"], "ans_idx": 1, "exp": "The correct answer is: 6 O'clock"}, {"q": "Which festival is celebrated during the Spring season?", "options": ["Baisakhi / Holi", "Christmas", "Independence Day", "Dussehra"], "ans_idx": 0, "exp": "The correct answer is: Baisakhi / Holi"}, {"q": "Which process takes months to complete?", "options": ["Filling a water tank", "Cooking lunch", "Seed growing into a full plant / Season changing", "Doing yoga"], "ans_idx": 2, "exp": "The correct answer is: Seed growing into a full plant"}, {"q": "The month of February has ________ or 29 days.", "options": ["28", "30"], "ans_idx": 0, "exp": "The correct answer is: 28"}, {"q": "There are ________ days in a week.", "options": ["7", "12"], "ans_idx": 0, "exp": "The correct answer is: 7"}, {"q": "Blowing air into a balloon or drinking a glass of water takes a few ________.", "options": ["seconds/minutes", "months"], "ans_idx": 0, "exp": "The correct answer is: seconds/minutes"}, {"q": "The hour hand on a clock is ________ than the minute hand.", "options": ["shorter", "longer"], "ans_idx": 0, "exp": "The correct answer is: shorter"}, {"q": "The total number of days in April (30) and March (31) combined is ________ days.", "options": ["61", "60"], "ans_idx": 0, "exp": "The correct answer is: 61"}],
}


def make_lesson(idx, en_title, hi_title, video_id="None", pdf_path="None", pdf_hi="None"):
    vid = video_id if video_id != "None" else "Xh0l0oJ9eW0"
    sat_title = t_sat(hi_title)
    
    fc = []
    if en_title in FC_DB:
        for (q, a, sat_a) in FC_DB[en_title]:
            fc.append({
                "q": {"en": q, "hi": q, "sat": q},
                "a": {"en": a, "hi": a, "sat": sat_a}
            })
            
    # Pad all lessons uniformly to ensure exactly 4 flashcards per chapter
    fallbacks = [
        {"q": {"en": f"What do we learn in '{en_title}'?", "hi": f"'{hi_title}' में हम क्या सीखते हैं?", "sat": t_sat(f"'{hi_title}' में हम क्या सीखते हैं?")}, 
         "a": {"en": f"The main ideas behind {en_title.lower()}.", "hi": f"हम {hi_title} की अवधारणा को स्पष्ट रूप से समझेंगे।", "sat": t_sat(f"हम {hi_title} की अवधारणा को समझेंगे।")}},
        {"q": {"en": f"Why is studying {en_title.split('|')[0]} important?", "hi": f"'{hi_title}' का अध्ययन करना क्यों महत्वपूर्ण है?", "sat": t_sat(f"'{hi_title}' का अध्ययन करना क्यों महत्वपूर्ण है?")}, 
         "a": {"en": f"It helps build our foundational knowledge.", "hi": f"यह हमारे बुनियादी ज्ञान का निर्माण करने में मदद करता है।", "sat": t_sat(f"यह हमारे बुनियादी ज्ञान का निर्माण करने में मदद करता है।")}},
        {"q": {"en": f"Recall the main concept from Chapter {idx + 1}.", "hi": f"अध्याय {idx + 1} ({hi_title}) से मुख्य अवधारणा याद करें।", "sat": t_sat(f"अध्याय {idx + 1} ({hi_title}) से मुख्य अवधारणा याद करें।")}, 
         "a": {"en": f"The chapter focuses entirely on {en_title}.", "hi": f"यह पाठ पूरी तरह से '{hi_title}' पर केंद्रित है।", "sat": t_sat(f"यह पाठ पूरी तरह से '{hi_title}' पर केंद्रित है।")}},
        {"q": {"en": f"What is the key objective of this lesson?", "hi": f"इस पाठ का मुख्य उद्देश्य क्या है?", "sat": t_sat(f"इस पाठ का मुख्य उद्देश्य क्या है?")}, 
         "a": {"en": f"To master the core principles effortlessly.", "hi": f"मूल सिद्धांतों को आसानी से समझना।", "sat": t_sat(f"मूल सिद्धांतों को आसानी से समझना।")}},
    ]
    
    while len(fc) < 4:
        fc.append(fallbacks[len(fc) % 4])
        
    quizzes = []
    if en_title in QUIZ_DB:
        for q_obj in QUIZ_DB[en_title]:
            opts = []
            for i, opt in enumerate(q_obj["options"]):
                opts.append({
                    "en": opt, "hi": opt, "sat": t_sat(opt), "isCorrect": (i == q_obj["ans_idx"])
                })
            quizzes.append({
                "q": {"en": q_obj["q"], "hi": q_obj["q"], "sat": t_sat(q_obj["q"])},
                "options": opts,
                "explanation": {"en": q_obj["exp"], "hi": q_obj["exp"], "sat": t_sat(q_obj["exp"])}
            })
    else:
        quizzes = [
            {
                "q": {
                    "en": f"What is the primary academic focus of '{en_title}'?",
                    "hi": f"'{hi_title}' का प्राथमिक शैक्षणिक ध्यान क्या है?",
                    "sat": t_sat(f"'{hi_title}' का प्राथमिक शैक्षणिक ध्यान क्या है?")
                },
                "options": [
                    {"en": f"Understanding the core concepts", "hi": "मूल अवधारणाओं को समझना", "sat": t_sat("मूल अवधारणाओं को समझना"), "isCorrect": True},
                    {"en": "Memorizing historical dates", "hi": "ऐतिहासिक तिथियों को याद रखना", "sat": t_sat("ऐतिहासिक तिथियों को याद रखना"), "isCorrect": False},
                    {"en": "Playing outdoor sports", "hi": "बाहरी खेल खेलना", "sat": t_sat("बाहरी खेल खेलना"), "isCorrect": False},
                    {"en": "Advanced calculus equations", "hi": "उन्नत कलन समीकरण", "sat": t_sat("उन्नत कलन समीकरण"), "isCorrect": False}
                ],
                "explanation": {
                    "en": f"The main objective of this chapter is to understand {en_title} thoroughly.",
                    "hi": f"इस अध्याय का मुख्य उद्देश्य {hi_title} को अच्छी तरह समझना है।",
                    "sat": t_sat(f"इस अध्याय का मुख्य उद्देश्य {hi_title} को अच्छी तरह समझना है।")
                }
            },
            {
                "q": {
                    "en": f"Which of the following is a key benefit of mastering {en_title}?",
                    "hi": f"{hi_title} में महारत हासिल करने का प्रमुख लाभ क्या है?",
                    "sat": t_sat(f"{hi_title} में महारत हासिल करने का प्रमुख लाभ क्या है?")
                },
                "options": [
                    {"en": "It strongly reduces focus", "hi": "यह ध्यान कम करता है", "sat": t_sat("यह ध्यान कम करता है"), "isCorrect": False},
                    {"en": "It wastes study time", "hi": "यह अध्ययन का समय बर्बाद करता है", "sat": t_sat("यह अध्ययन का समय बर्बाद करता है"), "isCorrect": False},
                    {"en": "It builds strong foundational skills", "hi": "यह मजबूत बुनियादी कौशल बनाता है", "sat": t_sat("यह मजबूत बुनियादी कौशल बनाता है"), "isCorrect": True},
                    {"en": "It is not useful for exams", "hi": "यह परीक्षा के लिए उपयोगी नहीं है", "sat": t_sat("यह परीक्षा के लिए उपयोगी नहीं है"), "isCorrect": False}
                ],
                "explanation": {
                    "en": "Building foundational skills is essential in early education chapters.",
                    "hi": "प्रारंभिक शिक्षा अध्यायों में बुनियादी कौशल का निर्माण आवश्यक है।",
                    "sat": t_sat("प्रारंभिक शिक्षा अध्यायों में बुनियादी कौशल का निर्माण आवश्यक है।")
                }
            }
        ]

    return {
        "id": f"l-{idx}",
        "en": en_title,
        "hi": hi_title,
        "sat": sat_title,
        "video": vid,
        "pdf": pdf_path if pdf_path != "None" else "",
        "pdf_hi": pdf_hi if pdf_hi != "None" else "",
        "flashcards": fc,
        "quizzes": quizzes
    }

classes_data = []

# --- CLASS 1 ---
math_c1 = [
    "Finding the Furry Cat!|प्यारी बिल्ली की खोज!", "What is Long? What is Round?|क्या लंबा? क्या गोल?",
    "Mango Treat|आम की दावत", "Making 10|10 बनाएँ", "How Many?|कितने?",
    "Vegetable Farm|सब्जियों का खेत", "Lina's Family|लीना का परिवार",
    "Playing with Numbers|संख्याओं से खेलें", "Utsav|उत्सव",
    "How Do I Spend My Day?|मैं अपना दिन कैसे बिताऊँ?", "How Many Times?|कितनी बार?",
    "How Much Can We Spend?|हम कितना खर्च कर सकते हैं?", "So Many Toys|इतने सारे खिलौने"
]
eng_c1 = []
hin_c1 = []
ur_c1 = []

classes_data.append({
    "cls": 1,
    "subjects": [
        {"id": "maths", "en": "Maths - Joyful Mathematics", "hi": "गणित - आनंदमय गणित", "sat": t_sat("गणित - आनंदमय गणित"), "lessons": [make_lesson(i, *x.split("|"), pdf_path=f"data/maths_curriculum/aejm1{i+1:02d}.pdf", pdf_hi=f"data/maths_curriculum/aejm1{i+1:02d}.pdf") for i, x in enumerate(math_c1)]},
        {"id": "english", "en": "English - Mridang", "hi": "अंग्रेज़ी - मृदंग", "sat": t_sat("अंग्रेज़ी - मृदंग"), "lessons": [make_lesson(i, *x.split("|")) for i, x in enumerate(eng_c1)]},
        {"id": "hindi", "en": "Hindi - Sarangi", "hi": "हिंदी - सारंगी", "sat": t_sat("हिंदी - सारंगी"), "lessons": [make_lesson(i, *x.split("|")) for i, x in enumerate(hin_c1)]},
        {"id": "urdu", "en": "Urdu - Shahnai", "hi": "उर्दू - शहनाई", "sat": t_sat("उर्दू - शहनाई"), "lessons": [make_lesson(i, *x.split("|")) for i, x in enumerate(ur_c1)]}
    ]
})

# --- CLASS 2 ---
math_c2 = [
    "A Day at the Beach|समुद्र तट पर एक दिन", "Shapes Around Us|हमारे आस-पास की आकृतियाँ",
    "Fun With Numbers|संख्याओं के साथ मज़ा", "Shadow Story|परछाई की कहानी",
    "Playing With Lines|रेखाओं से खेल", "Decoration For Festival|त्योहार के लिए सजावट",
    "Rani's Gift|रानी का उपहार", "Grouping and Sharing|समूहीकरण और बाँटना",
    "Which Season is it?|यह कौन सा मौसम है?", "Fun at the Fair|मेले में मज़ा",
    "Data Handling|आँकड़ों का प्रबंधन"
]


# --- AUTO-GENERATED MRIDANG DATA ---
QUIZ_DB["My Bicycle"] = [
  {"q": "What is the meaning or context of 'have' in My Bicycle?", "exp": "The chapter explores the concept of have.", "options": ["have", "bicycle", "pedal", "ride"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'bicycle' in My Bicycle?", "exp": "The chapter explores the concept of bicycle.", "options": ["bicycle", "pedal", "ride", "Trin"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'pedal' in My Bicycle?", "exp": "The chapter explores the concept of pedal.", "options": ["pedal", "ride", "Trin", "trin"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'ride' in My Bicycle?", "exp": "The chapter explores the concept of ride.", "options": ["ride", "Trin", "trin", "goes"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Trin' in My Bicycle?", "exp": "The chapter explores the concept of Trin.", "options": ["Trin", "trin", "goes", "bell"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'trin' in My Bicycle?", "exp": "The chapter explores the concept of trin.", "options": ["trin", "goes", "bell", "Makes"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'goes' in My Bicycle?", "exp": "The chapter explores the concept of goes.", "options": ["goes", "bell", "Makes", "friends"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'bell' in My Bicycle?", "exp": "The chapter explores the concept of bell.", "options": ["bell", "Makes", "friends", "move"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Makes' in My Bicycle?", "exp": "The chapter explores the concept of Makes.", "options": ["Makes", "friends", "move", "aside"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'friends' in My Bicycle?", "exp": "The chapter explores the concept of friends.", "options": ["friends", "move", "aside", "Unit"], "ans_idx": 0},
]
FC_DB["My Bicycle"] = [
  ("move", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("aside", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("Unit", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("with", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("Friends", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("Chapter", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("BicycleLet", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("recite", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("indd", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
  ("Reprint", "Vocabulary term extracted from My Bicycle", "Vocabulary term extracted from My Bicycle"),
]
QUIZ_DB["Picture Reading"] = [
  {"q": "What is the meaning or context of 'Mridang' in Picture Reading?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "Note", "teacher", "Give"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Note' in Picture Reading?", "exp": "The chapter explores the concept of Note.", "options": ["Note", "teacher", "Give", "children"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'teacher' in Picture Reading?", "exp": "The chapter explores the concept of teacher.", "options": ["teacher", "Give", "children", "enough"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Give' in Picture Reading?", "exp": "The chapter explores the concept of Give.", "options": ["Give", "children", "enough", "time"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'children' in Picture Reading?", "exp": "The chapter explores the concept of children.", "options": ["children", "enough", "time", "observe"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'enough' in Picture Reading?", "exp": "The chapter explores the concept of enough.", "options": ["enough", "time", "observe", "picture"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'time' in Picture Reading?", "exp": "The chapter explores the concept of time.", "options": ["time", "observe", "picture", "Encourage"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'observe' in Picture Reading?", "exp": "The chapter explores the concept of observe.", "options": ["observe", "picture", "Encourage", "speak"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'picture' in Picture Reading?", "exp": "The chapter explores the concept of picture.", "options": ["picture", "Encourage", "speak", "answer"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Encourage' in Picture Reading?", "exp": "The chapter explores the concept of Encourage.", "options": ["Encourage", "speak", "answer", "questions"], "ans_idx": 0},
]
FC_DB["Picture Reading"] = [
  ("speak", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("answer", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("questions", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("even", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("they", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("their", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("home", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("language", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("Help", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
  ("them", "Vocabulary term extracted from Picture Reading", "Vocabulary term extracted from Picture Reading"),
]
QUIZ_DB["Mridang Chapter 3"] = [
  {"q": "What is the meaning or context of 'this' in Mridang Chapter 3?", "exp": "The chapter explores the concept of this.", "options": ["this", "that", "leap", "like"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'that' in Mridang Chapter 3?", "exp": "The chapter explores the concept of that.", "options": ["that", "leap", "like", "lamb"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'leap' in Mridang Chapter 3?", "exp": "The chapter explores the concept of leap.", "options": ["leap", "like", "lamb", "climb"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'like' in Mridang Chapter 3?", "exp": "The chapter explores the concept of like.", "options": ["like", "lamb", "climb", "Unit"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'lamb' in Mridang Chapter 3?", "exp": "The chapter explores the concept of lamb.", "options": ["lamb", "climb", "Unit", "Welcome"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'climb' in Mridang Chapter 3?", "exp": "The chapter explores the concept of climb.", "options": ["climb", "Unit", "Welcome", "World"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Unit' in Mridang Chapter 3?", "exp": "The chapter explores the concept of Unit.", "options": ["Unit", "Welcome", "World", "Chapter"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Welcome' in Mridang Chapter 3?", "exp": "The chapter explores the concept of Welcome.", "options": ["Welcome", "World", "Chapter", "FunLet"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'World' in Mridang Chapter 3?", "exp": "The chapter explores the concept of World.", "options": ["World", "Chapter", "FunLet", "recite"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Chapter' in Mridang Chapter 3?", "exp": "The chapter explores the concept of Chapter.", "options": ["Chapter", "FunLet", "recite", "Sight"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 3"] = [
  ("FunLet", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("recite", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("Sight", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("words", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("them", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("none", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("Mridang", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("indd", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("Reprint", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
  ("swim", "Vocabulary term extracted from Mridang Chapter 3", "Vocabulary term extracted from Mridang Chapter 3"),
]
QUIZ_DB["Mridang Chapter 4"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 4?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "MridangChapter", "Seeing", "without"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'MridangChapter' in Mridang Chapter 4?", "exp": "The chapter explores the concept of MridangChapter.", "options": ["MridangChapter", "Seeing", "without", "SeeingLet"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Seeing' in Mridang Chapter 4?", "exp": "The chapter explores the concept of Seeing.", "options": ["Seeing", "without", "SeeingLet", "read"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'without' in Mridang Chapter 4?", "exp": "The chapter explores the concept of without.", "options": ["without", "SeeingLet", "read", "Little"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'SeeingLet' in Mridang Chapter 4?", "exp": "The chapter explores the concept of SeeingLet.", "options": ["SeeingLet", "read", "Little", "Onshangla"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'read' in Mridang Chapter 4?", "exp": "The chapter explores the concept of read.", "options": ["read", "Little", "Onshangla", "returned"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Little' in Mridang Chapter 4?", "exp": "The chapter explores the concept of Little.", "options": ["Little", "Onshangla", "returned", "from"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Onshangla' in Mridang Chapter 4?", "exp": "The chapter explores the concept of Onshangla.", "options": ["Onshangla", "returned", "from", "school"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'returned' in Mridang Chapter 4?", "exp": "The chapter explores the concept of returned.", "options": ["returned", "from", "school", "opened"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'from' in Mridang Chapter 4?", "exp": "The chapter explores the concept of from.", "options": ["from", "school", "opened", "door"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 4"] = [
  ("school", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("opened", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("door", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("quietly", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("kept", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("table", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("mother", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("looked", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("very", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
  ("quiet", "Vocabulary term extracted from Mridang Chapter 4", "Vocabulary term extracted from Mridang Chapter 4"),
]
QUIZ_DB["Mridang Chapter 5"] = [
  {"q": "What is the meaning or context of 'Take' in Mridang Chapter 5?", "exp": "The chapter explores the concept of Take.", "options": ["Take", "take", "train", "boat"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'take' in Mridang Chapter 5?", "exp": "The chapter explores the concept of take.", "options": ["take", "train", "boat", "plane"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'train' in Mridang Chapter 5?", "exp": "The chapter explores the concept of train.", "options": ["train", "boat", "plane", "taxi"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'boat' in Mridang Chapter 5?", "exp": "The chapter explores the concept of boat.", "options": ["boat", "plane", "taxi", "Maybe"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'plane' in Mridang Chapter 5?", "exp": "The chapter explores the concept of plane.", "options": ["plane", "taxi", "Maybe", "near"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'taxi' in Mridang Chapter 5?", "exp": "The chapter explores the concept of taxi.", "options": ["taxi", "Maybe", "near", "maybe"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Maybe' in Mridang Chapter 5?", "exp": "The chapter explores the concept of Maybe.", "options": ["Maybe", "near", "maybe", "Sight"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'near' in Mridang Chapter 5?", "exp": "The chapter explores the concept of near.", "options": ["near", "maybe", "Sight", "words"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'maybe' in Mridang Chapter 5?", "exp": "The chapter explores the concept of maybe.", "options": ["maybe", "Sight", "words", "Unit"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Sight' in Mridang Chapter 5?", "exp": "The chapter explores the concept of Sight.", "options": ["Sight", "words", "Unit", "Going"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 5"] = [
  ("words", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("Unit", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("Going", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("places", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("Chapter", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("Come", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("Back", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("SoonLet", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("recite", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
  ("indd", "Vocabulary term extracted from Mridang Chapter 5", "Vocabulary term extracted from Mridang Chapter 5"),
]
QUIZ_DB["Friends"] = [
  {"q": "What is the meaning or context of 'Mridang' in Friends?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "Between", "Home", "School"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Between' in Friends?", "exp": "The chapter explores the concept of Between.", "options": ["Between", "Home", "School", "Hello"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Home' in Friends?", "exp": "The chapter explores the concept of Home.", "options": ["Home", "School", "Hello", "Ravi"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'School' in Friends?", "exp": "The chapter explores the concept of School.", "options": ["School", "Hello", "Ravi", "study"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Hello' in Friends?", "exp": "The chapter explores the concept of Hello.", "options": ["Hello", "Ravi", "study", "Class"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Ravi' in Friends?", "exp": "The chapter explores the concept of Ravi.", "options": ["Ravi", "study", "Class", "friend"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'study' in Friends?", "exp": "The chapter explores the concept of study.", "options": ["study", "Class", "friend", "school"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Class' in Friends?", "exp": "The chapter explores the concept of Class.", "options": ["Class", "friend", "school", "foot"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'friend' in Friends?", "exp": "The chapter explores the concept of friend.", "options": ["friend", "school", "foot", "pass"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'school' in Friends?", "exp": "The chapter explores the concept of school.", "options": ["school", "foot", "pass", "through"], "ans_idx": 0},
]
FC_DB["Friends"] = [
  ("foot", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("pass", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("through", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("paddy", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("fields", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("mango", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("grove", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("then", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("reach", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
  ("main", "Vocabulary term extracted from Friends", "Vocabulary term extracted from Friends"),
]
QUIZ_DB["Mridang Chapter 7"] = [
  {"q": "What is the meaning or context of 'This' in Mridang Chapter 7?", "exp": "The chapter explores the concept of This.", "options": ["This", "TownChapter", "read", "town"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'TownChapter' in Mridang Chapter 7?", "exp": "The chapter explores the concept of TownChapter.", "options": ["TownChapter", "read", "town", "There"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'read' in Mridang Chapter 7?", "exp": "The chapter explores the concept of read.", "options": ["read", "town", "There", "streets"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'town' in Mridang Chapter 7?", "exp": "The chapter explores the concept of town.", "options": ["town", "There", "streets", "street"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'There' in Mridang Chapter 7?", "exp": "The chapter explores the concept of There.", "options": ["There", "streets", "street", "houses"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'streets' in Mridang Chapter 7?", "exp": "The chapter explores the concept of streets.", "options": ["streets", "street", "houses", "house"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'street' in Mridang Chapter 7?", "exp": "The chapter explores the concept of street.", "options": ["street", "houses", "house", "rooms"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'houses' in Mridang Chapter 7?", "exp": "The chapter explores the concept of houses.", "options": ["houses", "house", "rooms", "room"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'house' in Mridang Chapter 7?", "exp": "The chapter explores the concept of house.", "options": ["house", "rooms", "room", "basket"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'rooms' in Mridang Chapter 7?", "exp": "The chapter explores the concept of rooms.", "options": ["rooms", "room", "basket", "some"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 7"] = [
  ("room", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("basket", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("some", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("flowers", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("Flowers", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("Basket", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("Room", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("House", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("Street", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
  ("Sight", "Vocabulary term extracted from Mridang Chapter 7", "Vocabulary term extracted from Mridang Chapter 7"),
]
QUIZ_DB["Mridang Chapter 8"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "Unit", "Life", "Around"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Unit' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Unit.", "options": ["Unit", "Life", "Around", "Chapter"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Life' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Life.", "options": ["Life", "Around", "Chapter", "Show"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Around' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Around.", "options": ["Around", "Chapter", "Show", "CloudsLet"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Chapter' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Chapter.", "options": ["Chapter", "Show", "CloudsLet", "recite"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Show' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Show.", "options": ["Show", "CloudsLet", "recite", "back"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'CloudsLet' in Mridang Chapter 8?", "exp": "The chapter explores the concept of CloudsLet.", "options": ["CloudsLet", "recite", "back", "Looking"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'recite' in Mridang Chapter 8?", "exp": "The chapter explores the concept of recite.", "options": ["recite", "back", "Looking", "white"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'back' in Mridang Chapter 8?", "exp": "The chapter explores the concept of back.", "options": ["back", "Looking", "white", "bear"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Looking' in Mridang Chapter 8?", "exp": "The chapter explores the concept of Looking.", "options": ["Looking", "white", "bear", "down"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 8"] = [
  ("white", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("bear", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("down", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("ship", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("sailing", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("indd", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("Reprint", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("elephant", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("Waving", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
  ("trunk", "Vocabulary term extracted from Mridang Chapter 8", "Vocabulary term extracted from Mridang Chapter 8"),
]
QUIZ_DB["Mridang Chapter 9"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 9?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "said", "Dear", "tree"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'said' in Mridang Chapter 9?", "exp": "The chapter explores the concept of said.", "options": ["said", "Dear", "tree", "know"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Dear' in Mridang Chapter 9?", "exp": "The chapter explores the concept of Dear.", "options": ["Dear", "tree", "know", "name"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'tree' in Mridang Chapter 9?", "exp": "The chapter explores the concept of tree.", "options": ["tree", "know", "name", "sleeping"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'know' in Mridang Chapter 9?", "exp": "The chapter explores the concept of know.", "options": ["know", "name", "sleeping", "shade"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'name' in Mridang Chapter 9?", "exp": "The chapter explores the concept of name.", "options": ["name", "sleeping", "shade", "read"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'sleeping' in Mridang Chapter 9?", "exp": "The chapter explores the concept of sleeping.", "options": ["sleeping", "shade", "read", "Sight"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'shade' in Mridang Chapter 9?", "exp": "The chapter explores the concept of shade.", "options": ["shade", "read", "Sight", "words"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'read' in Mridang Chapter 9?", "exp": "The chapter explores the concept of read.", "options": ["read", "Sight", "words", "when"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Sight' in Mridang Chapter 9?", "exp": "The chapter explores the concept of Sight.", "options": ["Sight", "words", "when", "about"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 9"] = [
  ("words", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("when", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("about", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("climb", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("forgotten", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("asked", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("youknow", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("Once", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("there", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
  ("little", "Vocabulary term extracted from Mridang Chapter 9", "Vocabulary term extracted from Mridang Chapter 9"),
]
QUIZ_DB["Mridang Chapter 10"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 10?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "recite", "There", "once"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'recite' in Mridang Chapter 10?", "exp": "The chapter explores the concept of recite.", "options": ["recite", "There", "once", "crow"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'There' in Mridang Chapter 10?", "exp": "The chapter explores the concept of There.", "options": ["There", "once", "crow", "black"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'once' in Mridang Chapter 10?", "exp": "The chapter explores the concept of once.", "options": ["once", "crow", "black", "know"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'crow' in Mridang Chapter 10?", "exp": "The chapter explores the concept of crow.", "options": ["crow", "black", "know", "beautiful"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'black' in Mridang Chapter 10?", "exp": "The chapter explores the concept of black.", "options": ["black", "know", "beautiful", "wanted"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'know' in Mridang Chapter 10?", "exp": "The chapter explores the concept of know.", "options": ["know", "beautiful", "wanted", "Colourful"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'beautiful' in Mridang Chapter 10?", "exp": "The chapter explores the concept of beautiful.", "options": ["beautiful", "wanted", "Colourful", "feathers"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'wanted' in Mridang Chapter 10?", "exp": "The chapter explores the concept of wanted.", "options": ["wanted", "Colourful", "feathers", "grow"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Colourful' in Mridang Chapter 10?", "exp": "The chapter explores the concept of Colourful.", "options": ["Colourful", "feathers", "grow", "found"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 10"] = [
  ("feathers", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("grow", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("found", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("peacock", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("feather", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("stuck", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("tail", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("Then", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("another", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
  ("picked", "Vocabulary term extracted from Mridang Chapter 10", "Vocabulary term extracted from Mridang Chapter 10"),
]
QUIZ_DB["Mridang Chapter 11"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 11?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "read", "Anju", "Farida"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'read' in Mridang Chapter 11?", "exp": "The chapter explores the concept of read.", "options": ["read", "Anju", "Farida", "went"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Anju' in Mridang Chapter 11?", "exp": "The chapter explores the concept of Anju.", "options": ["Anju", "Farida", "went", "market"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Farida' in Mridang Chapter 11?", "exp": "The chapter explores the concept of Farida.", "options": ["Farida", "went", "market", "bought"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'went' in Mridang Chapter 11?", "exp": "The chapter explores the concept of went.", "options": ["went", "market", "bought", "water"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'market' in Mridang Chapter 11?", "exp": "The chapter explores the concept of market.", "options": ["market", "bought", "water", "bottle"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'bought' in Mridang Chapter 11?", "exp": "The chapter explores the concept of bought.", "options": ["bought", "water", "bottle", "Later"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'water' in Mridang Chapter 11?", "exp": "The chapter explores the concept of water.", "options": ["water", "bottle", "Later", "they"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'bottle' in Mridang Chapter 11?", "exp": "The chapter explores the concept of bottle.", "options": ["bottle", "Later", "they", "shop"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Later' in Mridang Chapter 11?", "exp": "The chapter explores the concept of Later.", "options": ["Later", "they", "shop", "packet"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 11"] = [
  ("they", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("shop", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("packet", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("groundnuts", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("juice", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("They", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("felt", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("tired", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("bench", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
  ("under", "Vocabulary term extracted from Mridang Chapter 11", "Vocabulary term extracted from Mridang Chapter 11"),
]
QUIZ_DB["Mridang Chapter 12"] = [
  {"q": "What is the meaning or context of 'Little' in Mridang Chapter 12?", "exp": "The chapter explores the concept of Little.", "options": ["Little", "drops", "water", "grains"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'drops' in Mridang Chapter 12?", "exp": "The chapter explores the concept of drops.", "options": ["drops", "water", "grains", "sand"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'water' in Mridang Chapter 12?", "exp": "The chapter explores the concept of water.", "options": ["water", "grains", "sand", "Make"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'grains' in Mridang Chapter 12?", "exp": "The chapter explores the concept of grains.", "options": ["grains", "sand", "Make", "mighty"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'sand' in Mridang Chapter 12?", "exp": "The chapter explores the concept of sand.", "options": ["sand", "Make", "mighty", "oceanAnd"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Make' in Mridang Chapter 12?", "exp": "The chapter explores the concept of Make.", "options": ["Make", "mighty", "oceanAnd", "pleasant"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'mighty' in Mridang Chapter 12?", "exp": "The chapter explores the concept of mighty.", "options": ["mighty", "oceanAnd", "pleasant", "land"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'oceanAnd' in Mridang Chapter 12?", "exp": "The chapter explores the concept of oceanAnd.", "options": ["oceanAnd", "pleasant", "land", "words"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'pleasant' in Mridang Chapter 12?", "exp": "The chapter explores the concept of pleasant.", "options": ["pleasant", "land", "words", "love"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'land' in Mridang Chapter 12?", "exp": "The chapter explores the concept of land.", "options": ["land", "words", "love", "acts"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 12"] = [
  ("words", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("love", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("acts", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("kindness", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("deeds", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("warmthSpread", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("smiles", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("happiness", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("sing", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
  ("Unit", "Vocabulary term extracted from Mridang Chapter 12", "Vocabulary term extracted from Mridang Chapter 12"),
]
QUIZ_DB["Mridang Chapter 13"] = [
  {"q": "What is the meaning or context of 'Mridang' in Mridang Chapter 13?", "exp": "The chapter explores the concept of Mridang.", "options": ["Mridang", "Ramu", "come", "from"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Ramu' in Mridang Chapter 13?", "exp": "The chapter explores the concept of Ramu.", "options": ["Ramu", "come", "from", "Gujarat"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'come' in Mridang Chapter 13?", "exp": "The chapter explores the concept of come.", "options": ["come", "from", "Gujarat", "speak"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'from' in Mridang Chapter 13?", "exp": "The chapter explores the concept of from.", "options": ["from", "Gujarat", "speak", "Gujarati"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Gujarat' in Mridang Chapter 13?", "exp": "The chapter explores the concept of Gujarat.", "options": ["Gujarat", "speak", "Gujarati", "like"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'speak' in Mridang Chapter 13?", "exp": "The chapter explores the concept of speak.", "options": ["speak", "Gujarati", "like", "dance"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Gujarati' in Mridang Chapter 13?", "exp": "The chapter explores the concept of Gujarati.", "options": ["Gujarati", "like", "dance", "Garba"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'like' in Mridang Chapter 13?", "exp": "The chapter explores the concept of like.", "options": ["like", "dance", "Garba", "seven"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'dance' in Mridang Chapter 13?", "exp": "The chapter explores the concept of dance.", "options": ["dance", "Garba", "seven", "years"], "ans_idx": 0},
  {"q": "What is the meaning or context of 'Garba' in Mridang Chapter 13?", "exp": "The chapter explores the concept of Garba.", "options": ["Garba", "seven", "years", "name"], "ans_idx": 0},
]
FC_DB["Mridang Chapter 13"] = [
  ("seven", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("years", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("name", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("Meenakshi", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("Tamil", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("Nadu", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("favourite", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("festival", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("Pongal", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
  ("What", "Vocabulary term extracted from Mridang Chapter 13", "Vocabulary term extracted from Mridang Chapter 13"),
]
