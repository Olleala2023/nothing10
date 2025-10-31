// Micro-Distraction Audit Checklist
// Local-only, privacy-first checklist functionality

const checklistData = {
  slug: 'distraction-audit',
  title: 'Micro-Distraction Audit — Quick Checklist',
  intro: 'A one-minute sweep to reduce small frictions before your pause. Tick off what helps; skip the rest.',
  duration: '60 seconds',
  steps: [
    { text: 'Mute OS notifications for 15–60 minutes.', required: false },
    { text: 'Close one tab/app you won\'t use now.', required: false },
    { text: 'Phone → Do Not Disturb / silent.', required: false },
    { text: 'Clear one object on your desk.', required: false },
    { text: 'Open the 10-Minute Timer.', required: true },
    { text: 'Optional: open Breathing Pacer (6/min).', required: false },
    { text: 'Choose sound: soft chime or no sound.', required: false },
    { text: 'Pick where you\'ll sit/stand (no scrolling).', required: false },
    { text: 'Decide your post-pause tiny step (one line).', required: false },
    { text: 'Breathe out once—then start.', required: true }
  ]
};

let checkedState = [];
const storageKey = `checklist-${checklistData.slug}`;

// Load saved state
function loadState() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      checkedState = data.checked || [];
    } else {
      checkedState = checklistData.steps.map(() => false);
    }
  } catch (error) {
    console.error('Error loading state:', error);
    checkedState = checklistData.steps.map(() => false);
  }
}

// Save state
function saveState() {
  try {
    const data = {
      checked: checkedState,
      completed: checkedState.every(b => b) ? new Date().toISOString() : null,
      timesUsed: 1 // Simplified for now
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving state:', error);
  }
}

// Initialize checklist
function initChecklist() {
  const container = document.getElementById('checklist-steps');
  container.innerHTML = '';
  
  checklistData.steps.forEach((step, index) => {
    const stepItem = document.createElement('div');
    stepItem.className = 'checklist-item';
    stepItem.innerHTML = `
      <label class="checklist-label">
        <input type="checkbox" data-index="${index}" ${checkedState[index] ? 'checked' : ''} />
        <span class="checklist-text ${step.required ? 'required' : 'optional'}">${step.text}</span>
      </label>
    `;
    container.appendChild(stepItem);
  });
  
  // Add event listeners
  document.querySelectorAll('#checklist-steps input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      checkedState[index] = e.target.checked;
      saveState();
      updateProgress();
    });
  });
  
  updateProgress();
}

// Update progress indicator
function updateProgress() {
  const completed = checkedState.filter(b => b).length;
  const total = checkedState.length;
  const percentage = (completed / total) * 100;
  
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressContainer = document.getElementById('checklist-progress');
  
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
  if (progressText) {
    progressText.textContent = `${completed} of ${total} completed`;
  }
  if (progressContainer && completed > 0) {
    progressContainer.style.display = 'block';
  }
}

// Copy as .txt
function copyAsText() {
  let output = `${checklistData.title}\n\n${checklistData.intro}\n\nChecklist:\n\n`;
  checklistData.steps.forEach((step, i) => {
    const mark = checkedState[i] ? '☑' : '☐';
    output += `${mark} ${step.text}\n`;
  });
  output += `\nGenerated from: https://nothing10.com/tools/${checklistData.slug}.html`;
  
  copyToClipboard(output, 'Copied as text');
}

// Copy as .md
function copyAsMarkdown() {
  let output = `# ${checklistData.title}\n\n**Duration:** ${checklistData.duration}\n\n${checklistData.intro}\n\n## Checklist\n\n`;
  checklistData.steps.forEach((step, i) => {
    const mark = checkedState[i] ? '[x]' : '[ ]';
    output += `- ${mark} ${step.text}\n`;
  });
  output += `\n*Source: [nothing10.com](https://nothing10.com/tools/${checklistData.slug}.html)*`;
  
  copyToClipboard(output, 'Copied as Markdown');
}

// Share link
async function shareLink() {
  const url = window.location.href;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: checklistData.title,
        text: checklistData.intro,
        url: url
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        copyToClipboard(url, 'Link copied');
      }
    }
  } else {
    copyToClipboard(url, 'Link copied');
  }
}

// Reset all
function resetAll() {
  if (confirm('Clear all checkboxes?')) {
    checkedState = checklistData.steps.map(() => false);
    saveState();
    initChecklist();
    showToast('Checklist reset');
  }
}

// Copy to clipboard
async function copyToClipboard(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('Copy failed');
  }
}

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Hotkeys
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') return;
  
  if (e.key === 'c' || e.key === 'C') {
    e.preventDefault();
    copyAsText();
  } else if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    copyAsMarkdown();
  } else if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    shareLink();
  } else if (e.key === 'r' || e.key === 'R') {
    if (e.target.tagName !== 'INPUT') {
      e.preventDefault();
      resetAll();
    }
  }
});

// Initialize when DOM is ready
function init() {
  loadState();
  initChecklist();

  document.getElementById('copy-txt-btn').addEventListener('click', copyAsText);
  document.getElementById('copy-md-btn').addEventListener('click', copyAsMarkdown);
  document.getElementById('share-btn').addEventListener('click', shareLink);
  document.getElementById('reset-btn').addEventListener('click', resetAll);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

