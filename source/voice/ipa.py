"""Phonetic transcriptions (IPA) for the pronunciation lab.
Reads tts_items.json (every recorded sentence), keeps sentences of up to 25
words, transcribes them with espeak-ng (the same phonemizer the Kokoro voice
uses) and writes dist/ipa.json:
  { "s": { key: [ipa of token 1, ipa of token 2, ...] },   # in context (liaisons)
    "w": { word: ipa } }                                   # each word said alone
key = fnv("f|" + ttsNorm(text)) as stored in tts_items.json ("k")."""
import json, os, re, sys
import espeakng_loader as e
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library(e.get_library_path()); EspeakWrapper.set_data_path(e.get_data_path())
from phonemizer.backend import EspeakBackend
from phonemizer.separator import Separator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
items = json.load(open(os.path.join(ROOT, "tts_items.json")))
WORD = re.compile(r"[A-Za-zÀ-ÿœŒæÆ0-9]")

def toks(t):
    # same rule as the app: whitespace tokens that contain a letter or digit
    return [w for w in t.split() if WORD.search(w)]

def clean(w):
    return re.sub(r"^[^\wÀ-ÿœŒ]+|[^\wÀ-ÿœŒ']+$", "", w.lower().replace("’", "'"))

be = EspeakBackend("fr-fr", preserve_punctuation=False, with_stress=False, language_switch="remove-flags")
sep = Separator(phone="", word=" | ", syllable="")
LIAISON = set("""les des ces mes tes ses nos vos leurs aux un deux trois six dix vingt cent quelques plusieurs certains certaines
quels quelles nous vous ils elles on en dans chez sans sous très plus moins tout quand dont est sont petit petits grand grands
bon bons gros mon ton son aucun comment""".split())
sents = {}
for o in items:
    if o["m"] or not (o["p"].startswith("L-") or o["p"] == "practice"): continue
    tk = toks(o["t"])
    if not tk or len(tk) > 25: continue
    sents[o["k"]] = (o["t"], tk)

keys = list(sents)
ctx = be.phonemize([" ".join(sents[k][1]) for k in keys], separator=sep, strip=True, njobs=2)
words = sorted({clean(w) for k in keys for w in sents[k][1]} - {""})
iso = be.phonemize(words, separator=Separator(phone="", word=" ", syllable=""), strip=True, njobs=2)
W = {w: i.strip() for w, i in zip(words, iso)}
S, bad = {}, 0
for k, c in zip(keys, ctx):
    tk = sents[k][1]
    parts = [p.strip() for p in c.split("|")]
    if len(parts) != len(tk):
        bad += 1
        parts = [W.get(clean(w), "") for w in tk]
    # espeak makes many optional liaisons; keep only the usual ones
    for i, w in enumerate(tk):
        c, iso1 = parts[i], W.get(clean(w), "")
        if c != iso1 and iso1 and c.startswith(iso1) and len(c) == len(iso1) + 1 and c[-1] in "ztnʁp" and clean(w) not in LIAISON:
            parts[i] = iso1
    S[k] = parts
out = os.path.join(ROOT, "dist", "ipa.json")
json.dump({"v": len(S), "s": S, "w": W}, open(out, "w"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(S)} sentences ({bad} without context alignment), {len(W)} words, {os.path.getsize(out) // 1024} KB")
