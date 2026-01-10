// app.js

const allCards = window.CARDS || [];
const cardElement = document.getElementById("card");
const drawBtn = document.getElementById("draw-btn");
const resetBtn = document.getElementById("reset-btn");
const counterText = document.getElementById("counter-text");
const totalCountElement = document.getElementById("total-count");
const cardIndexDisplay = document.getElementById("card-index-display");
const cardCategoryElement = document.getElementById("card-category");
const themeToggleBtn = document.getElementById("theme-toggle");
const categoryFilter = document.getElementById("category-filter");
const historyList = document.getElementById("history-list");

let deck = [];
let index = 0;
let isFlipping = false;
let activeCategory = "all";
const MAX_HISTORY = 6;

// --------- Utility functions ---------

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateCounter() {
  const used = Math.min(index, deck.length);
  counterText.innerHTML = `
    <span class="counter-pill"></span>
    ${used} / ${deck.length} cards used
  `;
}

function updateTotalCount(count) {
  totalCountElement.textContent = count;
}

function categoryToClass(categoryName) {
  if (!categoryName) return "cat-generic";
  const key = categoryName.toLowerCase();

  if (key.includes("fun")) return "cat-fun";
  if (key.includes("reflect") || key.includes("deep")) return "cat-reflect";
  if (key.includes("team")) return "cat-teamwork";
  if (key.includes("growth") || key.includes("learn")) return "cat-growth";
  if (key.includes("product")) return "cat-productivity";
  if (key.includes("well")) return "cat-wellbeing";
  if (key.includes("communicat")) return "cat-communication";
  return "cat-generic";
}

// Render card content + coloured category badge + hint
function renderCard(cardOrText, category = null, hint = null) {
  const inner = cardElement.querySelector(".card-inner");

  let text, cat, h;
  if (typeof cardOrText === "object" && cardOrText !== null) {
    text = cardOrText.text;
    cat = cardOrText.category;
    h = cardOrText.hint;
  } else {
    text = cardOrText;
    cat = category;
    h = hint;
  }

  inner.innerHTML = `
    <div class="card-question">${text}</div>
    ${h ? `<div class="card-hint">${h}</div>` : ""}
  `;

  if (cat) {
    const baseClass = "card-category-pill";
    const catClass = categoryToClass(cat);
    cardCategoryElement.className = `${baseClass} ${catClass}`;
    cardCategoryElement.textContent = cat;
    cardCategoryElement.style.visibility = "visible";
  } else {
    cardCategoryElement.className = "card-category-pill cat-generic";
    cardCategoryElement.textContent = "";
    cardCategoryElement.style.visibility = "hidden";
  }
}

// History rendering
function addToHistory(card) {
  if (!card) return;

  const li = document.createElement("li");
  li.textContent = card.text;
  historyList.insertBefore(li, historyList.firstChild);

  while (historyList.children.length > MAX_HISTORY) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Build deck based on current category filter
function buildDeck() {
  const filtered =
    activeCategory === "all"
      ? allCards
      : allCards.filter((c) => c.category === activeCategory);

  deck = shuffle(filtered);
  index = 0;
  historyList.innerHTML = "";
  updateCounter();
  updateTotalCount(filtered.length);

  if (filtered.length === 0) {
    renderCard(
      "No cards available for this category. Try another filter.",
      null,
      null
    );
    cardIndexDisplay.textContent = "Empty deck";
  } else {
    renderCard(
      'Deck shuffled. Tap <strong>Draw Card</strong> to reveal the first question.',
      null,
      null
    );
    cardIndexDisplay.textContent = "Top card ready";
  }
}

// Flip animation wrapper
function flipCard(callback) {
  if (isFlipping) return;
  isFlipping = true;

  cardElement.classList.remove("flipping");
  void cardElement.offsetWidth; // force reflow
  cardElement.classList.add("flipping");

  // At halfway point we can swap content
  const duration = 450; // ms
  const halfway = duration / 2;

  setTimeout(() => {
    callback && callback();
  }, halfway);

  setTimeout(() => {
    cardElement.classList.remove("flipping");
    isFlipping = false;
  }, duration);
}

// Draw card logic
function drawCard() {
  if (isFlipping) return;

  if (!deck || deck.length === 0) {
    renderCard("No cards loaded. Please add questions to the code.", null, null);
    cardIndexDisplay.textContent = "Empty deck";
    return;
  }

  if (index >= deck.length) {
    renderCard(
      "<strong>All cards have been used!</strong><br/>Click “Shuffle Deck” to reshuffle and start again.",
      null,
      null
    );
    cardIndexDisplay.textContent = "End of deck";
    return;
  }

  const card = deck[index];

  flipCard(() => {
    index++;
    renderCard(card);
    cardIndexDisplay.textContent = `Card ${index} of ${deck.length}`;
    updateCounter();
    addToHistory(card);
  });
}

// Theme handling
function applyTheme(themeClass) {
  document.body.classList.remove("theme-dark", "theme-light");
  document.body.classList.add(themeClass);

  const iconEl = themeToggleBtn.querySelector(".mode-icon");
  const labelEl = themeToggleBtn.querySelector(".mode-label");

  if (themeClass === "theme-light") {
    iconEl.textContent = "☀";
    labelEl.textContent = "Light";
  } else {
    iconEl.textContent = "🌙";
    labelEl.textContent = "Dark";
  }

  try {
    localStorage.setItem("conversationDeckTheme", themeClass);
  } catch (e) {
    // ignore
  }
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("conversationDeckTheme");
  } catch (e) {
    // ignore
  }

  if (saved === "theme-light" || saved === "theme-dark") {
    applyTheme(saved);
  } else {
    applyTheme("theme-dark");
  }
}

// --------- Event bindings ---------

drawBtn.addEventListener("click", drawCard);
resetBtn.addEventListener("click", () => buildDeck());

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    drawCard();
  }
});

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("theme-dark");
  applyTheme(isDark ? "theme-light" : "theme-dark");
});

categoryFilter.addEventListener("change", (e) => {
  activeCategory = e.target.value || "all";
  buildDeck();
});

// On animation end we ensure flag resets if needed
cardElement.addEventListener("animationend", () => {
  cardElement.classList.remove("flipping");
  isFlipping = false;
});

// --------- Init ---------
initTheme();
buildDeck();
