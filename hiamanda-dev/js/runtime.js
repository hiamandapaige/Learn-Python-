/* HiAmanda.dev — loads Python (Pyodide) and the code editor (Monaco) from free public CDNs,
   and talks to the Python runner in js/python.js. Nothing is installed on the learner's computer. */
(function () {
  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
  const MONACO_URL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";

  let py = null, harness = null, pandasPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  // pyodide.js must load before Monaco's AMD loader, or it registers itself as an AMD module.
  let pyScript = null;
  function pyodideScript() {
    if (!pyScript) pyScript = loadScript(PYODIDE_URL + "pyodide.js");
    return pyScript;
  }

  async function bootPython(onStage) {
    await pyodideScript();
    onStage("python");
    py = await window.loadPyodide({ indexURL: PYODIDE_URL });
    onStage("sqlite");
    await py.loadPackage(["sqlite3"], { messageCallback: () => {} });
    onStage("workspace");
    py.FS.mkdirTree("/hilib");
    py.FS.mkdirTree("/work");
    py.FS.writeFile("/hilib/requests.py", window.PY_SOURCES.requests);
    py.FS.writeFile("/hilib/harness.py", window.PY_SOURCES.harness);
    py.runPython("import sys\nif '/hilib' not in sys.path: sys.path.insert(0, '/hilib')");
    harness = py.pyimport("harness");
  }

  let monacoPromise = null;
  function loadMonaco() {
    if (monacoPromise) return monacoPromise;
    monacoPromise = pyodideScript().then(() => loadScript(MONACO_URL + "/vs/loader.js")).then(() => new Promise((resolve, reject) => {
      const workerSrc = `self.MonacoEnvironment={baseUrl:'${MONACO_URL}/'};importScripts('${MONACO_URL}/vs/base/worker/workerMain.js');`;
      window.MonacoEnvironment = { getWorkerUrl: () => "data:text/javascript;charset=utf-8," + encodeURIComponent(workerSrc) };
      window.require.config({ paths: { vs: MONACO_URL + "/vs" } });
      window.require(["vs/editor/editor.main"], () => resolve(window.monaco), reject);
    }));
    return monacoPromise;
  }

  function filesFor(project) {
    const out = {};
    const dbName = project.db ? project.db.name : null;
    project.files.forEach(n => { if (n !== dbName) out[n] = window.SAMPLE_FILES[n]; });
    if (project.db && project.db.seed) out[project.db.seed] = window.SAMPLE_FILES[project.db.seed];
    return out;
  }

  window.Runtime = {
    loadScript,
    bootPython,
    loadMonaco,
    get ready() { return !!harness; },
    loadPandas() {
      if (!pandasPromise) pandasPromise = py.loadPackage(["pandas"], { messageCallback: () => {} });
      return pandasPromise;
    },
    prepare(project) {
      harness.prepare(project.id, JSON.stringify(filesFor(project)), project.db ? JSON.stringify(project.db) : "");
    },
    run(project, src, checkCode) {
      const json = harness.run(project.id, project.lang, src, project.file,
        project.db ? JSON.stringify(project.db) : "", checkCode || "");
      return JSON.parse(json);
    },
    listFiles(project) { return JSON.parse(harness.list_files(project.id)); },
    readFile(project, name) { return harness.read_file(project.id, name); }
  };
})();
