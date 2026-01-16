/**
 * Theme Toggle Script
 * Manages theme switching between dark and light modes
 */

(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'nothing10-theme';
  const DEFAULT_THEME = 'dark';

  /**
   * Get current theme from localStorage or return default
   */
  function getCurrentTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  /**
   * Save theme to localStorage
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    saveTheme(theme);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/00b98d01-638d-46a8-ac1d-6747997bdb8c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'theme-toggle.js:applyTheme',message:'Theme applied',data:{theme:theme,hasDataTheme:html.hasAttribute('data-theme'),dataThemeValue:html.getAttribute('data-theme')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateToggleButton(newTheme);
    // #region agent log
    // Log immediately after toggle
    setTimeout(() => {
      const html = document.documentElement;
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        const computedStyle = window.getComputedStyle(btn);
        fetch('http://127.0.0.1:7243/ingest/00b98d01-638d-46a8-ac1d-6747997bdb8c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'theme-toggle.js:toggleTheme',message:'Button styles immediately after toggle',data:{newTheme:newTheme,htmlDataTheme:html.getAttribute('data-theme'),btnBorderColor:computedStyle.borderColor,btnBackgroundColor:computedStyle.backgroundColor,btnColor:computedStyle.color},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      }
    }, 50);
    // Log after longer delay
    setTimeout(() => {
      const html = document.documentElement;
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        const computedStyle = window.getComputedStyle(btn);
        const svg = btn.querySelector('svg');
        const svgComputedStyle = svg ? window.getComputedStyle(svg) : null;
        fetch('http://127.0.0.1:7243/ingest/00b98d01-638d-46a8-ac1d-6747997bdb8c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'theme-toggle.js:toggleTheme',message:'Button styles after delay',data:{newTheme:newTheme,htmlDataTheme:html.getAttribute('data-theme'),btnBorderColor:computedStyle.borderColor,btnBackgroundColor:computedStyle.backgroundColor,btnColor:computedStyle.color,svgStroke:svgComputedStyle?.stroke,svgColor:svgComputedStyle?.color},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      }
    }, 500);
    // #endregion
  }

  /**
   * Update toggle button icon based on current theme
   */
  function updateToggleButton(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('svg');
    if (!icon) return;

    // Remove existing icon content
    icon.innerHTML = '';

    if (theme === 'light') {
      // Moon icon for light theme (switch to dark)
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      icon.setAttribute('viewBox', '0 0 24 24');
      toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      // Sun icon for dark theme (switch to light)
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      icon.setAttribute('viewBox', '0 0 24 24');
      toggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  }

  /**
   * Create theme toggle button
   */
  function createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle theme');
    toggleBtn.setAttribute('type', 'button');

    const icon = document.createElement('svg');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');

    toggleBtn.appendChild(icon);
    document.body.appendChild(toggleBtn);

    // Add click event listener
    toggleBtn.addEventListener('click', toggleTheme);

    return toggleBtn;
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Create or update toggle button
    let toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) {
      toggleBtn = createToggleButton();
    }
    updateToggleButton(currentTheme);
    
    // #region agent log
    setTimeout(() => {
      const html = document.documentElement;
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        const computedStyle = window.getComputedStyle(btn);
        const svg = btn.querySelector('svg');
        const svgComputedStyle = svg ? window.getComputedStyle(svg) : null;
        fetch('http://127.0.0.1:7243/ingest/00b98d01-638d-46a8-ac1d-6747997bdb8c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'theme-toggle.js:initTheme',message:'Button styles after init',data:{currentTheme:currentTheme,htmlDataTheme:html.getAttribute('data-theme'),btnBorderColor:computedStyle.borderColor,btnBackgroundColor:computedStyle.backgroundColor,btnColor:computedStyle.color,svgStroke:svgComputedStyle?.stroke,svgColor:svgComputedStyle?.color},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C,D'})}).catch(()=>{});
      }
    }, 100);
    // #endregion
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Export for use in other scripts if needed
  window.themeToggle = {
    toggle: toggleTheme,
    getCurrentTheme: getCurrentTheme,
    applyTheme: applyTheme
  };
})();
