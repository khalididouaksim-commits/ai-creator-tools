const app = document.getElementById("app");

/* HOME */
function showHome() {
  app.innerHTML = `
    <h1>Welcome to AI Studio</h1>
    <p>Select a tool from sidebar</p>
  `;
}

/* SCRIPT TOOL */
function showScript() {
  app.innerHTML = `
    <h1>Script Generator</h1>

    <select id="category">
      <option>Horror</option>
      <option>History</option>
      <option>Mystery</option>
      <option>Other</option>
    </select>

    <textarea id="desc" placeholder="Write your idea..."></textarea>

    <button onclick="generateScript()">Generate</button>

    <pre id="result"></pre>
  `;
}

/* HOOK TOOL */
function showHook() {
  app.innerHTML = `
    <h1>Hook Generator</h1>

    <textarea id="desc" placeholder="Video idea..."></textarea>

    <button onclick="generateHook()">Generate</button>

    <pre id="result"></pre>
  `;
}

/* ROUTER */
function loadTool(tool) {
  
  if (tool === "home") showHome();
  if (tool === "script") showScript();
  if (tool === "hook") showHook();
  if (tool === "thumbnail") showHome(); // مؤقت
}

/* SCRIPT GENERATION */
function generateScript() {
  
  const cat = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;
  
  const base = {
    Horror: "Something dark happened...",
    Mystery: "Nobody understood what happened...",
    History: "In the past, a hidden story..."
  };
  
  document.getElementById("result").innerText =
    `${base[cat]}

Idea:
${desc}`;
}

/* HOOK GENERATION */
function generateHook() {
  
  const desc = document.getElementById("desc").value;
  
  const hooks = [
    "You won't believe what happened...",
    "This changed everything...",
    "Nobody expected this..."
  ];
  
  const random = hooks[Math.floor(Math.random() * hooks.length)];
  
  document.getElementById("result").innerText =
    `${random}

${desc}`;
}

/* INIT */
showHome();