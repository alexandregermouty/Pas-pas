"""Build index.html from the source files. Run: python3 build.py (from the source folder)."""
import base64, os, glob
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = HERE if os.path.exists(os.path.join(HERE, "core.js")) else os.path.join(HERE, "..", "src")
OUT = os.path.join(SRC, "..") if os.path.exists(os.path.join(HERE, "core.js")) else os.path.join(HERE, "..", "dist")
order = ["core.js", "data/levels.js", "data/verbs.js", "data/practice.js"] + \
    sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, "data", "b1*.js"))) + \
    sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, "data", "b2*.js"))) + \
    sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, "data", "c1*.js"))) + \
    sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, "data", "cosmo*.js"))) + \
    sorted(os.path.relpath(p, SRC) for p in glob.glob(os.path.join(SRC, "data", "oe*.js"))) + ["data/courses.js"] + \
    ["data/texts.js", "data/exams.js", "engine.js", "views.js", "tools.js", "exam.js", "main.js"]
js = []
for f in order:
    p = os.path.join(SRC, f)
    js.append("/* ── " + f + " ── */\n" + open(p, encoding="utf8").read())
css = open(os.path.join(SRC, "app.css"), encoding="utf8").read()
logo_path = os.path.join(OUT, "logo-128.png")
logo = "data:image/png;base64," + base64.b64encode(open(logo_path, "rb").read()).decode()
html = open(os.path.join(SRC, "shell.html"), encoding="utf8").read()
html = html.replace("/*CSS*/", css).replace("/*JS*/", "\n".join(js)).replace("/*LOGO*/", logo)
open(os.path.join(OUT, "index.html"), "w", encoding="utf8").write(html)
open(os.path.join(HERE, "app.bundle.js"), "w", encoding="utf8").write("\n".join(js))
print("built", len(html) // 1024, "KB ->", os.path.normpath(os.path.join(OUT, "index.html")))
