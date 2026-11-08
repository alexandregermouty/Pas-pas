# Pas à pas · v2.0

Lan Anh's French-learning app: from B1 to B2 to C1, with practice for the DELF B1, DELF B2 and DALF C1 exams, companion lessons for her two class books, and natural recorded French voices.

**Live app:** https://alexandregermouty.github.io/Pas-pas/

It is built like *Ôn tiếng Việt*: one installable web app (PWA), no build step on GitHub Pages, progress stored on the phone. Explanations are in English, and every rule has a short **Cho người Việt** note in Vietnamese.

## Install it on the iPhone

1. Open **https://alexandregermouty.github.io/Pas-pas/** in **Safari** (not Chrome: only Safari can add a web app to the Home Screen on iOS).
2. Tap **Share** (the square with the arrow), scroll down and tap **Add to Home Screen**, then **Add**.
3. Open **Pas à pas** from the Home Screen. It opens full screen, without the Safari bars, like a normal app.
4. On Wi-Fi, go to **Réglages (⚙︎) → Voix → Keep all audio offline**. This downloads every recording (about 50 MB) so lessons play instantly, even in the metro.
5. If there's no sound, check the silent switch on the side of the iPhone and the volume. The 🔊 button at the top turns the app's answer sounds on and off; it does not mute the voice.

On Android: open the link in Chrome, then menu → **Install app**.

Updates arrive by themselves: when a new version is pushed to GitHub, the app picks it up the next time it is opened online.

## What's new in 2.0

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

In total: 92 lessons, 736 flashcards, 832 example sentences and about 1,400 exercise items.

Each lesson opens with the rule, examples to tap and hear, and the Vietnamese note. Then come flashcards and an exercise ladder (recognise → understand → write → use), with spaced review, stars and resume.

**Course companions** follow each book's unit: the *tâche* (task), the communication goals, the grammar points and the sound of the lesson, and link to the matching grammar lessons in the main path. Objectif Express lessons add a *Repère professionnel* note on French workplace practice. All sentences and exercises were written for this app; no text, exercise or audio from the books is reproduced, so use the app alongside the books, not instead of them.

### Five tabs

- **Aujourd'hui**: plan du jour (review, one lesson, one practice tool), streak, next lesson in each course, expression of the day.
- **Apprendre**: *Parcours B1 → C1* or *Mes cours*.
- **Pratiquer**: reviews, mistakes notebook, listening, reading, dictation, numbers, conjugation (50 verbs), connectors, register, false friends, idioms, speaking with a timer and recorder.
- **Examen**: DELF B1, DELF B2 and DALF C1 formats, method and mock tasks for all four papers.
- **Moi**: progress by level and course, activity, error profile, "I can…" statements, settings.

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
- `audio/`: recorded voice packs.
- `source/`: readable sources. Lessons are in `source/data/` (`b1a.js` … `c1b.js`, `cosmo_a.js`, `cosmo_b.js`, `oe.js`, `courses.js`). Run `python3 build.py` inside `source` to rebuild `index.html`, then bump `CACHE` in `sw.js`.
- `source/voice/`: the scripts used to list every spoken sentence (`collect.*`), record it (`generate.py`) and build the packs (`pack.py`). New sentences without a recording simply use the phone's voice until they are recorded.

## Hosting on GitHub Pages

Repository: `alexandregermouty/Pas-pas`. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. All URLs are relative, so the app works under any project path.
