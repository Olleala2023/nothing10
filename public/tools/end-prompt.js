// End-Prompt Generator for 10 Minutes of Nothing
// Load data and initialize the app

let data = null;
let currentPair = null;
let storageKey = 'endPrompt';
let defaultStorage = {
  history: [],
  favorites: [],
  custom: []
};

// Rotating text arrays
const ctaTexts = [
  'Generate a gentle prompt',
  'Give me a thought & a tiny step',
  'I'm ready to close my pause'
];

const subheadTexts = [
  'Close your pause with one clear thought and one tiny next step.',
  'A gentle nudge to end well: one thought, one micro-action.',
  'No pressure, just clarity: two short lines to re-enter your day.'
];

// Initialize rotating text
function initRotatingText() {
  const randomIndex = Math.floor(Math.random() * ctaTexts.length);
  document.getElementById('generate-btn').textContent = ctaTexts[randomIndex];
  document.getElementById('subtitle').textContent = subheadTexts[randomIndex];
}

// Load data from JSON
async function loadData() {
  try {
    const response = await fetch('/data/end_prompt_pairs.json');
    data = await response.json();
    console.log('Data loaded:', data);
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Error loading prompts. Please refresh the page.');
  }
}

// Storage helpers
function getStorage() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : defaultStorage;
  } catch (error) {
    console.error('Error reading storage:', error);
    return defaultStorage;
  }
}

function saveStorage(storage) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving storage:', error);
  }
}

// Weighted random selection
function pickPair(selectedTone, selectedFocus) {
  if (!data) return null;
  
  const storage = getStorage();
  let pool = [...data.items, ...storage.custom];
  
  // Apply filters
  if (selectedFocus !== 'any') {
    pool = pool.filter(p => p.focus === selectedFocus);
  }
  
  if (selectedTone !== 'auto') {
    pool = pool.filter(p => p.tone === selectedTone);
  }
  
  if (pool.length === 0) {
    return null;
  }
  
  // Weight-based selection
  const lastId = storage.history[0]?.id;
  const favorites = new Set(storage.favorites);
  const weighted = [];
  
  for (const p of pool) {
    let weight = 1;
    if (favorites.has(p.id)) weight *= 2;
    if (p.id.startsWith('usr-')) weight *= 1.5;
    if (p.id === lastId) weight = 0.0001;
    
    for (let i = 0; i < weight; i++) {
      weighted.push(p);
    }
  }
  
  const item = weighted[Math.floor(Math.random() * weighted.length)] || pool[0];
  
  // Add to history
  storage.history.unshift({
    id: item.id,
    tone: item.tone,
    focus: item.focus,
    ts: Date.now()
  });
  storage.history = storage.history.slice(0, 10);
  saveStorage(storage);
  
  return item;
}

// Display pair
function displayPair(pair) {
  if (!pair) return;
  
  currentPair = pair;
  document.getElementById('thought-text').textContent = pair.thought;
  document.getElementById('action-text').textContent = pair.action;
  document.getElementById('result-block').style.display = 'block';
  
  // Update favorite button
  const storage = getStorage();
  const isFavorite = storage.favorites.includes(pair.id);
  const btn = document.getElementById('favorite-btn');
  btn.textContent = isFavorite ? '★ Favorite' : '☆ Favorite';
  btn.classList.toggle('active', isFavorite);
  
  // Update history count
  document.getElementById('history-toggle').textContent = `History (${storage.history.length})`;
  
  // Update URL
  const url = new URL(window.location);
  url.searchParams.set('tone', pair.tone);
  url.searchParams.set('focus', pair.focus);
  url.searchParams.set('id', pair.id);
  window.history.replaceState({}, '', url);
}

// Copy functions
async function copyBoth() {
  const text = `Thought — ${currentPair.thought}\nAction — ${currentPair.action}`;
  await copyToClipboard(text, 'Copied both to clipboard');
}

async function copyThought() {
  await copyToClipboard(currentPair.thought, 'Copied thought');
}

async function copyAction() {
  await copyToClipboard(currentPair.action, 'Copied action');
}

async function copyToClipboard(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('Copy failed. Please try again.');
  }
}

// Favorite toggle
function toggleFavorite() {
  if (!currentPair) return;
  
  const storage = getStorage();
  const index = storage.favorites.indexOf(currentPair.id);
  
  if (index > -1) {
    storage.favorites.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    storage.favorites.push(currentPair.id);
    showToast('Added to favorites');
  }
  
  saveStorage(storage);
  
  const btn = document.getElementById('favorite-btn');
  btn.textContent = storage.favorites.includes(currentPair.id) ? '★ Favorite' : '☆ Favorite';
  btn.classList.toggle('active', storage.favorites.includes(currentPair.id));
}

// History
function displayHistory() {
  const storage = getStorage();
  const dropdown = document.getElementById('history-dropdown');
  
  if (storage.history.length === 0) {
    dropdown.innerHTML = '<div class="dropdown-item">No history yet</div>';
    dropdown.style.display = 'block';
    return;
  }
  
  dropdown.innerHTML = storage.history.map(item => {
    const pair = [...data.items, ...storage.custom].find(p => p.id === item.id);
    if (!pair) return '';
    return `<div class="dropdown-item" data-id="${item.id}">${pair.thought}</div>`;
  }).join('');
  
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  
  // Add click handlers
  dropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const pair = [...data.items, ...storage.custom].find(p => p.id === id);
      if (pair) {
        displayPair(pair);
        dropdown.style.display = 'none';
      }
    });
  });
}

// Add custom
function displayAddCustom() {
  const form = document.getElementById('add-custom-form');
  form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function saveCustom() {
  const thought = document.getElementById('custom-thought').value.trim();
  const action = document.getElementById('custom-action').value.trim();
  const tone = document.getElementById('custom-tone-select').value;
  const focus = document.getElementById('custom-focus-select').value;
  
  if (!thought || !action) {
    showToast('Please fill in both fields');
    return;
  }
  
  const storage = getStorage();
  const customPair = {
    id: `usr-${Date.now()}`,
    tone,
    focus,
    thought,
    action
  };
  
  storage.custom.push(customPair);
  saveStorage(storage);
  
  document.getElementById('custom-thought').value = '';
  document.getElementById('custom-action').value = '';
  document.getElementById('add-custom-form').style.display = 'none';
  
  showToast('Saved locally');
}

// Share
async function share() {
  if (!currentPair) return;
  
  const url = new URL(window.location);
  url.searchParams.set('tone', currentPair.tone);
  url.searchParams.set('focus', currentPair.focus);
  url.searchParams.set('id', currentPair.id);
  const shareUrl = url.toString();
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'One Thought, One Tiny Action',
        text: `${currentPair.thought} — ${currentPair.action}`,
        url: shareUrl
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        fallbackCopy(shareUrl);
      }
    }
  } else {
    fallbackCopy(shareUrl);
  }
}

async function fallbackCopy(shareUrl) {
  await copyToClipboard(shareUrl, 'Link copied');
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

// Check URL params
function checkUrlParams() {
  const url = new URL(window.location);
  const id = url.searchParams.get('id');
  const tone = url.searchParams.get('tone');
  const focus = url.searchParams.get('focus');
  
  if (id) {
    const storage = getStorage();
    const pair = [...data.items, ...storage.custom].find(p => p.id === id);
    if (pair) {
      displayPair(pair);
      return true;
    }
  }
  
  if (tone && focus && data) {
    const pair = data.items.find(p => p.tone === tone && p.focus === focus);
    if (pair) {
      displayPair(pair);
      return true;
    }
  }
  
  return false;
}

// Hotkeys
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('generate-btn').click();
  } else if (e.key === 'c' || e.key === 'C') {
    if (currentPair) copyBoth();
  } else if (e.key === 'f' || e.key === 'F') {
    if (currentPair) toggleFavorite();
  } else if (e.key === 'h' || e.key === 'H') {
    displayHistory();
  }
});

// Initialize
async function init() {
  await loadData();
  initRotatingText();
  
  if (!checkUrlParams()) {
    const toneSelect = document.getElementById('tone-select');
    const focusSelect = document.getElementById('focus-select');
    const generateBtn = document.getElementById('generate-btn');
    
    generateBtn.addEventListener('click', () => {
      const pair = pickPair(toneSelect.value, focusSelect.value);
      displayPair(pair);
    });
  }
  
  // Other event listeners
  document.getElementById('copy-both-btn').addEventListener('click', copyBoth);
  document.getElementById('copy-thought-btn').addEventListener('click', copyThought);
  document.getElementById('copy-action-btn').addEventListener('click', copyAction);
  document.getElementById('favorite-btn').addEventListener('click', toggleFavorite);
  document.getElementById('history-toggle').addEventListener('click', displayHistory);
  document.getElementById('add-custom-toggle').addEventListener('click', displayAddCustom);
  document.getElementById('save-custom-btn').addEventListener('click', saveCustom);
  document.getElementById('share-btn').addEventListener('click', share);
}

init();

