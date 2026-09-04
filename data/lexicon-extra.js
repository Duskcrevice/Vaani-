/**
 * Extra Vaani AI lexicon (Ol Chiki + Roman + Hindi + English).
 * Merged with js/data.js — duplicates become aliases, new rows are added.
 * Format: [ol, roman|alts, santali-dev, hindi|alts, topic, class, en]
 */
export const EXTRA_WORDS = [
  ["ᱥᱟᱨᱦᱟᱣ", "sarhaw|sarhao|sarhaao", "सारहाव", "धन्यवाद|शुक्रिया", "greetings", 1, "thank you"],
  ["ᱦᱚᱭ", "hoy|hõy|hoi", "होय", "हाँ|जी हाँ", "greetings", 1, "yes"],
  ["ᱵᱮᱥ ᱥᱮᱛᱟᱜ", "bes setak|bes setak'", "बेस सेताक्", "सुप्रभात|शुभ प्रभात", "greetings", 1, "good morning"],
  ["ᱟᱭᱚ", "ayo|yo|enga", "आयो", "माँ|माता", "family", 1, "mother"],
  ["ᱫᱟᱫᱟ", "dada", "दादा", "बड़ा भाई|दादा", "family", 2, "elder brother"],
  ["ᱫᱟᱭ", "dai|day", "दाय", "बड़ी बहन|दीदी", "family", 2, "elder sister"],
  ["ᱨᱚᱝ", "rong|rang", "रोंग", "रंग", "colors", 1, "colour"],
  ["ᱦᱟᱹᱨᱤᱭᱟᱹᱲ", "hariyar|hãriyãṛ|hariar", "हारियाड़", "हरा", "colors", 1, "green"],
  ["ᱥᱟᱥᱟᱝ", "sasang|sasan", "सासाङ", "पीला", "colors", 1, "yellow"],
  ["ᱯᱳᱱ", "pon|pon'|pun", "पोन", "चार|4", "numbers", 1, "four"],
  ["ᱯᱟᱨᱠᱚᱢ", "parkom|parkam", "पारकोम", "खाट|चारपाई|बिस्तर", "house", 2, "cot"],
  ["ᱨᱟᱪᱟ", "raca|racha", "राचा", "आँगन", "house", 2, "courtyard"],
  ["ᱛᱩᱠᱩᱡ", "tukuc|tukuj", "तुकुज", "घड़ा|मटका", "house", 2, "clay pot"],
  ["ᱟᱛᱩ", "atu|ato", "आतु", "गाँव", "house", 1, "village"],
  ["ᱛᱚᱣᱟ", "towa|tooa", "तोवा", "दूध", "food", 1, "milk"],
  ["ᱧᱩᱸ", "nu|ñũ|nyu", "ञुँ", "पीना", "verbs", 1, "drink"],
  ["ᱢᱮᱫ", "met|met'", "मेद्", "आँख", "body", 1, "eye"],
  ["ᱵᱚᱦᱚᱜ", "bohok|bohok'|bohog", "बोहोग्", "सिर", "body", 1, "head"],
  ["ᱢᱩᱸ", "mu|mũ", "मुँ", "नाक", "body", 1, "nose"],
  ["ᱥᱤᱧ ᱪᱟᱸᱫᱚ", "sin cando|siñ cando|singi cando", "सिञ चान्दो", "सूरज", "nature", 1, "sun"],
  ["ᱧᱤᱫᱟᱹ ᱪᱟᱸᱫᱚ", "nida cando|ñidã cando", "निदा चान्दो", "चाँद", "nature", 1, "moon"],
  ["ᱡᱟᱹᱨᱤ", "jari|jãri", "जारी", "बारिश|वर्षा", "weather", 1, "rain"],
  ["ᱪᱮᱞᱟ", "cela|chela", "चेला", "विद्यार्थी|छात्र", "school", 1, "student"],
  ["ᱯᱩᱛᱷᱤ", "puthi|pothi", "पुथी", "किताब|पुस्तक", "school", 1, "book"],
  ["ᱠᱚᱞᱚᱢ", "kolom|kalam", "कोलोम", "कलम|पेन", "school", 1, "pen"],
  ["ᱪᱤᱠᱤ", "ciki|chiki", "चिकी", "अक्षर|लिपि", "school", 1, "letter / script"],
  ["ᱪᱟᱞᱟᱜ", "calak|calak'|chalak", "चालाग्", "जाना|चलना", "verbs", 1, "go"],
  ["ᱧᱩᱨ", "nur|ñur", "ञुर", "दौड़ना", "verbs", 1, "run"],
  ["ᱡᱟᱹᱯᱤᱫ", "japit|jãpit|japid", "जापिद्", "सोना", "verbs", 1, "sleep"],
  ["ᱞᱟᱸᱫᱟ", "landa|landaao", "लांदा", "हँसना", "verbs", 1, "laugh"],
  ["ᱛᱤᱥ", "tis", "तिस्", "कब", "pronouns", 2, "when"],
  ["ᱪᱮᱫ ᱞᱮᱠᱟ", "ced leka|chet leka|ced leka", "चेद् लेका", "कैसे", "pronouns", 2, "how"],
  ["ᱛᱩᱢᱫᱟᱜ", "tumdak|tumdak'", "तुमदाग्", "मांदर|ढोल", "festivals", 3, "drum"],
  ["ᱛᱤᱨᱤᱭᱟᱹ", "tiriya|tiriyã", "तिरिया", "बाँसुरी", "festivals", 3, "flute"],
  ["ᱯᱟᱨᱟᱵ", "parab|porob", "पाराब", "त्योहार|पर्व", "festivals", 2, "festival"],
  ["ᱠᱟᱦᱱᱤ", "kahni|kahani", "काहनी", "कहानी", "school", 3, "story"],
  ["ᱚᱱᱚᱲᱦᱮ", "onorhe|onoṛhe|ononhe", "ओनोढ़े", "कविता", "school", 4, "poem"],
  ["ᱪᱤᱴᱷᱤ", "cithi|ciṭhi", "चिठ्ठी", "चिट्ठी|पत्र", "school", 3, "letter"],
  ["ᱢᱟᱨᱮ", "mare", "मारे", "पुराना", "adjectives", 2, "old"],
  ["ᱱᱟᱣᱟ", "nawa|nawa", "नावा", "नया", "adjectives", 2, "new"],
  ["ᱥᱩᱜᱟᱹᱲ", "sugar|sugãṛ", "सुगाड़", "सुंदर", "adjectives", 2, "beautiful"],
  ["ᱟᱹᱰᱤ", "adi|ãḍi", "आड़ी", "बहुत", "adjectives", 2, "very"],
  ["ᱱᱚᱰᱮ", "node|noḍe|nende", "नोडे", "यहाँ", "pronouns", 1, "here"],
  ["ᱫᱮᱞᱟ", "dela|dela", "देला", "चलो", "greetings", 1, "come on"],
  ["ᱥᱩᱱ", "sun|zero", "सुन", "शून्य|0", "numbers", 1, "zero"],
  ["ᱦᱚᱯᱚᱱ", "hopon", "होपोन", "बेटा|संतान", "family", 3, "son / child"],
  ["ᱠᱷᱮᱛ", "khet", "खेत", "खेत", "nature", 2, "field"],
  ["ᱢᱟᱪᱮᱛ", "macet|machet", "माचेत्", "शिक्षक", "school", 1, "teacher"]
];

export const EXTRA_PHRASES = [
  { sat: ["johar", "ᱡᱚᱦᱟᱨ"], hi: "नमस्ते", en: "Hello", cls: 1, topic: "greetings" },
  { sat: ["bes setak", "bes setak'", "ᱵᱮᱥ ᱥᱮᱛᱟᱜ"], hi: "सुप्रभात", en: "Good morning", cls: 1, topic: "greetings" },
  { sat: ["sarhaw", "ᱥᱟᱨᱦᱟᱣ"], hi: "धन्यवाद", en: "Thank you", cls: 1, topic: "greetings" },
  { sat: ["am ced leka menama", "am ced leka menama?", "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?"], hi: "तुम कैसे हो?", en: "How are you?", cls: 1, topic: "greetings" },
  { sat: ["in bes ge menana", "iñ bes ge menãña", "ᱤᱧ ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ"], hi: "मैं ठीक हूँ", en: "I am fine", cls: 1, topic: "greetings" },
  { sat: ["amak nutum ced", "amak' ñutum ced", "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ"], hi: "तुम्हारा नाम क्या है?", en: "What is your name?", cls: 1, topic: "school" },
  { sat: ["inak nutum ram kana", "iñak' ñutum Ram kana", "ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱨᱟᱢ ᱠᱟᱱᱟ"], hi: "मेरा नाम राम है", en: "My name is Ram", cls: 1, topic: "school" },
  { sat: ["am okare menama", "am okare menama?", "ᱟᱢ ᱚᱠᱟᱨᱮ ᱢᱮᱱᱟᱢᱟ?"], hi: "तुम कहाँ हो?", en: "Where are you?", cls: 2, topic: "house" },
  { sat: ["node hijuk me", "noḍe hijuk' me", "ᱱᱚᱰᱮ ᱦᱤᱡᱩᱜ ᱢᱮ"], hi: "यहाँ आओ", en: "Come here", cls: 1, topic: "verbs" },
  { sat: ["delabon", "dela bon", "ᱫᱮᱞᱟᱵᱚᱱ"], hi: "चलो चलें", en: "Let's go", cls: 1, topic: "greetings" },
  { sat: ["in dak nu edan", "iñ dak' ñũ edañ", "ᱤᱧ ᱫᱟᱜ ᱧᱩᱸ ᱮᱫᱟᱧ"], hi: "मैं पानी पी रहा हूँ", en: "I am drinking water", cls: 1, topic: "water" },
  { sat: ["in daka jom edan", "iñ daka jom edañ", "ᱤᱧ ᱫᱟᱠᱟ ᱡᱚᱢ ᱮᱫᱟᱧ"], hi: "मैं भात खा रहा हूँ", en: "I am eating rice", cls: 1, topic: "food" },
  { sat: ["in iskul calak kanan", "iñ iskul calak' kanañ", "ᱤᱧ ᱤᱥᱠᱩᱞ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟᱧ"], hi: "मैं स्कूल जा रहा हूँ", en: "I am going to school", cls: 1, topic: "school" },
  { sat: ["nuy inak ayo kanay", "nuy iñak' ayo kanay", "ᱱᱩᱭ ᱤᱧᱟᱜ ᱟᱭᱚ ᱠᱟᱱᱟᱭ"], hi: "यह मेरी माँ है", en: "This is my mother", cls: 1, topic: "family" },
  { sat: ["tehen do bes maha kana", "teheñ do bes maha kana", "ᱛᱮᱦᱮᱧ ᱫᱚ ᱵᱮᱥ ᱢᱟᱦᱟ ᱠᱟᱱᱟ"], hi: "आज अच्छा दिन है", en: "Today is a good day", cls: 1, topic: "time" },
  { sat: ["nuy okoy kanay", "nuy okoy kanay?", "ᱱᱩᱭ ᱚᱠᱚᱭ ᱠᱟᱱᱟᱭ?"], hi: "यह कौन है?", en: "Who is this?", cls: 1, topic: "classroom" },
  { sat: ["baha do arag geya", "baha do arak' geya", "ᱵᱟᱦᱟ ᱫᱚ ᱟᱨᱟᱜ ᱜᱮᱭᱟ"], hi: "फूल लाल है", en: "The flower is red", cls: 2, topic: "plants" },
  { sat: ["inak atu adi sugar geya", "iñak' atu ãḍi sugãṛ geya", "ᱤᱧᱟᱜ ᱟᱛᱩ ᱟᱹᱰᱤ ᱥᱩᱜᱟᱹᱲ ᱜᱮᱭᱟ"], hi: "मेरा गाँव बहुत सुंदर है", en: "My village is very beautiful", cls: 2, topic: "house" },
  { sat: ["jari hijuk kana", "jãri hijuk' kana", "ᱡᱟᱹᱨᱤ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ"], hi: "बारिश आ रही है", en: "Rain is coming", cls: 2, topic: "weather" }
];

export const READINGS = [
  {
    id: "c1-story",
    cls: 1,
    hi: "छोटी कहानी",
    sat: "ᱦᱩᱰᱤᱧ ᱠᱟᱦᱱᱤ",
    body: "ᱢᱤᱫ ᱠᱚᱲᱟ ᱟᱛᱩ ᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟᱭ᱾\nmit koṛa atu re tahẽ kanay. — एक लड़का गाँव में रहता था।\n\nᱩᱱᱤ ᱢᱤᱫ ᱦᱩᱰᱤᱧ ᱪᱮᱬᱮ ᱧᱮᱞ ᱠᱮᱫᱟᱭ᱾\nuni mit huḍiñ ceṇe ñel keday. — उसने एक छोटी चिड़िया देखी।\n\nᱪᱮᱬᱮ ᱫᱟᱨᱮ ᱨᱮ ᱫᱩᱲᱩᱵ ᱟᱠᱟᱱᱟ᱾\nceṇe dare re duṛup akana. — चिड़िया पेड़ पर बैठी थी।\n\nᱠᱚᱲᱟ ᱫᱚ ᱞᱟᱸᱫᱟ ᱠᱮᱫᱟᱭ᱾\nkoṛa do landa keday. — लड़का हँस पड़ा।",
    words: ["kora", "atu", "chere", "dare", "landa"]
  },
  {
    id: "c1-poem",
    cls: 1,
    hi: "सुबह की कविता",
    sat: "ᱚᱱᱚᱲᱦᱮ",
    body: "ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱨᱟᱠᱟᱵ ᱮᱱᱟ᱾ — सूरज उग गया।\nᱪᱮᱬᱮ ᱠᱚ ᱥᱮᱨᱮᱧ ᱮᱫᱟ᱾ — चिड़ियाँ गा रही हैं।\nᱵᱟᱦᱟ ᱠᱚ ᱞᱟᱸᱫᱟ ᱮᱫᱟ᱾ — फूल मुस्कुरा रहे हैं।\nᱫᱮᱞᱟ ᱜᱟᱛᱮ, ᱤᱥᱠᱩᱞ ᱪᱟᱞᱟᱜ ᱟᱵᱚᱱ᱾ — चलो दोस्त, स्कूल चलें।",
    words: ["sin cando", "chere", "baha", "iskul", "gate"]
  },
  {
    id: "c2-letter",
    cls: 2,
    hi: "माँ को चिट्ठी",
    sat: "ᱪᱤᱴᱷᱤ ᱚᱞ",
    body: "ᱡᱚᱦᱟᱨ ᱟᱭᱚ,\nप्रिय माँ / Dear mother,\n\nᱤᱧ ᱱᱚᱰᱮ ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ᱾\nमैं यहाँ ठीक हूँ।\n\nᱤᱧ ᱫᱤᱱᱟᱹᱢ ᱤᱥᱠᱩᱞ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟᱧ᱾\nमैं रोज़ स्कूल जाता हूँ।\n\nᱟᱢᱟᱜ ᱦᱚᱯᱚᱱ, ᱨᱟᱢ᱾\nतुम्हारा बेटा, राम।",
    words: ["johar", "ayo", "iskul", "calak", "hopon"]
  }
];
