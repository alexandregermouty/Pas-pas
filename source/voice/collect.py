import asyncio, json, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = await b.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file:///home/claude/pap/dist/index.html"); await pg.wait_for_timeout(600)
        r = await pg.evaluate(open("/home/claude/pap/tools/collect.js").read())
        json.dump(r, open("/home/claude/pap/tts_items.json","w"), ensure_ascii=False)
        packs = {}
        for o in r: packs[o["p"]] = packs.get(o["p"],0)+1
        print(len(r), "items,", sum(len(o["t"]) for o in r), "chars,", len(packs), "packs, male:", sum(o["m"] for o in r), errs or "")
        await b.close()
asyncio.run(main())
