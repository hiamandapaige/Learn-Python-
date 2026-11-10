# horizon.dev · Code Lab

Practice Python and SQL by building five small, real-world projects, right in the browser. No installs, no accounts, nothing to buy.

## The projects

Each project is its own world, with its own look: **Spin Cycle** (a 24-hour laundromat), **Bean Counter** (a coffee shop's back office), **Skywatch** (a night-shift weather station), **Double Take** (a theater box office) and **Paws & Keys** (a vet clinic's records room). The launcher keeps the horizon.dev purple.

| Project | Language | Level | Time | Steps |
|---|---|---|---|---|
| Clean a Messy CSV | Python + pandas | Beginner | ~25 min | 9 |
| Analyze a Sales Database | SQL | Beginner | ~30 min | 8 |
| Pull Data from an API | Python | Intermediate | ~25 min | 7 |
| Find Duplicate Records | Python | Beginner | ~20 min | 7 |
| Build a Relational Database | SQL | Intermediate | ~40 min | 9 |

Every step checks the learner's work and explains what's wrong if it doesn't pass. Each step also has a two-level hint: a nudge first, then the full code.

## Put it online with GitHub Pages (free)

1. Create a new repository on GitHub, for example `hiamanda-dev`.
2. Upload everything in this folder to it. On the repo page, choose **Add file → Upload files**, then drag the folder's contents in. Keep the folder structure.
3. Go to **Settings → Pages**. Under "Build and deployment", set **Source** to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, then click **Save**.
4. After a minute or two, your site is live at `https://YOUR-USERNAME.github.io/hiamanda-dev/`.

You can also double-click `index.html` to open it on your own computer. It still needs an internet connection, because Python and the editor load from free public CDNs.

## Recording setup

- **Main monitor:** `index.html`, the app learners use.
- **Second monitor:** press **Alt + I** in the app, or open `instructor.html` directly. It isn't linked anywhere in the app, so learners won't stumble onto the answer key.
- The Instructor View follows whatever step you're on. Use **← →** to look ahead and **F** to turn following on or off. **A− / A+** changes the text size.
- For each step it shows **What I'm doing**, **Why**, the **code** (with a copy button), a **talk track**, and **what you'll see** when you run it. "Before you start" has the opening talk track and how the project applies to a real job. "Wrap-up" has the closing talk track.
- **Restart** (top right of the workspace) clears a project so you can record it fresh.
- Sound can be muted from the speaker icon on any screen. The ambient hum drops lower inside the workspace so it doesn't compete with your voice.

## Keyboard shortcuts

| Keys | What it does |
|---|---|
| Ctrl/Cmd + Enter | Run your code |
| Esc | Accept the quest card and move it to the corner |
| Alt + I | Open the Instructor View in a new window |

## How it works

- **Python** runs in the browser with [Pyodide](https://pyodide.org) (version pinned in `js/runtime.js`).
- **SQL** runs on SQLite inside that same Python.
- **The editor** is [Monaco](https://microsoft.github.io/monaco-editor/), the editor engine behind VS Code. If it can't load, the app falls back to a simple text editor.
- **The API project** uses the free [Open-Meteo](https://open-meteo.com) weather API, which needs no key. If the network drops mid-recording, it quietly switches to built-in practice data and shows a small "Practice data" tag.
- Progress and code are saved in each learner's browser (localStorage). Nothing is sent anywhere.

## Files

```
index.html         the app: welcome, project picker, workspace
instructor.html    the second-monitor view
css/               styles (base.css holds the colors and fonts)
js/projects.js     every lesson: steps, code, checks and hints  ← edit lessons here
js/talk.js         talk tracks and "how do I know?" explanations  ← edit talk tracks here
js/data.js         the sample files, built into the app
js/python.js       the Python that runs and checks lessons in the browser
js/app.js          screens and interactions
js/worlds.js       each project's world: name, setting, colors, font, editor colors, confetti  ← restyle a project here
js/instructor.js   the Instructor View
js/sound.js        sound effects, generated live (no audio files)
js/art.js          each world's artwork, drawn as SVG
data/              the same sample files, for downloading
```

### Editing a lesson

Talk tracks live in `js/talk.js`. Each step there has `ask` ("We're being asked to…"), `know` (the short "How do I know?" line learners see), `clues`, `terms` and `talk`.

The rest of each lesson is in `js/projects.js`. Each step has a `task` and `why` (the quest card), `doing` and `whyList` (Instructor View bullets), `code`, `talk` (talk track), `see` (what you'll see), `nudge` (first hint), and `check` (a few lines of Python that decide whether the step passed). Change the words freely. If you change a step's `code`, update its `check` to match.
