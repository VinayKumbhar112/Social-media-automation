/* ============================================
   ENHANCED FEATURES & PROFESSIONAL POLISH
   ============================================ */

class EnhancedFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.initKeyboardShortcuts();
    this.initTooltips();
    this.initRippleEffect();
    this.initSmoothScroll();
    this.initLazyLoading();
    this.initAutoSave();
    this.initSearchFunctionality();
    this.initNotifications();
    this.initHelpButton();
    this.initAnimatedCounters();
  }

  /* ============================================
     HELP BUTTON
     ============================================ */
  initHelpButton() {
    const helpFab = document.getElementById('helpFab');
    if (helpFab) {
      helpFab.addEventListener('click', () => {
        this.showKeyboardShortcuts();
      });
    }
  }

  /* ============================================
     1. KEYBOARD SHORTCUTS
     ============================================ */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Quick search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openQuickSearch();
      }

      // Ctrl/Cmd + N: New ad
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = 'simple-ad.html';
      }

      // Ctrl/Cmd + /: Show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.showKeyboardShortcuts();
      }

      // Ctrl/Cmd + Shift + D: Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  openQuickSearch() {
    // Create quick search modal if it doesn't exist
    let searchModal = document.getElementById('quickSearchModal');
    if (!searchModal) {
      searchModal = this.createQuickSearchModal();
      document.body.appendChild(searchModal);
    }
    searchModal.classList.remove('hidden');
    searchModal.querySelector('input').focus();
  }

  createQuickSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'quickSearchModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h2>Quick Search</h2>
          <button class="modal-close" onclick="document.getElementById('quickSearchModal').classList.add('hidden')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="form-group">
          <input type="text" id="quickSearchInput" placeholder="Search campaigns, posts, analytics..." class="form-control" />
        </div>
        <div id="quickSearchResults" style="max-height: 300px; overflow-y: auto;"></div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-primary); font-size: 0.875rem; color: var(--text-tertiary);">
          <kbd>↑↓</kbd> Navigate • <kbd>Enter</kbd> Select • <kbd>Esc</kbd> Close
        </div>
      </div>
    `;
    return modal;
  }

  showKeyboardShortcuts() {
    const shortcuts = [
      { keys: 'Ctrl/Cmd + K', action: 'Quick Search' },
      { keys: 'Ctrl/Cmd + N', action: 'Create New Ad' },
      { keys: 'Ctrl/Cmd + Shift + D', action: 'Toggle Dark Mode' },
      { keys: 'Ctrl/Cmd + /', action: 'Show Shortcuts' },
      { keys: 'Esc', action: 'Close Modal' },
    ];

    let shortcutsModal = document.getElementById('keyboardShortcutsModal');
    if (!shortcutsModal) {
      shortcutsModal = document.createElement('div');
      shortcutsModal.id = 'keyboardShortcutsModal';
      shortcutsModal.className = 'modal';
      shortcutsModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>⌨️ Keyboard Shortcuts</h2>
            <button class="modal-close" onclick="document.getElementById('keyboardShortcutsModal').classList.add('hidden')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div style="margin-top: 16px;">
            ${shortcuts.map(s => `
              <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--border-primary);">
                <span style="color: var(--text-secondary);">${s.action}</span>
                <kbd style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">${s.keys}</kbd>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(shortcutsModal);
    }
    shortcutsModal.classList.remove('hidden');
  }

  closeAllModals() {
    document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
      if (!modal.id.includes('auth')) { // Don't auto-close auth modal
        modal.classList.add('hidden');
      }
    });
  }

  /* ============================================
     2. ENHANCED TOOLTIPS
     ============================================ */
  initTooltips() {
    // Add tooltip class to elements with data-tooltip attribute
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      if (!element.classList.contains('tooltip')) {
        element.classList.add('tooltip');
      }
    });
  }

  /* ============================================
     3. RIPPLE EFFECT ON BUTTONS
     ============================================ */
  initRippleEffect() {
    document.querySelectorAll('.btn, .action-card, .social-card').forEach(element => {
      element.classList.add('btn-ripple');
    });
  }

  /* ============================================
     4. SMOOTH SCROLL
     ============================================ */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  /* ============================================
     5. LAZY LOADING IMAGES
     ============================================ */
  initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  /* ============================================
     6. AUTO-SAVE FUNCTIONALITY
     ============================================ */
  initAutoSave() {
    const autoSaveInputs = document.querySelectorAll('[data-autosave]');
    autoSaveInputs.forEach(input => {
      let timeout;
      input.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.autoSave(input);
        }, 1000);
      });
    });
  }

  autoSave(input) {
    const key = input.dataset.autosave;
    const value = input.value;
    localStorage.setItem(`autosave_${key}`, value);
    
    // Show save indicator
    this.showSaveIndicator(input);
  }

  showSaveIndicator(input) {
    let indicator = input.parentElement.querySelector('.save-indicator');
    if (!indicator) {
      indicator = document.createElement('span');
      indicator.className = 'save-indicator';
      indicator.style.cssText = 'position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.75rem; color: var(--success-green);';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(indicator);
    }
    indicator.textContent = '✓ Saved';
    setTimeout(() => {
      indicator.textContent = '';
    }, 2000);
  }

  /* ============================================
     7. SEARCH FUNCTIONALITY
     ============================================ */
  initSearchFunctionality() {
    const searchInput = document.getElementById('quickSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });
    }
  }

  performSearch(query) {
    const results = document.getElementById('quickSearchResults');
    if (!results) return;

    if (query.length < 2) {
      results.innerHTML = '<p style="padding: 16px; color: var(--text-tertiary);">Type to search...</p>';
      return;
    }

    // Simulate search results
    const mockResults = [
      { type: 'Campaign', title: 'Summer Sale 2024', status: 'Active' },
      { type: 'Post', title: 'Product Launch Announcement', status: 'Scheduled' },
      { type: 'Analytics', title: 'Q4 Performance Report', status: 'Ready' },
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

    if (mockResults.length === 0) {
      results.innerHTML = '<p style="padding: 16px; color: var(--text-tertiary);">No results found</p>';
      return;
    }

    results.innerHTML = mockResults.map(item => `
      <div style="padding: 12px; border-bottom: 1px solid var(--border-primary); cursor: pointer; transition: background 0.2s;" 
           onmouseover="this.style.background='var(--bg-secondary)'" 
           onmouseout="this.style.background='transparent'">
        <div style="font-weight: 600; color: var(--text-primary);">${item.title}</div>
        <div style="font-size: 0.875rem; color: var(--text-tertiary); margin-top: 4px;">
          <span class="badge badge-primary">${item.type}</span>
          <span style="margin-left: 8px;">${item.status}</span>
        </div>
      </div>
    `).join('');
  }

  /* ============================================
     8. NOTIFICATION SYSTEM
     ============================================ */
  initNotifications() {
    // Check for browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      // We'll ask for permission when user performs an action
    }
  }

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon-32x32.png',
        badge: '/favicon-32x32.png'
      });
    }
  }

  /* ============================================
     9. ANIMATED COUNTERS
     ============================================ */
  initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-value');

    const animateCounter = (element) => {
      const target = parseInt(element.textContent.replace(/,/g, ''));
      if (isNaN(target)) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      element.textContent = '0';

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = this.formatNumber(target);
          clearInterval(timer);
        } else {
          element.textContent = this.formatNumber(Math.floor(current));
        }
      }, duration / steps);
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ============================================
     10. CONFIRMATION DIALOG
     ============================================ */
  showConfirmDialog(title, message, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.id = 'confirmDialog';
    dialog.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
          <h2>${title}</h2>
        </div>
        <div style="padding: 16px 0; color: var(--text-secondary);">
          ${message}
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <button class="btn-secondary" id="confirmCancel" style="padding: 10px 20px; border: 1px solid var(--border-primary); background: transparent; color: var(--text-primary); border-radius: 8px; cursor: pointer;">
            Cancel
          </button>
          <button class="btn-primary" id="confirmOk" style="padding: 10px 20px; background: var(--primary-gradient); color: white; border: none; border-radius: 8px; cursor: pointer;">
            Confirm
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const okBtn = dialog.querySelector('#confirmOk');
    const cancelBtn = dialog.querySelector('#confirmCancel');

    const cleanup = () => {
      dialog.remove();
    };

    okBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      cleanup();
    });

    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      cleanup();
    });

    dialog.querySelector('.modal-overlay').addEventListener('click', () => {
      if (onCancel) onCancel();
      cleanup();
    });
  }
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedFeatures = new EnhancedFeatures();
  console.log('✨ Enhanced features initialized');
});

