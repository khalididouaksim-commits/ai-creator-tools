const app = document.getElementById("app");

function loadTool(tool) {
  
  if (tool === "home") {
    app.innerHTML = `
      <h1>AI Studio</h1>
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

      <textarea id="desc" placeholder="Idea"></textarea>

      <button onclick="generateHook()">Generate</button>

      <pre id="result"></pre>
    `;
  }
  
  if (tool === "thumbnail") {
    app.innerHTML = `
      <h1>Thumbnail Ideas</h1>
      <textarea placeholder="Video topic"></textarea>
      <button>Generate</button>
    `;
  }
}

/* GENERATORS */

function generateScript() {
  const cat = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;
  
  const data = {
    Horror: "Something terrifying happened...",
    Mystery: "Nobody understood what was going on...",
    History: "In the past, a hidden story appeared..."
  };
  
  document.getElementById("result").innerText =
    `${data[cat]}

Idea:
${desc}`;
}

function generateHook() {
  const desc = document.getElementById("desc").value;
  
  const hooks = [
    "You won't believe this...",
    "Nobody expected this...",
    "This changed everything..."
  ];
  
  const random = hooks[Math.floor(Math.random() * hooks.length)];
  
  document.getElementById("result").innerText =
    `${random}

${desc}`;
}

/* START */
loadTool("home");