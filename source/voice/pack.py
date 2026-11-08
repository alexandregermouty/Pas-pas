"""Bundle recorded clips into per-lesson packs: dist/audio/<pack>.bin + dist/audio/index.json
index = {"v": n, "packs": [names], "c": {key: [packIndex, offset, length]}}
Each clip is stored once, in the first pack that uses it."""
import json, os, sys, shutil
ROOT = "/home/claude/pap"
items = json.load(open(f"{ROOT}/tts_items.json"))
out = f"{ROOT}/dist/audio"
shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
packs, order, c = {}, [], {}
missing = 0
for o in items:
    k, p = o["k"], o["p"]
    if k in c or any(k == x[0] for x in packs.get(p, [])): continue
    f = f"{ROOT}/clips/{k}.mp3"
    if not os.path.exists(f): missing += 1; continue
    if p not in packs: packs[p] = []; order.append(p)
    packs[p].append((k, f)); c[k] = None
c = {}
total = 0
for i, p in enumerate(order):
    off = 0
    with open(f"{out}/{p}.bin", "wb") as w:
        for k, f in packs[p]:
            b = open(f, "rb").read(); w.write(b)
            c[k] = [i, off, len(b)]; off += len(b)
    total += off
json.dump({"v": len(c), "packs": order, "c": c}, open(f"{out}/index.json", "w"), separators=(",", ":"))
print(f"{len(c)} clips, {len(order)} packs, {total/1e6:.1f} MB, missing {missing}")
