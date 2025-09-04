// Dashboard functionality

// Initialize dashboard when page loads
window.addEventListener('DOMContentLoaded', function() {
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
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-date').textContent = dateString;
}

// Goals Management System
let goals = [];
let goalIdCounter = 1;

// Goals and progress tracking
function setupEventListeners() {
    // Add goal button
    document.getElementById('add-goal-btn').addEventListener('click', addNewGoal);
    
    // Search functionality
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
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
        text: '',
        completed: false
    };
    
    console.log(`Adding new goal with ID: ${newGoal.id}`);
    goals.push(newGoal);
    
    // Only re-render goals, don't affect existing ones
    renderGoals();
    saveGoalsState();
    
    // Focus on the new goal input
    setTimeout(() => {
        const newInput = document.querySelector(`[data-goal-id="${newGoal.id}"] .goal-input`);
        if (newInput) {
            newInput.focus();
        }
    }, 50);
}

function removeGoal(goalId) {
    goals = goals.filter(goal => goal.id !== goalId);
    renderGoals();
    updateProgressDisplay();
    saveGoalsState();
}

function toggleGoal(goalId) {
    console.log(`Toggle goal called for ID: ${goalId}`);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = !goal.completed;
        console.log(`Goal ${goalId} is now ${goal.completed ? 'completed' : 'incomplete'}`);
        
        // Update only the specific goal item instead of re-rendering everything
        updateSingleGoalDisplay(goalId);
        updateProgressDisplay();
        saveGoalsState();
    } else {
        console.error(`Goal with ID ${goalId} not found`);
    }
}

function updateSingleGoalDisplay(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const goalItem = document.querySelector(`[data-goal-id="${goalId}"]`);
    if (!goalItem) return;
    
    const checkbox = goalItem.querySelector('.goal-checkbox');
    const textInput = goalItem.querySelector('.goal-input');
    const progressIndicator = goalItem.querySelector('.goal-progress');
    
    // Update checkbox
    checkbox.checked = goal.completed;
    
    // Update classes
    goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
    textInput.className = `goal-input ${goal.completed ? 'completed' : ''}`;
    progressIndicator.className = `goal-progress ${goal.completed ? 'completed' : ''}`;
    
    // Update progress indicator
    progressIndicator.textContent = goal.completed ? '✓' : '○';
}

function updateGoalText(goalId, text) {
    const goal = goals.find(g => g.id === goalId);
    if (goal && goal.text !== text) {
        goal.text = text;
        console.log(`Updated goal ${goalId} text to: "${text}"`);
        saveGoalsState();
        // Don't re-render here to avoid losing focus/selection
    }
}

function updateProgressDisplay() {
    // Only count goals that have text content
    const goalsWithText = goals.filter(g => g.text && g.text.trim() !== '');
    const completedGoals = goalsWithText.filter(g => g.completed).length;
    const totalGoals = goalsWithText.length;
    const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Get progress widget element
    const progressWidget = document.querySelector('.progress-widget');
    
    // Hide progress widget if no goals with text
    if (totalGoals === 0) {
        if (progressWidget) {
            progressWidget.style.display = 'none';
        }
        return;
    } else {
        if (progressWidget) {
            progressWidget.style.display = 'block';
        }
    }
    
    // Update stats
    const goalsCompletedEl = document.getElementById('goals-completed');
    const progressPercentageEl = document.getElementById('progress-percentage');
    
    if (goalsCompletedEl) {
        goalsCompletedEl.textContent = `${completedGoals}/${totalGoals}`;
    }
    
    if (progressPercentageEl) {
        progressPercentageEl.textContent = `${percentage}%`;
    }
    
    // Update progress circle
    const circle = document.getElementById('progress-circle-fill');
    if (circle) {
        const circumference = 188.5; // 2 * π * 30
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        
        // Add smooth transition
        circle.style.transition = 'stroke-dashoffset 0.5s ease';
    }
}

function renderGoals() {
    const container = document.getElementById('goals-container');
    
    if (goals.length === 0) {
        container.innerHTML = '<div class="goals-empty">No goals yet. Click "Add Goal" to start!</div>';
        document.getElementById('add-goal-btn').disabled = false;
        updateProgressDisplay();
        return;
    }
    
    // Clear container first
    container.innerHTML = '';
    
    // Create goals one by one to ensure proper event handling
    goals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        goalItem.setAttribute('data-goal-id', goal.id);
        
        goalItem.innerHTML = `
            <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''}>
            <input type="text" class="goal-input ${goal.completed ? 'completed' : ''}" 
                   value="${escapeHtml(goal.text)}" placeholder="Enter your goal...">
            <div class="goal-progress ${goal.completed ? 'completed' : ''}">
                ${goal.completed ? '✓' : '○'}
            </div>
            <button class="remove-goal-btn" title="Remove goal">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add proper event listeners
        const checkbox = goalItem.querySelector('.goal-checkbox');
        const textInput = goalItem.querySelector('.goal-input');
        const removeBtn = goalItem.querySelector('.remove-goal-btn');
        
        checkbox.addEventListener('change', () => {
            console.log(`Toggling goal ${goal.id}: ${checkbox.checked}`);
            toggleGoal(goal.id);
        });
        
        textInput.addEventListener('input', () => {
            updateGoalText(goal.id, textInput.value);
        });
        
        textInput.addEventListener('blur', () => {
            updateGoalText(goal.id, textInput.value);
        });
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Save the current goal text
                updateGoalText(goal.id, textInput.value);
                
                // If this goal has text and we're under the limit, create a new goal
                if (textInput.value.trim() !== '' && goals.length < 5) {
                    addNewGoal();
                } else {
                    textInput.blur();
                }
            }
        });
        
        removeBtn.addEventListener('click', () => {
            removeGoal(goal.id);
        });
        
        container.appendChild(goalItem);
    });
    
    // Update add button state
    const addBtn = document.getElementById('add-goal-btn');
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveGoalsState() {
    const goalsState = {
        goals: goals,
        goalIdCounter: goalIdCounter,
        date: new Date().toDateString()
    };
    localStorage.setItem('dailyGoals', JSON.stringify(goalsState));
}

function loadGoalsState() {
    const saved = localStorage.getItem('dailyGoals');
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
    const query = document.getElementById('search-bar').value.trim();
    if (query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
        document.getElementById('search-bar').value = '';
    }
}

// Daily reminder functionality
function updateDailyReminder() {
    const reminders = [
        "Don't forget to commit on GitHub today!",
        "Remember to practice DSA problems daily.",
        "Stay hydrated and take breaks while coding.",
        "Push your progress to GitHub before bed.",
        "Learn something new today!",
        "Review your code and refactor if needed.",
        "Document your learnings in a journal."
    ];
    
    const today = new Date().getDay();
    const reminder = reminders[today % reminders.length];
    document.getElementById('daily-reminder-text').textContent = `"${reminder}"`;
}

// Floating particles animation
function createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'rgba(255, 255, 255, 0.4)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${4 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
    }
}

// Function to get random chapter and verse numbers
function getRandomChapterVerse() {
    // Bhagavad Gita has 18 chapters with varying number of verses
    const chaptersVerses = {
        1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28, 
        9: 34, 10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 
        16: 24, 17: 28, 18: 78
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Fetched Chapter ${chapter}, Verse ${verse}:`, data);
                
                // The API returns various commentary authors with Hindi translations
                let hindiText = '';
                
                // Try to get Hindi translation from different commentators
                if (data.rams && data.rams.ht) {
                    hindiText = data.rams.ht;
                } else if (data.tej && data.tej.ht) {
                    hindiText = data.tej.ht;
                } else if (data.chinmay && data.chinmay.hc) {
                    hindiText = data.chinmay.hc;
                } else if (data.siva && data.siva.et) {
                    hindiText = data.siva.et; // English translation as fallback
                } else {
                    hindiText = `अध्याय ${chapter}, श्लोक ${verse} - हिंदी अनुवाद उपलब्ध नहीं है।`;
                }
                
                // Clean up the text by removing verse numbers and extra formatting
                const cleanSlok = data.slok.replace(/\|\|.*?\|\|/g, '').trim();
                const cleanHindi = hindiText.replace(/।।.*?।।/g, '').trim();
                
                // Display the Sanskrit verse and Hindi translation
                document.getElementById("gita-quote").textContent = `"${cleanSlok}"`;
                document.getElementById("gita-explanation").textContent = cleanHindi;
            })
            .catch((error) => {
                console.error('API Error:', error);
                // Try a different verse if this one fails
                const fallbackQuotes = [
                    {
                        slok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।",
                        hindi: "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। न तो कर्म के फल का कारण बनो और न ही कर्म न करने की आसक्ति रखो।"
                    },
                    {
                        slok: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते।।",
                        hindi: "हे अर्जुन! आसक्ति को त्यागकर और सिद्धि-असिद्धि में समान भाव रखकर योग में स्थित होकर कर्म करो।"
                    },
                    {
                        slok: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्।।",
                        hindi: "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अवतार लेता हूँ।"
                    }
                ];
                
                const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
                document.getElementById("gita-quote").textContent = `"${randomFallback.slok}"`;
                document.getElementById("gita-explanation").textContent = randomFallback.hindi;
            });
    }, 100); // Small delay to avoid rapid calls
}

// Refresh quote every 30 seconds
setInterval(fetchRandomGitaQuote, 30000);