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

<button onclick="generateScript()">
  🔄 Regenerate
</button>
  
<button onclick="makeDramatic()">
  🎭 More Dramatic
</button>

<button onclick="makeViral()">
  ⚡ More Viral
</button>

<button onclick="makeShorter()">
  ✂️ Shorter
</button>

<button onclick="copyResult()">
  📋 Copy
</button>

    <pre id="result"></pre>
  `;
}
  
  if (tool === "hook") {
  app.innerHTML = `
    <h1>Hook Generator</h1>

    <select id="hookCategory">
      <option>Horror</option>
      <option>Mystery</option>
      <option>History</option>
      <option>Facts</option>
      <option>Other</option>
    </select>

    <input
      type="text"
      id="otherHookCategory"
      placeholder="Write your category"
    >

    <textarea
      id="desc"
      placeholder="Describe your topic"
    ></textarea>

    <button onclick="generateHook()">
      Generate
    </button>

<button onclick="copyResult()">
  📋 Copy Hooks
</button>

<button onclick="generateHook()">
  🔄 Regenerate
</button>

    <pre id="result"></pre>
  `;
}
  
  if (tool === "thumbnail") {
    app.innerHTML = `
      <h1>Thumbnail Generator</h1>

      <textarea id="desc"></textarea>

      <button onclick="generateThumbnail()">
  Generate
</button>

<button onclick="generateThumbnail()">
  🔄 Regenerate
</button>

<button onclick="copyResult()">
  📋 Copy
</button>

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
  
  const openings = [
  "A mysterious event begins when",
  "Everything changes when",
  "The story starts after",
  "Nobody expected what happened when"
];

const middles = [
  "strange secrets start to appear.",
  "unexpected events shock everyone.",
  "the situation becomes more dangerous.",
  "the truth slowly comes to light."
];

const endings = [
  "Nobody knows how it will end.",
  "The mystery remains unsolved.",
  "What happens next changes everything.",
  "The final discovery shocks the world."
];

const opening =
  openings[Math.floor(Math.random() * openings.length)];

const middle =
  middles[Math.floor(Math.random() * middles.length)];

const ending =
  endings[Math.floor(Math.random() * endings.length)];

document.getElementById("result").innerText =
  
  `${intro}

SCRIPT:

${opening} ${desc}.

As the story develops, ${middle}

${ending}`;
}

/* =================== */

window.generateHook = function() {
  
  const desc =
    document.getElementById("desc").value;
  
const category =
  document.getElementById("hookCategory").value;
  
  let hooks = [];

if (category === "Horror") {
  
  hooks = [
    `The terrifying truth about ${desc}...`,
    `Nobody survived after ${desc}...`,
    `What happened that night still remains unexplained...`,
    `This horror story shocked everyone...`,
    `The dark secret behind ${desc}...`
  ];
  
}

else if (category === "Mystery") {
  
  hooks = [
    `Nobody could explain ${desc}...`,
    `The mystery of ${desc} remains unsolved...`,
    `What investigators found was shocking...`,
    `The truth about ${desc} stayed hidden for years...`,
    `A strange event changed everything...`
  ];
  
}

else if (category === "History") {
  
  hooks = [
    `History tried to hide this story...`,
    `Few people know the truth about ${desc}...`,
    `This event changed the world forever...`,
    `A forgotten chapter of history...`,
    `What really happened during ${desc}?`
  ];
  
}

else {
  
  hooks = [
    `You won't believe what happened with ${desc}...`,
    `This shocking story about ${desc} changed everything...`,
    `Nobody expected this truth about ${desc}...`,
    `99% of people don't know this about ${desc}...`,
    `The truth about ${desc} changed everything...`
  ];
  
}

  let result = "";
  
  for (let i = 0; i < 5; i++) {
    
    const random =
      hooks[Math.floor(Math.random() * hooks.length)];
    
    result += `${i + 1}. ${random}\n\n`;
    
  }
  
  document.getElementById("result").innerText =
    result;
}
/* =================== */

window.generateThumbnail = function(){

  const desc =
    document.getElementById("desc").value;

  const texts = [
    "SHOCKING DISCOVERY",
    "THE TRUTH REVEALED",
    "NOBODY EXPECTED THIS",
    "FOUND AFTER YEARS",
    "HIDDEN SECRET EXPOSED"
  ];

  const emotions = [
    "😱 Shocked Face",
    "😨 Fear",
    "🤯 Mind Blown",
    "😲 Surprise"
  ];

  const text =
    texts[Math.floor(Math.random() * texts.length)];

  const emotion =
    emotions[Math.floor(Math.random() * emotions.length)];

  document.getElementById("result").innerText =

`MAIN TEXT:
${text}

EMOTION:
${emotion}

SUBJECT:
${desc}

BACKGROUND:
Cinematic Scene

STYLE:
High Contrast, Viral YouTube Thumbnail`;
}

/* INIT */
window.loadTool("home");

window.makeDramatic = function(){

  const result =
    document.getElementById("result");

  const text = result.innerText;

  if(!text){
    return;
  }

  result.innerText =

`⚠️ SHOCKING DISCOVERY ⚠️

${text}

Nobody was prepared for what happened next.

The truth would change everything forever.`;
}

window.makeViral = function(){

  const result =
    document.getElementById("result");

  const text = result.innerText;

  if(!text){
    return;
  }

  const hooks = [
    "99% of people have never heard this story...",
    "This mystery shocked the internet...",
    "What happened next is unbelievable...",
    "Nobody expected this discovery..."
  ];

  const hook =
    hooks[Math.floor(Math.random() * hooks.length)];

  result.innerText =

`${hook}

${text}

Watch until the end to discover the truth.`;
}

window.makeShorter = function(){

  const result =
    document.getElementById("result");

  const text = result.innerText;

  if(!text){
    return;
  }

  const lines = text.split("\n");

  const shortText =
    lines.slice(0, 5).join("\n");

  result.innerText =
`${shortText}

[Short Version]`;
}

window.copyResult = function(){

  const text =
    document.getElementById("result").innerText;

  if(!text){
    return;
  }

  navigator.clipboard.writeText(text);

  alert("Copied!");
}