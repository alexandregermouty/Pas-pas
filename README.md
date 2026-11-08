# Pas à pas · v4.0

Lan Anh's French-learning app: from B1 to B2 to C1, with practice for the DELF B1, DELF B2 and DALF C1 exams, companion lessons for her two class books, and natural recorded French voices.

**Live app:** https://alexandregermouty.github.io/Pas-pas/

It is built like *Ôn tiếng Việt*: one installable web app (PWA), no build step on GitHub Pages, progress stored on the phone. Lessons are written in French; every rule and every answer comes with a detailed explanation in English.

## Install it on the iPhone

1. Open **https://alexandregermouty.github.io/Pas-pas/** in **Safari** (not Chrome: only Safari can add a web app to the Home Screen on iOS).
2. Tap **Share** (the square with the arrow), scroll down and tap **Add to Home Screen**, then **Add**.
3. Open **Pas à pas** from the Home Screen. It opens full screen, without the Safari bars, like a normal app.
4. On Wi-Fi, go to **Réglages (⚙︎) → Voix → Keep all audio offline**. This downloads every recording (about 70 MB) so lessons play instantly, even in the metro.
5. If there's no sound, check the silent switch on the side of the iPhone and the volume. The 🔊 button at the top turns the app's answer sounds on and off; it does not mute the voice.

On Android: open the link in Chrome, then menu → **Install app**.

Updates arrive by themselves: when a new version is pushed to GitHub, the app picks it up the next time it is opened online.

## What's new in 4.0

- **An explanation in English after every answer.** Right or wrong, each exercise now opens an *Explanation* panel with:
  - what the sentence means, when a translation exists;
  - a grammar breakdown of the right answer (verb, tense, person, auxiliary, agreement) and of her own answer if it was wrong, saying why it does not fit;
  - the part of the lesson that explains the rule behind it, with the whole lesson in English one tap away.
- **Every lesson explained in English, in depth**: a new step, *Explained in English*, goes through each rule point (how it is built, when to use it, how it differs from English, the usual traps). The short English line under each French rule point is now shown by default.
- **English translation of every lesson document** (tap **EN** above the text), and each comprehension answer shows the passage it comes from, in English.
- **Atelier de prononciation**:
  - Every example sentence has a 🎙️ button. Under each word, the sentence shows its phonetic transcription (IPA), with liaisons marked ‿.
  - She listens to the model, records herself, and the phone's speech recognition checks each word (green / orange / red) and gives a score.
  - *Comparer* plays the model, then her recording, and draws both side by side: rhythm (energy) and melody (pitch) on the same time scale.
  - Tips in English explain the French sounds she needs to work on (R, u/ou, nasal vowels, silent letters, liaison, intonation).
  - It is also a new tool in **Pratiquer → Prononciation**, and it replaces the old "speak" exercise in level 4.

## What came in 3.0

- **French first**: lessons, questions, answers, instructions and comprehension quizzes are now in French. English appears only as an optional help line under each rule (**EN** button) and in a few glosses.
- **Fuller lessons**, in seven steps: ① objectifs → ② un document (a dialogue, article or e-mail to read and listen to, with a comprehension quiz) → ③ la règle, with visual aids (colour-coded formulas, tables, timelines, comparisons, arrows) → ④ exemples → ⑤ erreurs fréquentes → ⑥ vocabulaire → ⑦ s'entraîner.
- **Exercises in four levels** per lesson, getting harder each time: *Découvrir* (recognise) → *S'exercer* (fill in, choose) → *Approfondir* (correct, build, transform) → *Produire* (dictation, translation, speaking, and a written task with a model answer and a checklist).
- **Difficulty rises towards C1**: documents grow from about 150 words (B1) to 250 words (C1), written tasks from 80–140 words to 150–300 words.
- About 800 new sentences recorded with the natural voices.
- No more Vietnamese notes.

## What came in 2.0

- **New look**: bleu de France, red and paper white; Fraunces and Be Vietnam Pro typefaces; light and dark themes; a new logo (the Eiffel Tower in front of a red sun, with a tricolour line).
- **Natural French voices**: every sentence in the app is pre-recorded with neural voices instead of the phone's robotic voice (see *Voices* below).
- **Mes cours**: companion lessons for **Cosmopolite 3** and **Objectif Express 2**.
- Clearer screens: a daily plan on *Aujourd'hui*, grouped lists, larger buttons, letter-marked answer options.

## Contents

| | Lessons |
|---|---|
| Parcours B1 → C1 | 48 (B1 17 · B2 16 · C1 15) |
| Cosmopolite 3 (Hachette FLE, B1) | 32: dossiers 1–8, four lessons each |
| Objectif Express 2 (Hachette FLE, French for work B1–B2) | 12: one per unit |

In total: 92 lessons, each with a document and comprehension quiz, a written task with a model answer, 736 flashcards, 832 example sentences and about 3,000 exercise items.

Each lesson opens with its goals and a document to read and hear, then the rule (in French, with an English help line and visual aids), examples, common mistakes and vocabulary. Practice comes in four levels (Découvrir → S'exercer → Approfondir → Produire); the lesson counts as done when all four are done. Flashcards, spaced review, stars and resume work as before.

**Course companions** follow each book's unit: the *tâche* (task), the communication goals, the grammar points and the sound of the lesson, and link to the matching grammar lessons in the main path. Objectif Express lessons add a *Repère professionnel* note on French workplace practice. All sentences and exercises were written for this app; no text, exercise or audio from the books is reproduced, so use the app alongside the books, not instead of them.

### Five tabs

- **Aujourd'hui**: plan du jour (review, one lesson, one practice tool), streak, next lesson in each course, expression of the day.
- **Apprendre**: *Parcours B1 → C1* or *Mes cours*.
- **Pratiquer**: reviews, mistakes notebook, listening, reading, dictation, numbers, conjugation (50 verbs), connectors, register, false friends, idioms, speaking with a timer and recorder.
- **Examen**: DELF B1, DELF B2 and DALF C1 formats, method and mock tasks for all four papers.
- **Moi**: progress by level and course, activity, error profile, "I can…" statements, settings.

## Pronunciation check

The score uses the speech recognition built into the phone (on iPhone, Siri's dictation must be enabled: Settings → General → Keyboard → Enable Dictation). It checks that each word can be understood; it does not grade every detail of the accent, which is why the lab also lets her compare her recording with the model by ear and on the drawing. If recognition is not available (some browsers, or no network), the lab still records and compares, and she rates herself. The phonetic transcriptions were produced with espeak-ng, the same phonemizer used by the Kokoro voice (`ipa.json`).

## Voices

- **Main voice (female)**: *Kokoro* v1.0, French voice `ff_siwis` (Apache 2.0 model).
- **Second voice (male)** for dialogues: *Piper* `fr_FR-upmc-medium`, speaker "pierre" (see the voice's model card on the Piper voices page for its licence).
- Clips are MP3 (32 kbps mono), grouped into one pack per lesson in `audio/`, and indexed in `audio/index.json`. Packs are downloaded when a lesson opens, and cached for offline use.
- Anything not recorded (for example text you type) falls back to the phone's own French voice. On iPhone, download a better one: Settings → Accessibility → Spoken Content → Voices → French (France) → **Audrey (Enhanced)** or **Thomas (Enhanced)**, then pick it in *Réglages → Fallback voice*.
- *Réglages → Voix* switches between *Voix naturelle* and *Voix de l'iPhone*, and sets the speed.

## DELF and DALF

The format tables follow France Éducation international (checked November 2026): [DELF B1](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b1) · [DELF B2](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b2) · [DALF C1](https://www.france-education-international.fr/article/dalf-c1). Each paper is marked out of 25; you need 50/100 overall and at least 5/25 per paper. The checklists in the app are a self-assessment aid, not the official grid; check the exam centre's current rules before booking.

## Progress

Progress is stored on the phone, in the browser. To move it to another device, use **Réglages → Progression → Export / Import**. Removing the Home Screen app deletes its progress, so export first.

## Files

- `index.html`: the whole app (styles, scripts and lessons inlined).
- `sw.js`: offline cache. `manifest.webmanifest`, icons, `fonts/`.
- `ipa.json`: phonetic transcriptions for the pronunciation lab (built by `source/voice/ipa.py`).
- `audio/`: recorded voice packs.
- `source/`: readable sources. Lessons are in `source/data/` (`b1a.js` … `c1b.js`, `cosmo_a.js`, `cosmo_b.js`, `oe.js`, `courses.js`); the v3 documents, French rules, visuals and extra exercises are in `x_*.js`, the French versions of older English strings in `fr_*.js`, and the English explanations (lesson in depth, document translations) in `en_*.js`. Run `python3 build.py` inside `source` to rebuild `index.html`, then bump `CACHE` in `sw.js`.
- `source/voice/`: the scripts used to list every spoken sentence (`collect.*`), record it (`generate.py`) and build the packs (`pack.py`). New sentences without a recording simply use the phone's voice until they are recorded.

## Hosting on GitHub Pages

Repository: `alexandregermouty/Pas-pas`. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. All URLs are relative, so the app works under any project path.
