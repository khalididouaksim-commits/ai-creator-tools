window.loadTool = function(tool) {
  
  const app = document.getElementById("app");
  
  if (tool === "home") {
    app.innerHTML = `
      <h1>Welcome</h1>
      <p>Select tool</p>
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

    <input
      type="text"
      id="otherCategory"
      placeholder="Write your category"
    >

    <textarea
      id="desc"
      placeholder="Describe your video idea"
    ></textarea>

    <button onclick="generateScript()">
      Generate
    </button>

    <pre id="result"></pre>
  `;
}
  
  if (tool === "hook") {
    app.innerHTML = `
      <h1>Hook Generator</h1>

      <textarea id="desc"></textarea>

      <button onclick="generateHook()">Generate</button>

      <pre id="result"></pre>
    `;
  }
  
  if (tool === "thumbnail") {
    app.innerHTML = `
      <h1>Thumbnail Generator</h1>

      <textarea id="desc"></textarea>

      <button onclick="generateThumbnail()">Generate</button>

      <pre id="result"></pre>
    `;
  }
}

/* =================== */

window.generateScript = function() {
  
  const cat = document.getElementById("category").value;
  const desc = document.getElementById("desc").value;
  const other =
    document.getElementById("otherCategory").value;
  
  let intro = "";
  
  if (cat === "Horror") {
    intro = "At 3AM, something terrifying happened...";
  }
  else if (cat === "Mystery") {
    intro = "Nobody could explain the strange event...";
  }
  else if (cat === "History") {
    intro = "History tried to hide this story...";
  }
  else {
    intro = `Category: ${other}`;
  }
  
  document.getElementById("result").innerText =
    `${intro}

${desc}

This story will reveal secrets nobody expected.`;
}

/* =================== */

window.generateHook = function() {
  
  const desc = document.getElementById("desc").value;
  
  const hooks = [
    "You won't believe this...",
    "This shocked everyone...",
    "Nobody expected this..."
  ];
  
  const random = hooks[Math.floor(Math.random() * hooks.length)];
  
  document.getElementById("result").innerText =
    `${random}

${desc}`;
}

/* =================== */

window.generateThumbnail = function() {
  
  const desc = document.getElementById("desc").value;
  
  document.getElementById("result").innerText =
    `Thumbnail Idea:
${desc}`;
}

/* INIT */
window.loadTool("home");