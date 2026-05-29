window.generateScript = function() {
  
  const cat =
    document.getElementById("category").value;
  
  const desc =
    document.getElementById("desc").value;
  
  /* OTHER CATEGORY */
  
  let finalCategory = cat;
  
  if (cat === "Other") {
    finalCategory =
      document.getElementById("otherInput").value;
  }
  
  /* ARRAYS */
  
  const horror = [
    "At 3AM, something terrifying happened...",
    "Nobody survived what happened that night...",
    "A dark secret was hidden for years..."
  ];
  
  const mystery = [
    "Nobody could explain the strange event...",
    "The truth shocked everyone...",
    "A hidden mystery changed everything..."
  ];
  
  const history = [
    "History tried to hide this story...",
    "In the past, something unbelievable happened...",
    "A forgotten event changed the world..."
  ];
  
  let selected;
  
  if (cat === "Horror") {
    selected = horror;
  }
  
  if (cat === "Mystery") {
    selected = mystery;
  }
  
  if (cat === "History") {
    selected = history;
  }
  
  /* OTHER */
  
  if (cat === "Other") {
    
    document.getElementById("result").innerText =
      
      `${finalCategory}

${desc}

This category is custom generated.`;
    
    return;
  }
  
  /* RANDOM RESULT */
  
  const random =
    selected[
      Math.floor(Math.random() * selected.length)
    ];
  
  document.getElementById("result").innerText =
    
    `${random}

${desc}

This story will reveal secrets nobody expected...`;
}