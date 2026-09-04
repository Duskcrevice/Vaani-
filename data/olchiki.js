/** Ol Chiki alphabet for Class 1 script introduction. */
export const OL_LETTERS = [
  { ol: "ᱚ", name: "la", rom: "ɔ", hi: "ऑ / अ" },
  { ol: "ᱛ", name: "at", rom: "t", hi: "त" },
  { ol: "ᱜ", name: "ag", rom: "g", hi: "ग / क्" },
  { ol: "ᱝ", name: "ang", rom: "ng", hi: "ङ" },
  { ol: "ᱞ", name: "al", rom: "l", hi: "ल" },
  { ol: "ᱟ", name: "laa", rom: "a", hi: "आ" },
  { ol: "ᱠ", name: "aak", rom: "k", hi: "क" },
  { ol: "ᱡ", name: "aaj", rom: "j", hi: "ज" },
  { ol: "ᱢ", name: "aam", rom: "m", hi: "म" },
  { ol: "ᱣ", name: "aaw", rom: "w", hi: "व" },
  { ol: "ᱤ", name: "li", rom: "i", hi: "इ" },
  { ol: "ᱥ", name: "is", rom: "s", hi: "स" },
  { ol: "ᱦ", name: "ih", rom: "h", hi: "ह" },
  { ol: "ᱧ", name: "iny", rom: "ñ", hi: "ञ" },
  { ol: "ᱨ", name: "ir", rom: "r", hi: "र" },
  { ol: "ᱩ", name: "lu", rom: "u", hi: "उ" },
  { ol: "ᱪ", name: "uc", rom: "c", hi: "च" },
  { ol: "ᱫ", name: "ud", rom: "d", hi: "द" },
  { ol: "ᱬ", name: "unn", rom: "ṇ", hi: "ण" },
  { ol: "ᱭ", name: "uy", rom: "y", hi: "य" },
  { ol: "ᱮ", name: "le", rom: "e", hi: "ए" },
  { ol: "ᱯ", name: "ep", rom: "p", hi: "प" },
  { ol: "ᱰ", name: "edd", rom: "ḍ", hi: "ड" },
  { ol: "ᱱ", name: "en", rom: "n", hi: "न" },
  { ol: "ᱲ", name: "err", rom: "ṛ", hi: "ड़" },
  { ol: "ᱳ", name: "lo", rom: "o", hi: "ओ" },
  { ol: "ᱴ", name: "ott", rom: "ṭ", hi: "ट" },
  { ol: "ᱵ", name: "ob", rom: "b", hi: "ब" },
  { ol: "ᱶ", name: "ov", rom: "w̃", hi: "वँ" },
  { ol: "ᱷ", name: "oh", rom: "h", hi: "ह (महाप्राण)" }
];

export const OL_MODIFIERS = [
  { ol: "ᱸ", name: "Mu ttuddag", hi: "नासिक्य / ँ" },
  { ol: "ᱹ", name: "Gaahlaa ttuddag", hi: "निम्न स्वर" },
  { ol: "ᱺ", name: "Mu-gaahlaa ttuddag", hi: "नासिक्य + निम्न" },
  { ol: "ᱽ", name: "Ahad", hi: "डिग्लॉटलाइज़र" },
  { ol: "᱾", name: "Mucaad", hi: "पूर्णविराम" },
  { ol: "᱿", name: "Dug mucaad", hi: "अनुच्छेद अंत" }
];

export const OL_INTRO = {
  id: "c1-ol",
  hi: "ओल चिकि लिपि",
  sat: "ᱚᱞ ᱪᱤᱠᱤ",
  body: "ओल चिकि संताली की अपनी वर्णमाला है — पंडित रघुनाथ मुर्मू ने 1925 में बनाई। 30 मूल अक्षर बाएँ से दाएँ लिखे जाते हैं।\n\nचिह्न: ᱸ नासिक्य (ँ), ᱹ निम्न स्वर, ᱽ Ahad, ᱾ पूर्णविराम, ᱿ अनुच्छेद अंत।\nअंक: ᱐ सुन, ᱑ मिद्, ᱒ बार, ᱓ पे, ᱔ पोन, ᱕ मोंड़े, ᱖ तुरुय, ᱗ एयाय, ᱘ इराल, ᱙ आरे।",
  words: ["ol chiki"],
  letters: true,
  example: { ol: "ᱡᱚᱦᱟᱨ", rom: "johar", hi: "नमस्ते" }
};
