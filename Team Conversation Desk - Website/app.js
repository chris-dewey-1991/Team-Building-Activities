// app.js — Team Conversation Deck v3.0
(function () {
  "use strict";

  const ALL_CARDS = window.CARDS || [];
  const CATEGORIES = window.CATEGORIES || [];
  const DEPTHS = [
    { id: 1, label: "Light" },
    { id: 2, label: "Medium" },
    { id: 3, label: "Deep" },
  ];
  const TIMERS = [
    { id: 0, label: "Off" },
    { id: 60, label: "1 min" },
    { id: 120, label: "2 min" },
    { id: 180, label: "3 min" },
  ];
  const HISTORY_SIZE = 8;
  const STORE_KEY = "tcd-settings";

  const $ = (id) => document.getElementById(id);
  const el = {
    card: $("card"),
    front: document.querySelector(".card-front"),
    cat: $("card-cat"),
    depth: $("card-depth"),
    question: $("card-question"),
    hint: $("card-hint"),
    number: $("card-number"),
    backLabel: $("back-label"),
    draw: $("draw-btn"),
    drawLabel: $("draw-label"),
    prev: $("prev-btn"),
    shuffle: $("shuffle-btn"),
    copy: $("copy-btn"),
    status: $("status"),
    progress: $("progress-bar"),
    catChips: $("cat-chips"),
    catAll: $("cat-all"),
    depthChips: $("depth-chips"),
    timerChips: $("timer-chips"),
    history: $("history"),
    historyEmpty: $("history-empty"),
    deckCount: $("deck-count"),
    theme: $("theme-btn"),
    focus: $("focus-btn"),
    shortcutsBtn: $("shortcuts-btn"),
    shortcuts: $("shortcuts"),
    timer: $("timer"),
    timerText: $("timer-text"),
    timerRing: $("timer-ring"),
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- State ----------
  const state = {
    cats: new Set(CATEGORIES.map((c) => c.id)),
    depths: new Set([1, 2, 3]),
    timer: 0,
    deck: [],
    pos: -1, // index of the card currently shown
    furthest: -1, // furthest card drawn in this shuffle
    busy: false,
  };

  // ---------- Storage (best effort) ----------
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
  function saveSettings() {
    save(STORE_KEY, { cats: [...state.cats], depths: [...state.depths], timer: state.timer });
  }
  (function restore() {
    const s = load(STORE_KEY);
    if (!s) return;
    const validCats = CATEGORIES.map((c) => c.id);
    if (Array.isArray(s.cats)) {
      const cats = s.cats.filter((c) => validCats.includes(c));
      if (cats.length) state.cats = new Set(cats);
    }
    if (Array.isArray(s.depths)) {
      const d = s.depths.filter((x) => [1, 2, 3].includes(x));
      if (d.length) state.depths = new Set(d);
    }
    if (TIMERS.some((t) => t.id === s.timer)) state.timer = s.timer;
  })();

  // ---------- Helpers ----------
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z]+/g, "-");
  const depthLabel = (d) => (DEPTHS.find((x) => x.id === d) || DEPTHS[0]).label;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function filtered() {
    return ALL_CARDS.filter((c) => state.cats.has(c.category) && state.depths.has(c.depth || 1));
  }

  let statusTimer;
  function announce(msg, sticky) {
    el.status.textContent = msg;
    clearTimeout(statusTimer);
    if (!sticky) statusTimer = setTimeout(() => (el.status.textContent = ""), 2500);
  }

  // ---------- Chips ----------
  function makeChip(container, { label, pressed, onClick, cat }) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    if (cat) {
      b.dataset.cat = slug(cat);
      const dot = document.createElement("span");
      dot.className = "chip-dot";
      dot.setAttribute("aria-hidden", "true");
      b.appendChild(dot);
    }
    b.appendChild(document.createTextNode(label));
    b.setAttribute("aria-pressed", String(pressed));
    b.addEventListener("click", onClick);
    container.appendChild(b);
    return b;
  }

  function renderChips() {
    el.catChips.textContent = "";
    CATEGORIES.forEach((c) => {
      const n = ALL_CARDS.filter((x) => x.category === c.id && state.depths.has(x.depth || 1)).length;
      const chip = makeChip(el.catChips, {
        label: c.label,
        cat: c.id,
        pressed: state.cats.has(c.id),
        onClick: () => {
          if (state.cats.has(c.id)) {
            if (state.cats.size === 1) return announce("Keep at least one category selected.");
            state.cats.delete(c.id);
          } else state.cats.add(c.id);
          onFiltersChanged();
        },
      });
      chip.title = `${c.blurb} (${n} cards)`;
      const count = document.createElement("span");
      count.className = "chip-count";
      count.textContent = n;
      chip.appendChild(count);
    });
    el.catAll.textContent = state.cats.size === CATEGORIES.length ? "Clear" : "Select all";

    el.depthChips.textContent = "";
    DEPTHS.forEach((d) =>
      makeChip(el.depthChips, {
        label: d.label,
        pressed: state.depths.has(d.id),
        onClick: () => {
          if (state.depths.has(d.id)) {
            if (state.depths.size === 1) return announce("Keep at least one depth selected.");
            state.depths.delete(d.id);
          } else state.depths.add(d.id);
          onFiltersChanged();
        },
      })
    );

    el.timerChips.textContent = "";
    TIMERS.forEach((t) =>
      makeChip(el.timerChips, {
        label: t.label,
        pressed: state.timer === t.id,
        onClick: () => {
          state.timer = t.id;
          saveSettings();
          renderChips();
          if (state.pos >= 0 && !el.card.classList.contains("is-back")) startTimer();
          else stopTimer();
        },
      })
    );
  }

  function onFiltersChanged() {
    saveSettings();
    renderChips();
    newDeck(true);
  }

  // ---------- Deck ----------
  function newDeck(quiet) {
    state.deck = shuffle(filtered());
    state.pos = -1;
    state.furthest = -1;
    stopTimer();
    turnFaceDown();
    el.deckCount.textContent = `${state.deck.length} card${state.deck.length === 1 ? "" : "s"}`;
    el.backLabel.textContent = state.deck.length
      ? `${state.deck.length} cards shuffled. Tap Draw to begin.`
      : "No cards match these filters";
    renderHistory();
    updateControls();
    if (!quiet) announce(`Deck shuffled: ${state.deck.length} cards.`);
  }

  function fillFront(card, i) {
    el.front.dataset.cat = slug(card.category);
    el.cat.textContent = card.category;
    el.depth.textContent = depthLabel(card.depth);
    el.depth.dataset.depth = card.depth || 1;
    el.question.textContent = card.text;
    el.hint.textContent = card.hint || "";
    el.hint.hidden = !card.hint;
    el.number.textContent = `${i + 1} / ${state.deck.length}`;
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function turnFaceDown() {
    el.card.classList.add("no-anim", "is-back");
    void el.card.offsetWidth;
    el.card.classList.remove("no-anim");
  }

  async function showCard(i, dir) {
    if (state.busy || i < 0 || i >= state.deck.length) return;
    state.busy = true;
    const card = state.deck[i];
    const faceUp = !el.card.classList.contains("is-back");

    if (reducedMotion.matches) {
      el.card.classList.add("fade");
      await wait(120);
      fillFront(card, i);
      el.card.classList.remove("is-back");
      el.card.classList.remove("fade");
    } else {
      if (faceUp) {
        el.card.classList.add(dir < 0 ? "leave-right" : "leave-left");
        await wait(220);
        el.card.classList.add("no-anim");
        el.card.classList.remove("leave-left", "leave-right");
        el.card.classList.add("is-back");
        void el.card.offsetWidth;
        el.card.classList.remove("no-anim");
      }
      fillFront(card, i);
      el.card.classList.remove("is-back");
      await wait(480);
    }

    state.pos = i;
    state.furthest = Math.max(state.furthest, i);
    renderHistory();
    updateControls();
    startTimer();
    state.busy = false;
  }

  function drawNext() {
    if (!state.deck.length) return announce("No cards match these filters.");
    if (state.pos >= state.deck.length - 1) {
      stopTimer();
      turnFaceDown();
      el.backLabel.textContent = "That’s the whole deck! Shuffle to go again.";
      state.pos = state.deck.length;
      updateControls();
      announce("You’ve been through every card. Shuffle to go again.", true);
      return;
    }
    showCard(state.pos + 1, 1);
  }

  function goBack() {
    if (state.pos <= 0) return;
    showCard(Math.min(state.pos, state.deck.length) - 1, -1);
  }

  function updateControls() {
    const total = state.deck.length;
    const done = Math.min(state.furthest + 1, total);
    el.progress.style.width = total ? `${(done / total) * 100}%` : "0%";
    el.prev.disabled = state.pos <= 0;
    el.draw.disabled = total === 0;
    el.drawLabel.textContent =
      state.pos < 0 ? "Draw card" : state.pos >= total - 1 ? "Finish" : "Next card";
    if (state.pos >= total) el.drawLabel.textContent = "Start again";
  }

  // ---------- History ----------
  function renderHistory() {
    el.history.textContent = "";
    const start = Math.max(0, state.furthest - HISTORY_SIZE + 1);
    for (let i = state.furthest; i >= start; i--) {
      const c = state.deck[i];
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "history-item";
      b.dataset.cat = slug(c.category);
      if (i === state.pos) b.setAttribute("aria-current", "true");
      const dot = document.createElement("span");
      dot.className = "chip-dot";
      dot.setAttribute("aria-hidden", "true");
      const txt = document.createElement("span");
      txt.textContent = c.text;
      b.append(dot, txt);
      b.addEventListener("click", () => {
        if (i !== state.pos) showCard(i, i < state.pos ? -1 : 1);
      });
      li.appendChild(b);
      el.history.appendChild(li);
    }
    el.historyEmpty.hidden = state.furthest >= 0;
  }

  // ---------- Timer ----------
  let timerId = null;
  const RING = 2 * Math.PI * 19;
  el.timerRing.style.strokeDasharray = RING;

  function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    el.timer.hidden = true;
    el.timer.classList.remove("done");
  }

  function startTimer() {
    stopTimer();
    if (!state.timer) return;
    const total = state.timer;
    let left = total;
    el.timer.hidden = false;
    const tick = () => {
      el.timerText.textContent = fmt(left);
      el.timerRing.style.strokeDashoffset = RING * (1 - left / total);
      if (left <= 0) {
        clearInterval(timerId);
        el.timer.classList.add("done");
        announce("Time’s up. Ready for the next card?");
      }
      left--;
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  // ---------- Theme ----------
  function currentTheme() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function syncThemeButton() {
    const dark = currentTheme() === "dark";
    el.theme.querySelector("use").setAttribute("href", dark ? "#i-sun" : "#i-moon");
    el.theme.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("tcd-theme", next); } catch (e) { /* ignore */ }
    syncThemeButton();
  }

  // ---------- Presenter mode ----------
  function setPresenting(on) {
    document.body.classList.toggle("presenting", on);
    el.focus.querySelector("use").setAttribute("href", on ? "#i-shrink" : "#i-expand");
    el.focus.setAttribute("aria-label", on ? "Exit presenter mode" : "Presenter mode");
  }
  function togglePresenting() {
    const on = !document.body.classList.contains("presenting");
    setPresenting(on);
    try {
      if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!on && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) { /* ignore */ }
  }
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && document.body.classList.contains("presenting")) setPresenting(false);
  });

  // ---------- Copy ----------
  async function copyQuestion() {
    const c = state.deck[state.pos];
    if (!c) return;
    try {
      await navigator.clipboard.writeText(c.text);
      announce("Question copied to clipboard.");
    } catch (e) {
      announce("Couldn’t copy. Your browser blocked clipboard access.");
    }
  }

  // ---------- Events ----------
  el.draw.addEventListener("click", () => {
    if (state.busy) return;
    if (state.pos >= state.deck.length) {
      newDeck(true);
      drawNext();
    } else drawNext();
  });
  el.prev.addEventListener("click", goBack);
  el.shuffle.addEventListener("click", () => newDeck());
  el.copy.addEventListener("click", copyQuestion);
  el.theme.addEventListener("click", toggleTheme);
  el.focus.addEventListener("click", togglePresenting);
  el.shortcutsBtn.addEventListener("click", () => el.shortcuts.showModal());
  el.catAll.addEventListener("click", () => {
    if (state.cats.size === CATEGORIES.length) state.cats = new Set([CATEGORIES[0].id]);
    else state.cats = new Set(CATEGORIES.map((c) => c.id));
    onFiltersChanged();
  });
  el.card.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    if (el.card.classList.contains("is-back")) el.draw.click();
  });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (el.shortcuts.open) return;
    const tag = (e.target.tagName || "").toLowerCase();
    const onButton = tag === "button" && e.target !== el.draw;
    switch (e.key) {
      case " ":
      case "Enter":
        if (onButton) return; // let focused buttons activate normally
        e.preventDefault();
        el.draw.click();
        break;
      case "ArrowRight":
        e.preventDefault();
        el.draw.click();
        break;
      case "ArrowLeft":
        e.preventDefault();
        goBack();
        break;
      case "s":
      case "S":
        newDeck();
        break;
      case "f":
      case "F":
        togglePresenting();
        break;
      case "t":
      case "T":
        toggleTheme();
        break;
      case "Escape":
        if (document.body.classList.contains("presenting")) togglePresenting();
        break;
    }
  });

  // ---------- Init ----------
  syncThemeButton();
  renderChips();
  newDeck(true);
})();
