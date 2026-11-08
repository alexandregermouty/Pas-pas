"""Incremental TTS: Kokoro ff_siwis (female, main) and Piper UPMC Pierre (male). One MP3 per clip in clips/<key>.mp3."""
import json, os, re, subprocess, sys, time, numpy as np
ROOT = "/home/claude/pap"; CL = ROOT + "/clips"; TT = "/home/claude/tts"
items = json.load(open(sys.argv[1] if len(sys.argv) > 1 else ROOT + "/tts_items.json"))
todo = [o for o in items if not os.path.exists(f"{CL}/{o['k']}.mp3")]
order = lambda o: (0 if o["p"].startswith("L-b1") else 1 if o["p"].startswith("C-") or o["p"].startswith("L-co") or o["p"].startswith("L-oe") else 2 if o["p"].startswith("L-b2") else 3 if o["p"].startswith("L-c1") else 4)
todo.sort(key=order)
print(f"{len(todo)} clips to record ({len(items) - len(todo)} already done)", flush=True)
ROMAN = {"XVe": "quinzième", "XVIe": "seizième", "XVIIe": "dix-septième", "XVIIIe": "dix-huitième", "XIXe": "dix-neuvième", "XXe": "vingtième", "XXIe": "vingt-et-unième"}
def prep(t):
    t = t.replace("«", "").replace("»", "").replace("’", "'")
    for k, v in ROMAN.items(): t = re.sub(r"\b" + k + r"\b", v, t)
    t = re.sub(r"(\d+) ?h (\d{2})\b", r"\1 heures \2", t); t = re.sub(r"(\d+) ?h\b", r"\1 heures", t)
    t = re.sub(r"(\d+(?:[ ,]\d+)*) ?€", r"\1 euros", t)
    t = re.sub(r"\bl'IA\b", "l'I.A.", t); t = re.sub(r"\bIA\b", "I.A.", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t
kok = None; pip = None
def female(text):
    global kok
    if kok is None:
        from kokoro_onnx import Kokoro
        kok = Kokoro(f"{TT}/kokoro-v1.0.onnx", f"{TT}/voices-v1.0.bin")
    a, sr = kok.create(text, voice="ff_siwis", speed=0.92, lang="fr-fr")
    return a, sr
def male(text):
    global pip
    from piper.config import SynthesisConfig
    if pip is None:
        from piper import PiperVoice
        pip = PiperVoice.load(f"{TT}/vits-piper-fr_FR-upmc-medium/fr_FR-upmc-medium.onnx")
    ch = [c.audio_int16_array for c in pip.synthesize(text, syn_config=SynthesisConfig(speaker_id=1, length_scale=1.08))]
    return np.concatenate(ch).astype(np.float32) / 32768, 22050
def encode(a, sr, path):
    pad = np.zeros(int(sr * 0.06), dtype=np.float32)
    a = np.concatenate([pad, a.astype(np.float32), pad])
    peak = float(np.max(np.abs(a))) or 1.0
    a = a / peak * 0.89
    pcm = (np.clip(a, -1, 1) * 32767).astype("<i2").tobytes()
    tmp = path + ".tmp.mp3"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", "-", "-ar", "24000", "-ac", "1", "-b:a", "32k", tmp], input=pcm, check=True)
    os.replace(tmp, path)
t0 = time.time()
for i, o in enumerate(todo):
    try:
        text = prep(o["t"])
        a, sr = (male if o["m"] else female)(text)
        encode(a, sr, f"{CL}/{o['k']}.mp3")
    except Exception as e:
        print("FAIL", o["k"], o["t"][:60], repr(e), flush=True)
    if i % 25 == 0:
        el = time.time() - t0; rate = (i + 1) / el if el else 0
        print(f"{i+1}/{len(todo)}  {el/60:.1f} min  eta {((len(todo)-i-1)/rate/60) if rate else 0:.0f} min", flush=True)
print("DONE", len(todo), f"{(time.time()-t0)/60:.1f} min", flush=True)
