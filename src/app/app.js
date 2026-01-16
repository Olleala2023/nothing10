// 10 Minutes of Nothing - PWA Timer App

import './style.css';

class NothingTimer {
  constructor() {
    this.currentDuration = 10; // minutes
    this.currentMode = 'hidden';
    this.isRunning = false;
    this.timeLeft = 0; // seconds
    this.intervalId = null;
    this.phrases = [];
    
    // Phrases will be set dynamically based on duration
    this.updatePhrases();
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadSettings();
    this.loadStats();
    this.updateStartButton(); // Initialize button text with current duration
    this.showPhrase();
    this.updateStatsDisplay();
    
    // Show description for default/active mode if not loaded from settings
    if (!localStorage.getItem('displayMode')) {
      this.selectMode(this.currentMode);
    }
    
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
    this.completionDuration = document.getElementById('completion-duration');
    this.reflectionText = document.getElementById('reflection-text');
    this.saveReflectionBtn = document.getElementById('save-reflection');
    this.donationSection = document.querySelector('.donation-section');
    this.shareTwitterBtn = document.getElementById('share-twitter-btn');
    this.copyLinkBtn = document.getElementById('copy-link-btn');
    
    // Stats elements
    this.statsBtn = document.getElementById('stats-btn');
    this.statsModal = document.getElementById('stats-modal');
    this.closeStatsBtn = document.getElementById('close-stats');
    this.completedSessionsEl = document.getElementById('completed-sessions');
    this.totalMinutesEl = document.getElementById('total-minutes');
    this.streakDaysEl = document.getElementById('streak-days');
    this.reflectionsList = document.getElementById('reflections-list');
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
      
      // Show description on hover (hide active one if hovering non-active button)
      btn.addEventListener('mouseenter', (e) => {
        const mode = e.target.dataset.mode;
        const desc = document.querySelector(`.mode-desc[data-mode="${mode}"]`);
        if (desc && !desc.classList.contains('active')) {
          // Hide active description
          const activeDesc = document.querySelector('.mode-desc.active');
          if (activeDesc) {
            activeDesc.classList.add('hidden-on-hover');
          }
          // Show hover description
          desc.classList.add('hover');
        }
      });
      
      btn.addEventListener('mouseleave', (e) => {
        const mode = e.target.dataset.mode;
        const desc = document.querySelector(`.mode-desc[data-mode="${mode}"]`);
        if (desc && !desc.classList.contains('active')) {
          // Hide hover description
          desc.classList.remove('hover');
          // Show active description again
          const activeDesc = document.querySelector('.mode-desc.active');
          if (activeDesc) {
            activeDesc.classList.remove('hidden-on-hover');
          }
        }
      });
    });

    // Custom duration
    this.setCustomBtn.addEventListener('click', () => {
      const minutes = parseInt(this.customMinutes.value);
      if (minutes >= 1 && minutes <= 60) {
        this.currentDuration = minutes;
        this.updateStartButton(); // This already calls updatePhrases()
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

    // Save reflection
    this.saveReflectionBtn.addEventListener('click', () => {
      this.saveReflection();
    });

    // Allow Enter+Ctrl/Cmd to save reflection
    if (this.reflectionText) {
      this.reflectionText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.saveReflection();
        }
      });
    }

    // Share buttons
    if (this.shareTwitterBtn) {
      this.shareTwitterBtn.addEventListener('click', () => {
        this.shareToTwitter();
      });
    }

    if (this.copyLinkBtn) {
      this.copyLinkBtn.addEventListener('click', () => {
        this.copyLink();
      });
    }

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
      this.updateStartButton(); // This calls updatePhrases() which updates the displayed phrase
    }
  }

  selectMode(mode) {
    this.modeBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    this.currentMode = mode;
    
    // Show description for selected mode
    document.querySelectorAll('.mode-desc').forEach(desc => {
      desc.classList.remove('active', 'hover');
    });
    const activeDesc = document.querySelector(`.mode-desc[data-mode="${mode}"]`);
    if (activeDesc) {
      activeDesc.classList.add('active');
    }
  }

  updateStartButton() {
    const minutesText = this.currentDuration === 1 ? 'Minute' : 'Minutes';
    this.startBtn.textContent = `Start ${this.currentDuration} ${minutesText}`;
    this.updatePhrases();
    // Update phrase if welcome screen is visible
    if (this.welcomeScreen && this.welcomeScreen.classList.contains('active')) {
      this.showPhrase();
    }
  }

  updatePhrases() {
    const duration = this.currentDuration;
    this.phrases = [
      `${duration} minutes of nothing`,
      `I'm doing nothing for ${duration} minutes`,
      `I'm taking a break from everything for ${duration} minutes`,
      "Pause. Only silence and breath",
      `Not touching anything for ${duration} minutes`,
      "Right now, I'm not rushing anywhere"
    ];
  }

  showPhrase() {
    const bucket = this.getPhraseBucket();
    const phrase = this.phrases[bucket];
    this.phraseEl.textContent = phrase;
    // Keep phrase visible - no timeout
    this.phraseEl.style.opacity = '0.8';
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
    }, 2500);
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
    
    // Clean up timer phrase element
    const timerPhrase = document.getElementById('timer-phrase');
    if (timerPhrase) {
      timerPhrase.remove();
    }
    
    this.showCompletionScreen();
  }

  showCompletionScreen() {
    this.hideAllScreens();
    this.completionScreen.classList.add('active');
    if (this.completionDuration) {
      this.completionDuration.textContent = ` ${this.currentDuration} `;
    }
    // Clear reflection textarea
    if (this.reflectionText) {
      this.reflectionText.value = '';
    }
    // Show donation buttons with delay
    this.showDonationButtons();
  }

  showWelcomeScreen() {
    this.hideAllScreens();
    this.welcomeScreen.classList.add('active');
    this.showPhrase();
    this.updateStartButton();
    
    // Hide donation section when returning to welcome screen
    if (this.donationSection) {
      this.donationSection.classList.remove('show');
    }
    
    // Clean up any timer phrase element that might be left over
    const timerPhrase = document.getElementById('timer-phrase');
    if (timerPhrase) {
      timerPhrase.remove();
    }
    
    // Reset button states to ensure proper styling
    this.durationBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    this.modeBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Re-apply active states based on current settings
    const activeDurationBtn = document.querySelector(`[data-duration="${this.currentDuration}"]`);
    if (activeDurationBtn) {
      activeDurationBtn.classList.add('active');
    }
    
    const activeModeBtn = document.querySelector(`[data-mode="${this.currentMode}"]`);
    if (activeModeBtn) {
      activeModeBtn.classList.add('active');
    }
    
    // Show mode description for current mode
    document.querySelectorAll('.mode-desc').forEach(desc => {
      desc.classList.remove('active');
    });
    const activeModeDesc = document.querySelector(`.mode-desc[data-mode="${this.currentMode}"]`);
    if (activeModeDesc) {
      activeModeDesc.classList.add('active');
    }
    
    // Reset any ongoing animations by forcing a reflow
    this.welcomeScreen.offsetHeight;
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
    this.loadReflections();
  }

  hideStats() {
    this.statsModal.classList.add('hidden');
  }

  saveReflection() {
    const text = this.reflectionText.value.trim();
    if (!text) return;

    const reflection = {
      text: text,
      date: new Date().toISOString(),
      duration: this.currentDuration
    };

    let reflections = this.loadAllReflections();
    reflections.unshift(reflection); // Add to beginning
    reflections = reflections.slice(0, 50); // Keep only last 50

    localStorage.setItem('reflections', JSON.stringify(reflections));
    
    // Clear textarea
    this.reflectionText.value = '';
    
    // Show success feedback
    const saveBtn = this.saveReflectionBtn;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.opacity = '0.7';
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.opacity = '1';
    }, 1500);

    // Update reflections list if modal is open
    if (!this.statsModal.classList.contains('hidden')) {
      this.loadReflections();
    }
  }

  loadAllReflections() {
    try {
      const stored = localStorage.getItem('reflections');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  loadReflections() {
    const reflections = this.loadAllReflections();
    
    if (reflections.length === 0) {
      this.reflectionsList.innerHTML = '<p class="no-reflections">No reflections yet. Complete a session and write your thoughts!</p>';
      return;
    }

    this.reflectionsList.innerHTML = reflections.map((reflection, index) => {
      const date = new Date(reflection.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
      
      return `
        <div class="reflection-item">
          <div class="reflection-date">${dateStr} ${timeStr}</div>
          <div class="reflection-text">${this.escapeHtml(reflection.text)}</div>
          <button class="delete-reflection" data-index="${index}">×</button>
        </div>
      `;
    }).join('');

    // Add delete handlers
    this.reflectionsList.querySelectorAll('.delete-reflection').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteReflection(index);
      });
    });
  }

  deleteReflection(index) {
    let reflections = this.loadAllReflections();
    reflections.splice(index, 1);
    localStorage.setItem('reflections', JSON.stringify(reflections));
    this.loadReflections();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  showDonationButtons() {
    if (this.donationSection) {
      // Hide buttons initially
      this.donationSection.classList.remove('show');
      
      // Show with fade-in animation after a short delay
      setTimeout(() => {
        this.donationSection.classList.add('show');
      }, 300);
    }
  }

  shareToTwitter() {
    const text = encodeURIComponent("I just did nothing for 10 minutes. The world didn't collapse. Try it: nothing10.com");
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async copyLink() {
    const url = 'https://nothing10.com';
    try {
      // Modern API (works on HTTPS)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        this.showCopyFeedback();
      } else {
        // Fallback for HTTP (old method)
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showCopyFeedback();
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: show the URL to user
      alert(`Link: ${url}\n\nCopy it manually.`);
    }
  }

  showCopyFeedback() {
    if (this.copyLinkBtn) {
      const originalText = this.copyLinkBtn.textContent;
      this.copyLinkBtn.textContent = 'Copied!';
      this.copyLinkBtn.style.opacity = '0.7';
      setTimeout(() => {
        this.copyLinkBtn.textContent = originalText;
        this.copyLinkBtn.style.opacity = '1';
      }, 2000);
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

// Export for module usage
export default NothingTimer;
