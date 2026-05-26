function randomTool() {
  
  const tools = [
    
    "generators/hook-generator.html",
    
    "generators/prompt-generator.html",
    
    "generators/script-generator.html",
    
    "generators/thumbnail-generator.html",
    
    "generators/title-generator.html"
    
  ];
  
  const random =
    tools[Math.floor(Math.random() * tools.length)];
  
  window.location.href = random;
}

function scrollTopPage() {
  
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  
}

/* SIMPLE FADE-IN */

const cards =
  document.querySelectorAll(
    ".featured-card,.tool-btn,.stat-box,.quick-card"
  );

cards.forEach((card, index) => {
  
  card.style.opacity = "0";
  
  card.style.transform = "translateY(20px)";
  
  setTimeout(() => {
    
    card.style.transition =
      "all 0.6s ease";
    
    card.style.opacity = "1";
    
    card.style.transform =
      "translateY(0px)";
    
  }, index * 100);
  
});