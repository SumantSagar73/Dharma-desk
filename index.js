// Dashboard functionality

// Initialize dashboard when page loads
window.addEventListener("DOMContentLoaded", function () {
  initializeDashboard();
});

function initializeDashboard() {
  // Load saved goals state
  loadGoalsState();

  // Setup event listeners
  setupEventListeners();

  // Start time updates
  updateClock();
  setInterval(updateClock, 1000);

  // Get Gita quote
  fetchRandomGitaQuote();

  // Update daily reminders
  updateDailyReminder();

  // Create floating particles
  createFloatingParticles();

  // Update progress display
  updateProgressDisplay();
}

// Clock functionality
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("current-time").textContent = timeString;
  document.getElementById("current-date").textContent = dateString;
}

// Goals Management System
let goals = [];
let goalIdCounter = 1;

// Goals and progress tracking
function setupEventListeners() {
  // Add goal button
  document.getElementById("add-goal-btn").addEventListener("click", addNewGoal);

  // Search functionality
  const searchBar = document.getElementById("search-bar");
  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", performSearch);
  searchBar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
}

function addNewGoal() {
  if (goals.length >= 5) {
    return; // Limit to 5 goals
  }

  const newGoal = {
    id: goalIdCounter++,
    text: "",
    completed: false,
  };

  console.log(`Adding new goal with ID: ${newGoal.id}`);
  goals.push(newGoal);

  // Only re-render goals, don't affect existing ones
  renderGoals();
  saveGoalsState();

  // Focus on the new goal input
  setTimeout(() => {
    const newInput = document.querySelector(
      `[data-goal-id="${newGoal.id}"] .goal-input`
    );
    if (newInput) {
      newInput.focus();
    }
  }, 50);
}

function removeGoal(goalId) {
  goals = goals.filter((goal) => goal.id !== goalId);
  renderGoals();
  updateProgressDisplay();
  saveGoalsState();
}

function toggleGoal(goalId) {
  console.log(`Toggle goal called for ID: ${goalId}`);
  const goal = goals.find((g) => g.id === goalId);
  if (goal) {
    goal.completed = !goal.completed;
    console.log(
      `Goal ${goalId} is now ${goal.completed ? "completed" : "incomplete"}`
    );

    // Update only the specific goal item instead of re-rendering everything
    updateSingleGoalDisplay(goalId);
    updateProgressDisplay();
    saveGoalsState();
  } else {
    console.error(`Goal with ID ${goalId} not found`);
  }
}

function updateSingleGoalDisplay(goalId) {
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return;

  const goalItem = document.querySelector(`[data-goal-id="${goalId}"]`);
  if (!goalItem) return;

  const checkbox = goalItem.querySelector(".goal-checkbox");
  const textInput = goalItem.querySelector(".goal-input");
  const progressIndicator = goalItem.querySelector(".goal-progress");

  // Update checkbox
  checkbox.checked = goal.completed;

  // Update classes
  goalItem.className = `goal-item ${goal.completed ? "completed" : ""}`;
  textInput.className = `goal-input ${goal.completed ? "completed" : ""}`;
  progressIndicator.className = `goal-progress ${
    goal.completed ? "completed" : ""
  }`;

  // Update progress indicator
  progressIndicator.textContent = goal.completed ? "✓" : "○";
}

function updateGoalText(goalId, text) {
  const goal = goals.find((g) => g.id === goalId);
  if (goal && goal.text !== text) {
    goal.text = text;
    console.log(`Updated goal ${goalId} text to: "${text}"`);
    saveGoalsState();
    // Don't re-render here to avoid losing focus/selection
  }
}

function updateProgressDisplay() {
  // Only count goals that have text content
  const goalsWithText = goals.filter((g) => g.text && g.text.trim() !== "");
  const completedGoals = goalsWithText.filter((g) => g.completed).length;
  const totalGoals = goalsWithText.length;
  const percentage =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Note: do not toggle visibility here. Let CSS decide initial visibility and
  // keep JS focused on updating values only. This prevents the progress widget
  // from being forcibly hidden on load when the UI should control it.

  // Update stats
  const goalsCompletedEl = document.getElementById("goals-completed");
  const progressPercentageEl = document.getElementById("progress-percentage");

  if (goalsCompletedEl) {
    goalsCompletedEl.textContent = `${completedGoals}/${totalGoals}`;
  }

  if (progressPercentageEl) {
    progressPercentageEl.textContent = `${percentage}%`;
  }

  // Update progress circle
  const circle = document.getElementById("progress-circle-fill");
  if (circle) {
    const circumference = 188.5; // 2 * π * 30
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Add smooth transition
    circle.style.transition = "stroke-dashoffset 0.5s ease";
  }
}

function renderGoals() {
  const container = document.getElementById("goals-container");

  if (goals.length === 0) {
    container.innerHTML = `
      <div class="goals-empty">
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 1.2em; margin-bottom: 15px; color: rgba(255, 255, 255, 0.95); font-weight: 500;">
            "कर्म परमो धर्मः"
          </div>
          <div style="font-size: 1em; margin-bottom: 10px; color: rgba(255, 255, 255, 0.85);">
            कर्म ही सबसे बड़ा धर्म है
          </div>
          <div style="font-size: 0.9em; color: rgba(255, 255, 255, 0.75); font-style: italic;">
            Action is the highest dharma
          </div>
          <div style="margin-top: 20px; font-size: 0.85em; color: rgba(255, 255, 255, 0.6);">
            Click "Add Goal" to start your journey!
          </div>
        </div>
      </div>
    `;
    document.getElementById("add-goal-btn").disabled = false;
    updateProgressDisplay();
    return;
  }

  // Clear container first
  container.innerHTML = "";

  // Create goals one by one to ensure proper event handling
  goals.forEach((goal) => {
    const goalItem = document.createElement("div");
    goalItem.className = `goal-item ${goal.completed ? "completed" : ""}`;
    goalItem.setAttribute("data-goal-id", goal.id);

    goalItem.innerHTML = `
            <input type="checkbox" class="goal-checkbox" ${
              goal.completed ? "checked" : ""
            }>
            <input type="text" class="goal-input ${
              goal.completed ? "completed" : ""
            }" 
                   value="${escapeHtml(
                     goal.text
                   )}" placeholder="Enter your goal...">
            <div class="goal-progress ${goal.completed ? "completed" : ""}">
                ${goal.completed ? "✓" : "○"}
            </div>
            <button class="remove-goal-btn" title="Remove goal">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add proper event listeners
    const checkbox = goalItem.querySelector(".goal-checkbox");
    const textInput = goalItem.querySelector(".goal-input");
    const removeBtn = goalItem.querySelector(".remove-goal-btn");

    checkbox.addEventListener("change", () => {
      console.log(`Toggling goal ${goal.id}: ${checkbox.checked}`);
      toggleGoal(goal.id);
    });

    textInput.addEventListener("input", () => {
      updateGoalText(goal.id, textInput.value);
    });

    textInput.addEventListener("blur", () => {
      updateGoalText(goal.id, textInput.value);
    });

    textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // Save the current goal text
        updateGoalText(goal.id, textInput.value);

        // If this goal has text and we're under the limit, create a new goal
        if (textInput.value.trim() !== "" && goals.length < 5) {
          addNewGoal();
        } else {
          textInput.blur();
        }
      }
    });

    removeBtn.addEventListener("click", () => {
      removeGoal(goal.id);
    });

    container.appendChild(goalItem);
  });

  // Update add button state
  const addBtn = document.getElementById("add-goal-btn");
  if (goals.length >= 5) {
    addBtn.disabled = true;
    addBtn.innerHTML = '<i class="fas fa-check"></i> Goal Limit Reached';
  } else {
    addBtn.disabled = false;
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Goal';
  }

  // Update progress display
  updateProgressDisplay();
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function saveGoalsState() {
  const goalsState = {
    goals: goals,
    goalIdCounter: goalIdCounter,
    date: new Date().toDateString(),
  };
  localStorage.setItem("dailyGoals", JSON.stringify(goalsState));
}

function loadGoalsState() {
  const saved = localStorage.getItem("dailyGoals");
  if (saved) {
    const goalsState = JSON.parse(saved);
    const today = new Date().toDateString();

    // Reset goals if it's a new day
    if (goalsState.date !== today) {
      resetDailyGoals();
      return;
    }

    // Load saved state
    goals = goalsState.goals || [];
    goalIdCounter = goalsState.goalIdCounter || 1;
    renderGoals();
    updateProgressDisplay();
  } else {
    // Initialize with empty goals array
    goals = [];
    goalIdCounter = 1;
    renderGoals();
    updateProgressDisplay();
  }
}

function resetDailyGoals() {
  goals = [];
  goalIdCounter = 1;
  renderGoals();
  updateProgressDisplay();
  saveGoalsState();
}

// Make functions global for onclick handlers
window.addNewGoal = addNewGoal;
window.removeGoal = removeGoal;
window.toggleGoal = toggleGoal;
window.updateGoalText = updateGoalText;

// Search functionality
function performSearch() {
  const query = document.getElementById("search-bar").value.trim();
  if (query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.open(searchUrl, "_blank");
    document.getElementById("search-bar").value = "";
  }
}

// Daily reminder functionality with motivational quotes API
async function updateDailyReminder() {
  try {
    // Try to fetch from motivational quotes API
    const response = await fetch(
      "https://api.quotegarden.io/api/v3/quotes/random"
    );
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        const quote = data.data.quoteText;
        const author = data.data.quoteAuthor || "Unknown";
        document.getElementById(
          "daily-reminder-text"
        ).textContent = `"${quote}" - ${author}`;
        return;
      }
    }
  } catch (error) {
    console.log("Primary API failed, trying backup...");
  }

  try {
    // Backup API - Quotable
    const response = await fetch(
      "https://api.quotable.io/random?tags=motivational|inspirational&maxLength=120"
    );
    if (response.ok) {
      const data = await response.json();
      document.getElementById(
        "daily-reminder-text"
      ).textContent = `"${data.content}" - ${data.author}`;
      return;
    }
  } catch (error) {
    console.log("Backup API failed, using fallback quotes...");
  }

  // Fallback to local motivational quotes if APIs fail
  const fallbackQuotes = [
    {
      text: "The only way to do great work is to love what you do",
      author: "Steve Jobs",
    },
    {
      text: "Innovation distinguishes between a leader and a follower",
      author: "Steve Jobs",
    },
    { text: "Stay hungry, stay foolish", author: "Steve Jobs" },
    {
      text: "Code is like humor. When you have to explain it, it's bad",
      author: "Cory House",
    },
    {
      text: "First, solve the problem. Then, write the code",
      author: "John Johnson",
    },
    {
      text: "Experience is the name everyone gives to their mistakes",
      author: "Oscar Wilde",
    },
    {
      text: "In order to be irreplaceable, one must always be different",
      author: "Coco Chanel",
    },
    {
      text: "Java is to JavaScript what car is to Carpet",
      author: "Chris Heilmann",
    },
    { text: "Knowledge is power", author: "Francis Bacon" },
    { text: "Learning never exhausts the mind", author: "Leonardo da Vinci" },
    {
      text: "The future belongs to those who learn more skills",
      author: "Jacob Morgan",
    },
    {
      text: "Don't forget to commit your progress today!",
      author: "Developer Wisdom",
    },
    { text: "Every expert was once a beginner", author: "Robin Sharma" },
    { text: "Progress, not perfection", author: "Anonymous" },
  ];

  const randomQuote =
    fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  document.getElementById(
    "daily-reminder-text"
  ).textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
}

// Floating particles animation
function createFloatingParticles() {
  const container = document.querySelector(".floating-particles");

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "3px";
    particle.style.height = "3px";
    particle.style.background = "rgba(255, 255, 255, 0.4)";
    particle.style.borderRadius = "50%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animation = `float ${
      4 + Math.random() * 4
    }s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 2 + "s";

    container.appendChild(particle);
  }
}

// Function to get random chapter and verse numbers
function getRandomChapterVerse() {
  // Bhagavad Gita has 18 chapters with varying number of verses
  const chaptersVerses = {
    1: 47,
    2: 72,
    3: 43,
    4: 42,
    5: 29,
    6: 47,
    7: 30,
    8: 28,
    9: 34,
    10: 42,
    11: 55,
    12: 20,
    13: 35,
    14: 27,
    15: 20,
    16: 24,
    17: 28,
    18: 78,
  };

  const chapter = Math.floor(Math.random() * 18) + 1;
  const verse = Math.floor(Math.random() * chaptersVerses[chapter]) + 1;

  return { chapter, verse };
}

// Function to fetch a random Gita quote from the API
function fetchRandomGitaQuote() {
  const { chapter, verse } = getRandomChapterVerse();

  // Add a small delay to avoid rapid API calls
  setTimeout(() => {
    fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Fetched Chapter ${chapter}, Verse ${verse}:`, data);

        // The API returns various commentary authors with Hindi translations
        let hindiText = "";
        let englishText = "";

        // Try to get Hindi translation from different commentators
        if (data.tej && data.tej.ht) {
          hindiText = data.tej.ht;
        } else if (data.rams && data.rams.ht) {
          hindiText = data.rams.ht;
        } else if (data.chinmay && data.chinmay.hc) {
          hindiText = data.chinmay.hc;
        } else if (data.siva && data.siva.ht) {
          hindiText = data.siva.ht;
        }

        // Get English translation from Swami Sivananda
        if (data.siva && data.siva.et) {
          englishText = data.siva.et;
        } else if (data.chinmay && data.chinmay.ec) {
          englishText = data.chinmay.ec;
        } else if (data.ms && data.ms.et) {
          englishText = data.ms.et;
        }

        // Fallback if no translations found
        if (!hindiText) {
          hindiText = `अध्याय ${chapter}, श्लोक ${verse} - हिंदी अनुवाद उपलब्ध नहीं है।`;
        }
        if (!englishText) {
          englishText = `Chapter ${chapter}, Verse ${verse} - English translation not available.`;
        }

        // Clean up the text by removing verse numbers and extra formatting
        const cleanSlok = data.slok.replace(/\|\|.*?\|\|/g, "").trim();
        const cleanHindi = hindiText.replace(/।।.*?।।/g, "").trim();
        const cleanEnglish = englishText.replace(/\|\|.*?\|\|/g, "").trim();

        // Display the Sanskrit verse, Hindi translation, and English translation
        document.getElementById("gita-quote").textContent = `"${cleanSlok}"`;
        document.getElementById("gita-explanation").innerHTML = `
          <div class="gita-hindi">${cleanHindi}</div>
          <div class="gita-english">${cleanEnglish}</div>
        `;
      })
      .catch((error) => {
        console.error("API Error:", error);
        // Try a different verse if this one fails
        const fallbackQuotes = [
          {
            slok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।",
            hindi: "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। न तो कर्म के फल का कारण बनो और न ही कर्म न करने की आसक्ति रखो।",
            english: "You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results, nor be attached to not doing your duty."
          },
          {
            slok: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते।।",
            hindi: "हे अर्जुन! आसक्ति को त्यागकर और सिद्धि-असिद्धि में समान भाव रखकर योग में स्थित होकर कर्म करो।",
            english: "O Arjuna, perform your duty equipoised, abandoning all attachment to success or failure. Such equanimity is called yoga."
          },
          {
            slok: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्।।",
            hindi: "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अवतार लेता हूँ।",
            english: "Whenever there is decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth."
          },
        ];

        const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        document.getElementById("gita-quote").textContent = `"${randomFallback.slok}"`;
        document.getElementById("gita-explanation").innerHTML = `
          <div class="gita-hindi">${randomFallback.hindi}</div>
          <div class="gita-english">${randomFallback.english}</div>
        `;
      });
  }, 100); // Small delay to avoid rapid calls
}

/* ==== Theme selector & helper overlay (minimal) ==== */
(function(){
  function safe(id){return document.getElementById(id)}
  const root = document.documentElement;
  const themeDots = safe('theme-dots');
  const saved = localStorage.getItem('theme') || 'light';
  function applyTheme(t){
    if(t === 'light') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    document.querySelectorAll('.theme-dot').forEach(d=> d.classList.toggle('selected', d.dataset.theme===t));
  }
  // apply saved theme on load
  try{ applyTheme(saved); }catch(e){/*silent*/}
  if(themeDots){
    // Keep old bulk handler for backward compatibility (not visible) but also wire the new palette
    themeDots.addEventListener('click', (e)=>{
      const dot = e.target.closest('.theme-dot'); if(!dot) return; applyTheme(dot.dataset.theme);
    });
  }

  // New: theme mini-palette behavior
  const palette = document.getElementById('theme-palette');
  const paletteRow = document.getElementById('palette-row');
  const currentBtn = document.getElementById('current-theme-btn');
  function setCurrentCircle(theme){
    // find the dot style and copy its background into the current button
    const match = paletteRow.querySelector(`.theme-dot[data-theme="${theme}"]`);
    if(match){
      const bg = window.getComputedStyle(match).background;
      currentBtn.style.background = bg;
      // mark selected inside palette
      paletteRow.querySelectorAll('.theme-dot').forEach(d=> d.classList.toggle('selected', d.dataset.theme===theme));
    }
  }

  if(palette && paletteRow && currentBtn){
    // Show saved theme on the current button
    setCurrentCircle(localStorage.getItem('theme') || 'light');

    currentBtn.addEventListener('click', (e)=>{
      const opened = paletteRow.getAttribute('aria-hidden') === 'false';
      paletteRow.setAttribute('aria-hidden', opened ? 'true' : 'false');
      currentBtn.setAttribute('aria-expanded', opened ? 'false' : 'true');
      // move focus into first dot when opening
      if(!opened){
        const first = paletteRow.querySelector('.theme-dot'); if(first) first.focus();
      }
    });

    // Click on a palette dot
    paletteRow.addEventListener('click', (e)=>{
      const dot = e.target.closest('.theme-dot'); if(!dot) return;
      const t = dot.dataset.theme; applyTheme(t); setCurrentCircle(t);
      paletteRow.setAttribute('aria-hidden','true');
      currentBtn.setAttribute('aria-expanded','false');
      currentBtn.focus();
    });

    // Close palette on outside click
    document.addEventListener('click', (e)=>{
      if(!palette.contains(e.target)){
        paletteRow.setAttribute('aria-hidden','true');
      }
    });

    // Keyboard interactions: Enter/Space to toggle, ArrowLeft/ArrowRight to navigate, Escape to close
    currentBtn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); currentBtn.click(); }
      else if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        // open then focus first if not open
        const opened = paletteRow.getAttribute('aria-hidden') === 'false';
        if(!opened){ currentBtn.click(); }
      }
    });

    paletteRow.addEventListener('keydown', (e)=>{
      const dots = Array.from(paletteRow.querySelectorAll('.theme-dot'));
      const idx = dots.indexOf(document.activeElement);
      if(e.key === 'ArrowRight'){
        e.preventDefault(); const next = dots[(idx+1) % dots.length]; if(next) next.focus();
      } else if(e.key === 'ArrowLeft'){
        e.preventDefault(); const prev = dots[(idx-1 + dots.length) % dots.length]; if(prev) prev.focus();
      } else if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); const el = document.activeElement; if(el && el.classList.contains('theme-dot')){ el.click(); }
      } else if(e.key === 'Escape'){
        paletteRow.setAttribute('aria-hidden','true'); currentBtn.setAttribute('aria-expanded','false'); currentBtn.focus();
      }
    });
  }

  // helper toggle: start the tour directly when the helper button is clicked
  const helperToggle = safe('helper-toggle');
  if (helperToggle) {
    helperToggle.addEventListener('click', () => {
      // start the guided tour
      if (typeof startTour === 'function') startTour();
    });
  }

  // Guided tour
  const startTourBtn = safe('start-tour');
  const tourSteps = [
    { sel: '.todo-widget', title: "Today's Goals", text: 'Add up to 5 goals. Check them off as you progress.' },
    { sel: '.search-container', title: 'Search', text: 'The search bar is centered in the header — type queries here or press Enter to search.' },
    { sel: '#theme-palette', title: 'Theme Switcher', text: 'Click the small circle to open a mini-palette of themes and change the look quickly.' },
    { sel: '.center-quote', title: 'Daily Wisdom', text: 'A Bhagavad Gita quote appears here to reflect on.' },
    { sel: '.quick-links', title: 'Quick Links', text: 'Your most-used sites live here for quick access.' },
    { sel: '.progress-widget', title: 'Progress', text: 'Shows how many goals you have completed today.' },
    { sel: '.clock-widget', title: 'Time & Date', text: 'Current time and date are shown here.' }
  ];

  function createTourElements(){
    let overlay = document.createElement('div'); overlay.className='tour-overlay';
    let highlight = document.createElement('div'); highlight.className='tour-highlight';
    let tooltip = document.createElement('div'); tooltip.className='tour-tooltip';
    tooltip.innerHTML = '<div class="tour-content"></div><div class="tour-controls"><button class="prev">Prev</button><button class="next">Next</button><button class="close">Close</button></div>';
    // enforce strong contrast for tooltip background so tour text is readable in all themes
    tooltip.style.background = 'rgba(0,0,0,0.75)';
    tooltip.style.color = 'white';
    overlay.appendChild(highlight); overlay.appendChild(tooltip); document.body.appendChild(overlay);
    return {overlay, highlight, tooltip};
  }

  function startTour(){
    if(!document.body.querySelector('.tour-overlay')) var els = createTourElements();
    const overlay = document.querySelector('.tour-overlay');
    const highlight = overlay.querySelector('.tour-highlight');
    const tooltip = overlay.querySelector('.tour-tooltip');
    let idx = 0;
    function showStep(i){
      const step = tourSteps[i];
      const target = document.querySelector(step.sel);
      if(!target) return;
      // If this step is the theme palette, open the palette so it is visible to the user.
      try{
        if(step.sel === '#theme-palette' && palette && paletteRow && currentBtn){
          paletteRow.setAttribute('aria-hidden','false');
          currentBtn.setAttribute('aria-expanded','true');
          // ensure the palette shows up before computing bounds
        } else if(palette && paletteRow && currentBtn){
          // close the palette for other steps to avoid accidental overlap
          paletteRow.setAttribute('aria-hidden','true');
          currentBtn.setAttribute('aria-expanded','false');
        }
      }catch(e){/*ignore*/}
      const rect = target.getBoundingClientRect();
      // position highlight
      highlight.style.top = (rect.top - 8) + 'px';
      highlight.style.left = (rect.left - 8) + 'px';
      highlight.style.width = (rect.width + 16) + 'px';
      highlight.style.height = (rect.height + 16) + 'px';
      // set tooltip content and position to the right or below
      tooltip.querySelector('.tour-content').innerHTML = `<strong>${step.title}</strong><div style="margin-top:6px;color:var(--muted);">${step.text}</div>`;
      // if this is the theme palette step, visually highlight the palette
      try{
        if(step.sel === '#theme-palette' && palette){
          palette.classList.add('highlighted');
          if(typeof helperToggle !== 'undefined' && helperToggle) helperToggle.classList.add('active');
        } else if(palette){
          palette.classList.remove('highlighted');
          if(typeof helperToggle !== 'undefined' && helperToggle) helperToggle.classList.remove('active');
        }
      }catch(e){/*ignore*/}
      // prefer right side
      let ttTop = rect.top;
      let ttLeft = rect.right + 12;
      if(ttLeft + 280 > window.innerWidth) { ttLeft = rect.left; ttTop = rect.bottom + 12; }
      tooltip.style.top = ttTop + 'px'; tooltip.style.left = ttLeft + 'px';
      // update controls
      tooltip.querySelector('.prev').disabled = i===0;
      tooltip.querySelector('.next').textContent = i === tourSteps.length-1 ? 'Finish' : 'Next';
    }
    overlay.style.display = 'block';
    showStep(idx);
    // Use event delegation for controls in case elements are recreated
    function onControlClick(e){
      const btn = e.target.closest('button'); if(!btn) return;
      if(btn.classList.contains('next')){
        idx++;
        if(idx >= tourSteps.length){
          overlay.style.display='none'; document.removeEventListener('click', onControlClick);
          // remove any highlights
          try{ if(palette) palette.classList.remove('highlighted'); if(helperToggle) helperToggle.classList.remove('active'); }catch(e){}
        } else showStep(idx);
      }
      else if(btn.classList.contains('prev')){ if(idx>0){ idx--; showStep(idx); } }
      else if(btn.classList.contains('close')){ overlay.style.display='none'; document.removeEventListener('click', onControlClick);
        try{ if(palette) palette.classList.remove('highlighted'); if(helperToggle) helperToggle.classList.remove('active'); }catch(e){}
      }
    }
    document.addEventListener('click', onControlClick);
  }

  if(startTourBtn) startTourBtn.addEventListener('click', ()=>{ startTour(); });
})();

// Refresh quote every 30 seconds
setInterval(fetchRandomGitaQuote, 30000);
