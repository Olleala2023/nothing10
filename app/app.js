// 10 Minutes of Nothing - PWA Timer App

class NothingTimer {
  constructor() {
    this.currentDuration = 10; // minutes
    this.currentMode = 'hidden';
    this.isRunning = false;
    this.timeLeft = 0; // seconds
    this.intervalId = null;
    this.phrases = [
      "10 minutes of nothing",
      "I'm doing nothing for 10 minutes",
      "I'm taking a break from everything for 10 minutes",
      "Pause. Only silence and breath",
      "Not touching anything for 10 minutes",
      "Right now, I'm not rushing anywhere"
    ];
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadSettings();
    this.loadStats();
    this.showPhrase();
    this.updateStatsDisplay();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/app/sw.js');
    }
  }

  setupElements() {
    // Screens
    this.welcomeScreen = document.getElementById('welcome-screen');
    this.timerScreen = document.getElementById('timer-screen');
    this.completionScreen = document.getElementById('completion-screen');
    
    // Welcome screen elements
    this.phraseEl = document.getElementById('phrase');
    this.durationBtns = document.querySelectorAll('.duration-btn');
    this.modeBtns = document.querySelectorAll('.mode-btn');
    this.customDuration = document.getElementById('custom-duration');
    this.customMinutes = document.getElementById('custom-minutes');
    this.setCustomBtn = document.getElementById('set-custom');
    this.startBtn = document.getElementById('start-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Timer screen elements
    this.timerDisplay = document.getElementById('timer-display');
    this.minutesEl = document.getElementById('minutes');
    this.secondsEl = document.getElementById('seconds');
    this.dotDisplay = document.getElementById('dot-display');
    this.touchHint = document.getElementById('touch-hint');
    
    // Completion screen elements
    this.anotherBtn = document.getElementById('another-btn');
    this.exitBtn = document.getElementById('exit-btn');
    
    // Stats elements
    this.statsBtn = document.getElementById('stats-btn');
    this.statsModal = document.getElementById('stats-modal');
    this.closeStatsBtn = document.getElementById('close-stats');
    this.completedSessionsEl = document.getElementById('completed-sessions');
    this.totalMinutesEl = document.getElementById('total-minutes');
    this.streakDaysEl = document.getElementById('streak-days');
  }

  setupEventListeners() {
    // Duration selection
    this.durationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectDuration(e.target.dataset.duration);
      });
    });

    // Mode selection
    this.modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectMode(e.target.dataset.mode);
      });
    });

    // Custom duration
    this.setCustomBtn.addEventListener('click', () => {
      const minutes = parseInt(this.customMinutes.value);
      if (minutes >= 1 && minutes <= 60) {
        this.currentDuration = minutes;
        this.updateStartButton();
        this.customDuration.classList.add('hidden');
      }
    });

    // Start timer
    this.startBtn.addEventListener('click', () => {
      this.startTimer();
    });

    // Fullscreen
    this.fullscreenBtn.addEventListener('click', () => {
      this.enterFullscreen();
    });

    // Timer screen touch/mouse movement
    this.timerScreen.addEventListener('click', () => {
      if (this.isRunning) {
        this.resetTimer();
      }
    });

    // Reset on mouse movement (with debounce)
    let mouseMoveTimeout;
    this.timerScreen.addEventListener('mousemove', () => {
      if (this.isRunning) {
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
          console.log('Timer reset by mouse movement');
          this.resetTimer();
        }, 500); // 500ms debounce - more forgiving
      }
    });

    // Reset on touch (mobile)
    this.timerScreen.addEventListener('touchstart', () => {
      if (this.isRunning) {
        this.resetTimer();
      }
    });

    // Completion screen buttons
    this.anotherBtn.addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    this.exitBtn.addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    // Stats
    this.statsBtn.addEventListener('click', () => {
      this.showStats();
    });

    this.closeStatsBtn.addEventListener('click', () => {
      this.hideStats();
    });

    // Close modal on background click
    this.statsModal.addEventListener('click', (e) => {
      if (e.target === this.statsModal) {
        this.hideStats();
      }
    });

    // Reset timer when window loses focus (user switches to another app)
    window.addEventListener('blur', () => {
      if (this.isRunning) {
        console.log('Timer reset by window blur');
        this.resetTimer();
      }
    });

    // Reset timer when user returns to tab (indicates they were doing something else)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning) {
        console.log('Timer reset by visibility change');
        this.resetTimer();
      }
    });
  }

  selectDuration(duration) {
    this.durationBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-duration="${duration}"]`).classList.add('active');
    
    if (duration === 'custom') {
      this.customDuration.classList.remove('hidden');
      this.customMinutes.focus();
    } else {
      this.customDuration.classList.add('hidden');
      this.currentDuration = parseInt(duration);
      this.updateStartButton();
    }
  }

  selectMode(mode) {
    this.modeBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    this.currentMode = mode;
    
    // Show description for selected mode
    document.querySelectorAll('.mode-desc').forEach(desc => {
      desc.classList.remove('active');
    });
    document.querySelector(`.mode-desc[data-mode="${mode}"]`).classList.add('active');
  }

  updateStartButton() {
    this.startBtn.textContent = `Start ${this.currentDuration} Minutes`;
  }

  showPhrase() {
    const bucket = this.getPhraseBucket();
    const phrase = this.phrases[bucket];
    this.phraseEl.textContent = phrase;
    
    // Hide phrase after 3 seconds
    setTimeout(() => {
      this.phraseEl.style.opacity = '0';
    }, 3000);
  }

  showPhraseOnTimer() {
    const bucket = this.getPhraseBucket();
    const phrase = this.phrases[bucket];
    
    // Create phrase element for timer screen
    let timerPhrase = document.getElementById('timer-phrase');
    if (!timerPhrase) {
      timerPhrase = document.createElement('div');
      timerPhrase.id = 'timer-phrase';
      timerPhrase.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: #ffffff;
        opacity: 0.8;
        text-align: center;
        z-index: 1000;
        pointer-events: none;
        transition: opacity 0.5s ease;
      `;
      document.body.appendChild(timerPhrase);
    }
    
    timerPhrase.textContent = phrase;
    timerPhrase.style.opacity = '0.8';
    
    // Keep phrase visible throughout the timer
  }

  getPhraseBucket() {
    let bucket = localStorage.getItem('phraseBucket');
    if (!bucket) {
      bucket = Math.floor(Math.random() * this.phrases.length);
      localStorage.setItem('phraseBucket', bucket);
    }
    return parseInt(bucket);
  }

  startTimer() {
    this.timeLeft = this.currentDuration * 60;
    this.isRunning = true;
    this.showTimerScreen();
    this.updateTimerDisplay();
    
    // Show phrase on timer screen for 3 seconds
    this.showPhraseOnTimer();
    
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      if (this.timeLeft <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }

  resetTimer() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.showTouchHint();
    this.startTimer();
  }

  showTouchHint() {
    this.touchHint.classList.remove('hidden');
    setTimeout(() => {
      this.touchHint.classList.add('hidden');
    }, 300);
  }

  showTimerScreen() {
    this.hideAllScreens();
    this.timerScreen.classList.add('active');
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    
    this.minutesEl.textContent = minutes.toString().padStart(2, '0');
    this.secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    // Update display based on mode
    this.timerDisplay.classList.remove('hidden', 'ghost');
    this.dotDisplay.classList.add('hidden');
    
    switch (this.currentMode) {
      case 'hidden':
        this.timerDisplay.classList.add('hidden');
        break;
      case 'ghost':
        this.timerDisplay.classList.add('ghost');
        break;
      case 'dot':
        this.timerDisplay.classList.add('hidden');
        this.dotDisplay.classList.remove('hidden');
        break;
    }
  }

  completeTimer() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.updateStats();
    this.showCompletionScreen();
  }

  showCompletionScreen() {
    this.hideAllScreens();
    this.completionScreen.classList.add('active');
  }

  showWelcomeScreen() {
    this.hideAllScreens();
    this.welcomeScreen.classList.add('active');
    this.showPhrase();
    this.updateStartButton();
  }

  hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
  }

  enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
    
    // Hide fullscreen button after first use
    localStorage.setItem('fullscreenUsed', 'true');
    this.fullscreenBtn.style.display = 'none';
  }

  // Statistics
  loadStats() {
    this.stats = {
      completedSessions: parseInt(localStorage.getItem('completedSessions') || '0'),
      totalMinutesWeek: parseInt(localStorage.getItem('totalMinutesWeek') || '0'),
      streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
      lastSessionDate: localStorage.getItem('lastSessionDate') || ''
    };
  }

  updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.stats.lastSessionDate;
    
    // Update completed sessions
    this.stats.completedSessions++;
    localStorage.setItem('completedSessions', this.stats.completedSessions);
    
    // Update weekly minutes
    this.stats.totalMinutesWeek += this.currentDuration;
    localStorage.setItem('totalMinutesWeek', this.stats.totalMinutesWeek);
    
    // Update streak
    if (lastDate === today) {
      // Already counted today
    } else if (lastDate === this.getYesterday()) {
      // Consecutive day
      this.stats.streakDays++;
    } else {
      // Streak broken
      this.stats.streakDays = 1;
    }
    
    this.stats.lastSessionDate = today;
    localStorage.setItem('streakDays', this.stats.streakDays);
    localStorage.setItem('lastSessionDate', today);
    
    this.updateStatsDisplay();
  }

  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  updateStatsDisplay() {
    this.completedSessionsEl.textContent = this.stats.completedSessions;
    this.totalMinutesEl.textContent = this.stats.totalMinutesWeek;
    this.streakDaysEl.textContent = this.stats.streakDays;
  }

  showStats() {
    this.statsModal.classList.remove('hidden');
  }

  hideStats() {
    this.statsModal.classList.add('hidden');
  }

  loadSettings() {
    // Load saved settings
    const savedDuration = localStorage.getItem('duration');
    if (savedDuration) {
      this.currentDuration = parseInt(savedDuration);
      this.selectDuration(savedDuration);
    }
    
    const savedMode = localStorage.getItem('displayMode');
    if (savedMode) {
      this.currentMode = savedMode;
      this.selectMode(savedMode);
    }
    
    // Check if fullscreen was used before
    if (localStorage.getItem('fullscreenUsed') === 'true') {
      this.fullscreenBtn.style.display = 'none';
    }
  }

  saveSettings() {
    localStorage.setItem('duration', this.currentDuration);
    localStorage.setItem('displayMode', this.currentMode);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NothingTimer();
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && window.nothingTimer && window.nothingTimer.isRunning) {
    // Optional: pause timer when tab is hidden
    // For now, we'll let it continue running
  }
});
