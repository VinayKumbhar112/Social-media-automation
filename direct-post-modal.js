/* ============================================
   DIRECT POST MODAL MANAGER
   ============================================ */

class DirectPostModalManager {
  constructor() {
    this.currentPlatform = null;
    this.selectedFile = null;
    this.isScheduled = false;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attachEventListeners());
    } else {
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    // Attach click listeners to all social cards
    const socialCards = document.querySelectorAll('.social-card[data-platform]');
    console.log('Direct Post Modal: Found', socialCards.length, 'social cards');

    socialCards.forEach(card => {
      const platform = card.getAttribute('data-platform');
      console.log('Direct Post Modal: Attaching listener to', platform, 'card');

      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Direct Post Modal: Card clicked -', platform);
        this.openModal(platform);
      });
    });

    // Attach listeners to all modals
    ['instagram', 'twitter', 'linkedin'].forEach(platform => {
      const modal = document.getElementById(`${platform}Modal`);
      console.log(`Direct Post Modal: ${platform}Modal exists:`, !!modal);
      this.attachModalListeners(platform);
    });

    console.log('Direct Post Modal: All event listeners attached');
  }

  attachModalListeners(platform) {
    const modal = document.getElementById(`${platform}Modal`);
    if (!modal) return;

    // Close button
    const closeBtn = modal.querySelector('.direct-post-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal(platform));
    }

    // Cancel button
    const cancelBtn = modal.querySelector('.direct-post-btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.closeModal(platform));
    }

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(platform);
      }
    });

    // File input
    const fileInput = modal.querySelector(`#${platform}FileInput`);
    const uploadZone = modal.querySelector('.direct-post-upload-zone');
    const uploadBtn = modal.querySelector('.direct-post-upload-btn');

    if (fileInput && uploadZone && uploadBtn) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      uploadZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e, platform));

      // Drag and drop
      uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e, uploadZone));
      uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e, uploadZone));
      uploadZone.addEventListener('drop', (e) => this.handleDrop(e, platform, uploadZone));
    }

    // Remove image button
    const removeBtn = modal.querySelector('.direct-post-remove-image');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeImage(platform);
      });
    }

    // Caption counter
    const captionInput = modal.querySelector('.direct-post-caption-input');
    const captionCounter = modal.querySelector('.direct-post-caption-counter');
    if (captionInput && captionCounter) {
      captionInput.addEventListener('input', () => {
        const maxLength = platform === 'twitter' ? 280 : 2200;
        const currentLength = captionInput.value.length;
        captionCounter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength) {
          captionCounter.style.color = 'var(--error-base)';
        } else {
          captionCounter.style.color = 'var(--text-tertiary)';
        }
      });
    }

    // Schedule toggle
    const scheduleToggle = modal.querySelector('.direct-post-schedule-toggle');
    const toggleSwitch = modal.querySelector('.direct-post-toggle-switch');
    const scheduleOptions = modal.querySelector('.direct-post-schedule-options');

    if (scheduleToggle && toggleSwitch && scheduleOptions) {
      scheduleToggle.addEventListener('click', () => {
        this.isScheduled = !this.isScheduled;
        toggleSwitch.classList.toggle('active');
        scheduleOptions.classList.toggle('active');
      });
    }

    // Submit button
    const submitBtn = modal.querySelector('.direct-post-btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmit(platform));
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        this.closeModal(platform);
      }
    });
  }

  openModal(platform) {
    console.log('Direct Post Modal: Opening modal for', platform);
    this.currentPlatform = platform;
    const modal = document.getElementById(`${platform}Modal`);

    if (!modal) {
      console.error('Direct Post Modal: Modal not found for', platform);
      alert(`Modal for ${platform} not found! Please check the HTML.`);
      return;
    }

    console.log('Direct Post Modal: Modal found, adding active class');

    // Reset modal state
    this.resetModal(platform);

    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    console.log('Direct Post Modal: Modal opened successfully');
  }

  closeModal(platform) {
    const modal = document.getElementById(`${platform}Modal`);
    
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
      
      // Reset after animation completes
      setTimeout(() => {
        this.resetModal(platform);
      }, 300);
    }
    
    this.currentPlatform = null;
  }

  resetModal(platform) {
    const modal = document.getElementById(`${platform}Modal`);
    if (!modal) return;

    // Reset file
    this.selectedFile = null;
    const fileInput = modal.querySelector(`#${platform}FileInput`);
    if (fileInput) fileInput.value = '';

    // Hide preview
    const preview = modal.querySelector('.direct-post-image-preview');
    if (preview) {
      preview.classList.remove('active');
      const img = preview.querySelector('img');
      if (img) img.src = '';
    }

    // Show upload zone
    const uploadZone = modal.querySelector('.direct-post-upload-zone');
    if (uploadZone) uploadZone.style.display = 'block';

    // Reset caption
    const captionInput = modal.querySelector('.direct-post-caption-input');
    if (captionInput) captionInput.value = '';

    const captionCounter = modal.querySelector('.direct-post-caption-counter');
    if (captionCounter) {
      const maxLength = platform === 'twitter' ? 280 : 2200;
      captionCounter.textContent = `0/${maxLength}`;
      captionCounter.style.color = 'var(--text-tertiary)';
    }

    // Reset schedule
    this.isScheduled = false;
    const toggleSwitch = modal.querySelector('.direct-post-toggle-switch');
    const scheduleOptions = modal.querySelector('.direct-post-schedule-options');
    if (toggleSwitch) toggleSwitch.classList.remove('active');
    if (scheduleOptions) scheduleOptions.classList.remove('active');

    // Reset schedule inputs
    const dateInput = modal.querySelector('.direct-post-date-input');
    const timeInput = modal.querySelector('.direct-post-time-input');
    if (dateInput) dateInput.value = '';
    if (timeInput) timeInput.value = '';
  }

  handleFileSelect(event, platform) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.displayImagePreview(file, platform);
    }
  }

  handleDragOver(event, uploadZone) {
    event.preventDefault();
    event.stopPropagation();
    uploadZone.classList.add('dragging');
  }

  handleDragLeave(event, uploadZone) {
    event.preventDefault();
    event.stopPropagation();
    uploadZone.classList.remove('dragging');
  }

  handleDrop(event, platform, uploadZone) {
    event.preventDefault();
    event.stopPropagation();
    uploadZone.classList.remove('dragging');

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.displayImagePreview(file, platform);
    }
  }

  displayImagePreview(file, platform) {
    const modal = document.getElementById(`${platform}Modal`);
    if (!modal) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = modal.querySelector('.direct-post-image-preview');
      const img = preview.querySelector('img');
      const uploadZone = modal.querySelector('.direct-post-upload-zone');

      if (img && preview && uploadZone) {
        img.src = e.target.result;
        preview.classList.add('active');
        uploadZone.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(platform) {
    const modal = document.getElementById(`${platform}Modal`);
    if (!modal) return;

    this.selectedFile = null;
    
    const preview = modal.querySelector('.direct-post-image-preview');
    const img = preview.querySelector('img');
    const uploadZone = modal.querySelector('.direct-post-upload-zone');
    const fileInput = modal.querySelector(`#${platform}FileInput`);

    if (preview) preview.classList.remove('active');
    if (img) img.src = '';
    if (uploadZone) uploadZone.style.display = 'block';
    if (fileInput) fileInput.value = '';
  }

  async handleSubmit(platform) {
    const modal = document.getElementById(`${platform}Modal`);
    if (!modal) return;

    const captionInput = modal.querySelector('.direct-post-caption-input');
    const submitBtn = modal.querySelector('.direct-post-btn-submit');
    const loadingSpinner = modal.querySelector('.direct-post-loading');

    // Validation
    if (!this.selectedFile) {
      this.showToast('Please select an image', 'error');
      return;
    }

    const caption = captionInput ? captionInput.value.trim() : '';
    const maxLength = platform === 'twitter' ? 280 : 2200;
    
    if (caption.length > maxLength) {
      this.showToast(`Caption exceeds ${maxLength} characters`, 'error');
      return;
    }

    // Get schedule data if enabled
    let scheduleData = null;
    if (this.isScheduled) {
      const dateInput = modal.querySelector('.direct-post-date-input');
      const timeInput = modal.querySelector('.direct-post-time-input');
      
      if (dateInput && timeInput && dateInput.value && timeInput.value) {
        scheduleData = {
          date: dateInput.value,
          time: timeInput.value
        };
      } else {
        this.showToast('Please select date and time for scheduling', 'error');
        return;
      }
    }

    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (loadingSpinner) loadingSpinner.classList.add('active');

    // Simulate API call (replace with your actual API call)
    try {
      await this.submitPost(platform, this.selectedFile, caption, scheduleData);
      
      this.showToast(`Post ${this.isScheduled ? 'scheduled' : 'published'} successfully to ${this.capitalizeFirst(platform)}!`, 'success');
      this.closeModal(platform);
    } catch (error) {
      this.showToast('Failed to post. Please try again.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (loadingSpinner) loadingSpinner.classList.remove('active');
    }
  }

  async submitPost(platform, file, caption, scheduleData) {
    // Simulate API call - replace with your actual implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Posting to:', platform);
        console.log('File:', file);
        console.log('Caption:', caption);
        console.log('Schedule:', scheduleData);
        resolve();
      }, 1500);
    });
  }

  showToast(message, type = 'info') {
    // Use existing toast system if available, otherwise create simple alert
    if (window.toastManager && typeof window.toastManager.show === 'function') {
      window.toastManager.show(message, type);
    } else {
      // Fallback to console for now
      console.log(`[${type.toUpperCase()}] ${message}`);
      alert(message);
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize the modal manager
console.log('Direct Post Modal: Script loaded, initializing manager...');
const directPostModalManager = new DirectPostModalManager();
console.log('Direct Post Modal: Manager created successfully');
window.directPostModalManager = directPostModalManager; // Make it globally accessible for debugging

