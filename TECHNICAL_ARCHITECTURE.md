# Vaani AI: Technical Architecture & Implementation Documentation

## 1. What APIs/Models did we use?
- **Translation:** Sarvam AI API for highly contextual English/Hindi translations. We map English/Hindi explicitly into Santali natively using robust localized offline JSON bridges.
- **Speech-to-Text (STT / Voice Input):** Indic Conformer Model seamlessly configured for multi-language speech transcription (Hindi/English).
- **Text-to-Speech (TTS):** Indic Parler-TTS AI Model for converting the text responses natively into natural sounding Indic audio streams.

## 2. What we built ourselves vs APIs
**Built by Us (Zero External APIs):**
- Custom JSON Database Engine (`ncert.js` and `db.json`) containing over 105 perfectly mapped NCERT chapters (maths, english, EVS).
- Flashcard extraction and Quiz generation pipeline.
- The entire `i18n.js` real-time dynamic interface localization routing in English/Hindi/Santali.
- The Progressive Web App (PWA - `sw.js`) Offline Service Worker infrastructure.
- Offline Dictionary Engine and fuzzy search algorithm.

**Handled by APIs:**
- Deep translation arrays mapped out of scope.
- Live streaming voice data parsing.

## 3. How Translation works
When a string needs to be translated natively into Santali, it intercepts through our `js/services/translation.js` pipeline. 
Static Interface text queries our pre-compiled `I18N` offline dictionary. Live text hits our python backend `server.py`, which seamlessly bridges payload to the Sarvam AI endpoints and returns the JSON payload back onto the UI for DOM re-population.

## 4. How Voice Input works
Our core UI injects native Web Speech/Media Recorder configurations in the browser. When a user holds "Mic", WebRTC protocols capture audio and funnel it as a Base64 encoded payload to our Python `transcribe` hook. The backend contacts our configured Indic Conformer model which computes and decodes the audio wave against regional phonetics, returning raw text directly back to the active input fields.

## 5. How TTS works
Generated text triggers our `synthesize()` backend router traversing up to Indic Parler-TTS. It converts the contextual strings into a lossless audio blob, which is relayed cleanly over HTTP and injected directly into the HTML5 `<audio>` container on the device for instant playback.

## 6. Does it require the Internet?
**Yes, for the AI generation models.** Real-time streaming voice interactions, raw translation computing outside our dictionary, and TTS generation require a network bridge to the python backend (`server.py`).

## 7. What works strictly Offline?
- The entire **Progressive Web App (PWA)** shell loads seamlessly offline via our `sw.js` (Service Worker - Cache v14) deployment.
- The entire **Santali Offline Dictionary** module (`#/dictionary`) operates 100% disconnected.
- Offline navigation across the core layout.

## 8. How did we generate/obtain Santhali mapping data?
We cross-compiled the official **JAC (Jharkhand Academic Council) / NCERT** curriculums utilizing high-tier mathematical and grammatical scripts natively mapping out the structure. We explicitly hand-crafted hundreds of flashcards specifically matching the *Joyful Mathematics* (Anandmay Ganit) and *Marigold* datasets into a unified static JSON array for immediate localized execution.

## 9. How Worksheets / Practice work
The practice engine strictly bridges the mock `ncert.js` payload. It maps chapters into interactive isolated UI modules:
- *Flashcards:* An interactive CSS 3D "flip" card module rendering question bounds.
- *Quizzes:* Auto-validating logic loops confirming correct arrays vs distraction arrays (`isCorrect: true`).

## 10. Database and Backend Details
The system utilizes a lightweight **Monolithic Python HTTP Proxy Server** (`server.py`). It contains strictly standard library packages (`base64`, `json`, `urllib`) avoiding heavy frameworks like Django to allow instant Edge deployment on platforms like Vercel. 

Our "database" is entirely client-side optimized (NoSQL No-server). Everything operates beautifully on `localStorage` caches and `.js` JSON module exports (like `ncert.js`), which makes app speed instantaneous without relying on a Postgres or MongoDB instance!

## 11. Any Authentication?
**No Authentication is required.** We designed Vaani AI to be completely frictionless due to the deployment demographic. Tribal students can click the URL and start learning completely anonymously. Local tracking (progress / lesson completion) is maintained perfectly within isolated browser storage variables `localStorage.getItem("vaani_app")`.

## 12. What features have we successfully tested & established?
✅ Complete deployment of the English/Hindi/Santali live global localization toggles.
✅ Perfect Integration of over 100+ native NCERT Class 1-5 syllabus chapters.
✅ Beautiful HTML integration of massive Joyful Mathematics raw curriculum PDF renders.
✅ Cross-browser compatibility for the PWA architecture.
✅ API injection and overriding mechanics natively parsing inputs correctly.

## 13. What is only planned / not perfectly finished yet?
🚧 **Global Voice-to-Voice LLM Tutors:** Giving the user live verbal Santali tutors talking conversationally.
🚧 **True 100% Offline Machine Translation:** Embedding massive WASM (WebAssembly) LLMs directly into the browser to do STT and Translation completely disconnected from our python server.
🚧 **Deep Urdu Translation Scaling:** Extending our `ncert.js` to capture localized Urdu data arrays comprehensively.
