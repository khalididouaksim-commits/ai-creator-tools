const app = document.getElementById("app");

/* ===================== */
/* ROUTER */
/* ===================== */

function loadTool(tool) {
  
  if (tool === "home") {
    app.innerHTML = `
      <h1>Welcome to AI Studio</h1>
      <p>Select a tool from sidebar</p>
    `;
  }
  
  if (tool === "script") {
    app.innerHTML = `
      <h1>Script Generator</h1>

      <select id="category">
        <option>Horror</option>
        <option>Mystery</option>
        <option>History</option>
        <option>Other</option>
      </select>

      <textarea id="desc" placeholder="Write your idea"></textarea>

      <button onclick="generateScript()">Generate</button>

      <pre id="result"></pre>
    `;
  }
  
  if (tool === "hook") {
    app.innerHTML = `
      <h1>Hook Generator</h1>

      <textarea id="desc" placeholder="Write idea"></textarea>

      <button onclick="generateHook()">Generate</button>

      <pre id="result"></pre>
    `;
  }
  
  if (tool === "thumbnail") {
    app.innerHTML = `
      <h1>Thumbnail Generator</h1>

      <textarea id="desc" placeholder="Video topic"></textarea>

      <button onclick="generateThumbnail()">Generate</button>

      <pre id="result"></pre>
    `;
  }
}

/* ===================== */
/* SCRIPT */
/* ===================== */

function generateScript() {
  
  const cat = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;
  
  const base = {
    Horror: "Something terrifying happened in the dark...",
    Mystery: "Nobody could explain what happened...",
    History: "A forgotten story from the past..."
  };
  
  document.getElementById("result").innerText =
    `${base[cat]}

Idea:
${desc}`;
}

/* ===================== */
/* HOOK */
/* ===================== */

function generateHook() {
  
  const desc = document.getElementById("desc").value;
  
  const hooks = [
    "You won't believe what happened...",
    "This will shock you...",
    "Nobody expected this..."
  ];
  
  const random = hooks[Math.floor(Math.random() * hooks.length)];
  
  document.getElementById("result").innerText =
    `${random}

${desc}`;
}

/* ===================== */
/* THUMBNAIL */
/* ===================== */

function generateThumbnail() {
  
  const desc = document.getElementById("desc").value;
  
  document.getElementById("result").innerText =
    `Thumbnail Idea:

🔥 Bold text: "${desc}"
🎯 Focus object: Main subject
🎨 Style: Dark / Neon / Cinematic`;
}

/* INIT */
loadTool("home");