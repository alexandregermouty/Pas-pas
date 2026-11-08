# Pas à pas

Lan Anh's French-learning app, from B1 to B2 to C1, with practice for the DELF B1, DELF B2 and DALF C1 exams.

**Se sentir chez soi.**

It is built like *Ôn tiếng Việt*: one installable web app (PWA) with no build step on GitHub Pages, progress stored on the phone, and the same lesson ladder, spaced review and back-gesture behaviour. Explanations and glosses are in English, and every rule has a short **Cho người Việt** note in Vietnamese on how French differs from Vietnamese.

## What is in v1.0

### Five tabs

- **Aujourd'hui (Today)** shows one main card (the next lesson, or "Continue" for an unfinished one), a three-step plan for the day (review, one lesson, one practice tool), the exam countdown if a date is set, the streak and an expression of the day. Each plan step ticks itself off.
- **Apprendre (Learn)** shows the lesson path. A switcher moves between B1, B2 and C1, and each level is grouped into tracks.
- **Pratiquer (Practice)** has the review tools first (due cards, lesson review, weak cards, mistake notebook), then listening and reading, grammar and vocabulary, and speaking and writing. A "Suggestion du jour" card rotates through the tools.
- **Examen (DELF · DALF)** shows the official format of each exam, method tips for each paper, and mock tasks for all four papers.
- **Moi (Me)** shows progress by level, a twelve-week activity grid, the error profile for the last seven days, "I can…" statements, a report for a teacher, and settings.

### 48 lessons

| Level | Lessons | Tracks |
|---|---|---|
| B1 | 17 | Raconter · Construire la phrase · Projeter et supposer · Donner son avis · Relier les idées · Écrire et parler mieux |
| B2 | 16 | Argumenter · Maîtriser les temps · Phrases complexes · Relier les idées · Nuancer |
| C1 | 15 | L'écrit soutenu · Penser en français · Nuancer · Méthode DALF |

Each lesson opens with the rule: a headline, the key points, examples you tap to hear, an "Attention" contrast and the Vietnamese note. Then come flashcards and an exercise ladder of about 22 questions in four stages:

1. **Discover**: recognise, listen and match.
2. **Understand**: recall, choose the correct sentence, grammar choice and short dialogue replies.
3. **Write**: fill the gap, find the mistake, build the sentence and transform it.
4. **Use**: dictation, translation into French and speaking. Speech recognition is used where the browser supports it.

Mistakes come back once at the end of the lesson. Lessons earn up to three stars, return for review on a growing interval (2, 5, 12, 30… days), and unlock a Challenge mode. A three-question quick check marks a lesson as known. If you leave a lesson part-way, your place is saved and the lesson shows "▶ 5/22".

In total the lessons contain 384 flashcards, 480 example sentences and about 1,000 exercise items. Each sentence question takes the least-seen item, so repeated runs of a lesson use different sentences.

### Practice tools

- **Listening**: 9 recordings (voicemail, conversations, radio, interview, debate, lecture, news flashes) read by the phone's French voice, with questions and a transcript.
- **Reading**: 9 texts (adverts, articles, a letter, a forum post, opinion pieces, C1 texts of ideas), with questions and vocabulary help.
- **Dictation** at your level.
- **Numbers**: prices, times, phone numbers and years, heard and typed.
- **Conjugation**: a ten-verb sprint in the tenses of your level, from the présent up to the passé simple. It covers 50 verbs, and there are verb tables for every tense.
- **Connectors**: 54 connectors, drilled by function and in context.
- **Register**: familier, courant and soutenu.
- **False friends**: actuellement, éventuellement, librairie…
- **Expressions**: 40 idioms graded by level.
- **Speak for a minute**: topics by level, with a timer, a recording kept on the phone and a self-check list.

### DELF and DALF

The format tables follow France Éducation international. These pages were checked in November 2026:

- [DELF B1 tout public](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b1)
- [DELF B2 tout public](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b2)
- [DALF C1](https://www.france-education-international.fr/article/dalf-c1)

| | DELF B1 | DELF B2 | DALF C1 |
|---|---|---|---|
| Listening | ≈ 25 min | ≈ 30 min | ≈ 40 min |
| Reading | 45 min | 1 h | 50 min |
| Writing | 45 min, 160 words min | 1 h, 250 words min | 2 h 30: synthèse 220–240 words + essai 250 words min |
| Speaking | ≈ 15 min (10 min prep for part 3) | 20 min (30 min prep) | 30 min (1 h prep) |

Each paper is marked out of 25. To pass you need 50/100 overall, with at least 5/25 in every paper.

The mock tasks work as follows:

- **Listening** follows the exam rules: you get two plays at B1 and B2, and for the C1 news flashes only one. The transcript appears after you correct your answers.
- **Reading** has a suggested timer and a score.
- **Writing** has the exam timer, a word counter, a suggested plan, useful phrases and a checklist based on the exam criteria. Drafts save automatically.
- **Speaking**: at B1 there is the guided interview (the examiner asks random questions aloud), five role-plays and four point-of-view documents. At B2 there are four documents for the monologue and debate, with the examiner's challenges read aloud. At C1 there are three dossiers for the exposé, each with a possible problématique and plan and the jury's questions.

France Éducation international is rolling out new evaluation grids for the DELF production papers. Before booking, check the exam centre's current rules. The checklists in the app are a self-assessment aid, not the official grid.

## About the content

All rules, sentences, dialogues, texts and exam tasks were written for this app. The exam tasks are modelled on the official task types, and none is copied from an official paper.

The Vietnamese notes are short and simple. If one sounds unnatural, Lan Anh will know better than the app. Please check anything that sounds off with a teacher.

## GitHub Pages deployment

The app is static, so there is no build step on GitHub.

1. Create a repository, for example `alexandregermouty/Pas-a-pas`.
2. Put every file from this folder at its root. The `source` folder is optional, and the app works without it.
3. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Open `https://alexandregermouty.github.io/Pas-a-pas/`.

All URLs are relative, so the app works under any project path.

## Phone installation

- **iPhone / iPad**: open the site in Safari, then **Share → Add to Home Screen**.
- **Android**: open it in Chrome, then use the menu and choose **Install app**.

## Voice and microphone

Audio uses the phone's built-in French voice. Under **Moi → Settings → Voice** you can choose the voice and the speed.

- On iPhone, voices marked "Enhanced" or "Premium" sound much better. Download one under Settings → Accessibility → Spoken Content → Voices → French (France).
- On Android, install Google's French voice in the text-to-speech settings.

Speaking exercises and recordings need microphone permission. Recordings stay in the browser's storage on the phone.

## Progress

Progress is stored in the browser on the phone. To move it to another device, use **Moi → Settings → Export / Import**.

## Editing the content

The `source` folder holds the readable files:

- `data/b1a.js` … `data/c1b.js` hold the lessons.
- `data/texts.js` holds the reading and listening texts.
- `data/exams.js` holds the exam formats and tasks.
- `data/practice.js` holds the connectors, register, false friends, idioms and speaking topics.
- `data/verbs.js` holds the verbs.

After editing, run `python3 build.py` inside `source` to rebuild `index.html`. Then bump the `CACHE` string in `sw.js` so installed copies update.

Illustrations are emoji from the phone's own font. The logo shows a staircase with an accent aigu: *pas à pas*, step by step.
