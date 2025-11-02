class DirectPost {
    constructor() {
        this.imageFile = null;
        this.imageUrl = '';
        this.imageUrlInput = '';
        this.isDragging = false;
        this.isPosting = false;
        this.isScheduled = false;
        this.currentPlatform = 'twitter';
        this.pendingAction = null;
        this.objectUrl = null;

        this.initializeElements();
        this.attachEventListeners();
        this.setupPlatformHandlers();
    }

    initializeElements() {
        // Modal elements
        this.modal = document.getElementById('directPostModal');
        this.closeBtn = document.getElementById('closeDirectPostModal');
        
        // Platform buttons
        this.platformBtns = document.querySelectorAll('.platform-btn');
        
        // Image upload elements
        this.dropZone = document.getElementById('imageDropZone');
        this.fileInput = document.getElementById('imageFileInput');
        this.browseBtn = document.getElementById('browseImageBtn');
        this.previewContainer = document.getElementById('imagePreviewContainer');
        this.preview = document.getElementById('imagePreview');
        this.removeBtn = document.getElementById('removeImageBtn');
        this.urlInput = document.getElementById('imageUrlInput');
        
        // Post details elements
        this.captionInput = document.getElementById('postCaption');
        this.charCounter = document.getElementById('characterCount');
        this.scheduleToggle = document.getElementById('scheduleToggle');
        this.scheduleOptions = document.getElementById('scheduleOptions');
        this.dateInput = document.getElementById('postDate');
        this.timeInput = document.getElementById('postTime');
        this.timezoneSelect = document.getElementById('timezone');
        
        // Submit elements
        this.submitBtn = document.getElementById('submitDirectPostBtn');
        this.loadingIcon = this.submitBtn.querySelector('.loading-icon');
        this.btnText = this.submitBtn.querySelector('.btn-text');
    }

    attachEventListeners() {
        // Modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // File input events
        this.fileInput.addEventListener('change', (e) => this.handleFileInputChange(e));
        this.browseBtn.addEventListener('click', () => this.fileInput.click());
        this.removeBtn.addEventListener('click', () => this.removeImage());
        
        // URL input events
        this.urlInput.addEventListener('blur', () => this.validateImageUrl());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validateImageUrl();
        });
        
        // Caption counter
        this.captionInput.addEventListener('input', () => this.updateCharacterCount());
        
        // Schedule toggle
        this.scheduleToggle.addEventListener('change', () => this.toggleScheduleOptions());
        
        // Submit
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    setupPlatformHandlers() {
        this.platformBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.platformBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPlatform = btn.dataset.platform;
                this.updateSubmitButton();
            });
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isPosting) {
            this.isDragging = true;
            this.dropZone.classList.add('dragging');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        this.dropZone.classList.remove('dragging');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        this.dropZone.classList.remove('dragging');
        
        if (this.isPosting) return;
        
        const file = e.dataTransfer.files[0];
        if (this.validateImageFile(file)) {
            this.handleImage(file);
        }
    }

    handleFileInputChange(e) {
        const file = e.target.files[0];
        if (this.validateImageFile(file)) {
            this.handleImage(file);
        }
    }

    validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!validTypes.includes(file.type)) {
            this.showToast('Please upload a valid image file (JPG, PNG, GIF, or WebP)', 'error');
            return false;
        }
        
        // 10MB size limit
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('Image size should be less than 10MB', 'error');
            return false;
        }
        
        return true;
    }

    handleImage(file) {
        // Cleanup previous object URL
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }
        
        this.imageFile = file;
        this.objectUrl = URL.createObjectURL(file);
        this.imageUrl = this.objectUrl;
        
        this.updateImagePreview();
    }

    updateImagePreview() {
        if (this.imageUrl) {
            this.preview.src = this.imageUrl;
            this.previewContainer.classList.remove('hidden');
            document.getElementById('imageUploadPrompt').classList.add('hidden');
            
            // Update image info
            const info = document.querySelector('.image-info');
            if (this.imageFile) {
                info.textContent = `${this.imageFile.name} (${this.formatFileSize(this.imageFile.size)})`;
            } else {
                info.textContent = 'Image from URL';
            }
        }
    }

    removeImage() {
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }
        
        this.imageFile = null;
        this.imageUrl = '';
        this.urlInput.value = '';
        this.preview.src = '';
        this.previewContainer.classList.add('hidden');
        document.getElementById('imageUploadPrompt').classList.remove('hidden');
    }

    async validateImageUrl() {
        const url = this.urlInput.value.trim();
        if (!url) return;
        
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const hasValidExtension = validExtensions.some(ext => 
            url.toLowerCase().endsWith(ext)
        );
        
        if (!hasValidExtension) {
            this.showToast('Please enter a valid image URL', 'error');
            return;
        }
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok && response.headers.get('content-type').startsWith('image/')) {
                this.imageFile = null;
                this.imageUrl = url;
                this.updateImagePreview();
            } else {
                this.showToast('Invalid image URL', 'error');
            }
        } catch (error) {
            this.showToast('Error validating image URL', 'error');
        }
    }

    updateCharacterCount() {
        const count = this.captionInput.value.length;
        this.charCounter.textContent = count;
        
        if (count > 480) {
            this.charCounter.style.color = 'var(--warning)';
        } else if (count > 450) {
            this.charCounter.style.color = 'var(--warning-light)';
        } else {
            this.charCounter.style.color = 'var(--text-secondary)';
        }
    }

    toggleScheduleOptions() {
        this.isScheduled = this.scheduleToggle.checked;
        this.scheduleOptions.classList.toggle('hidden', !this.isScheduled);
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        this.btnText.textContent = this.isScheduled ? 'Schedule Post' : `Post to ${this.capitalizeFirst(this.currentPlatform)}`;
    }

    validateScheduleTime() {
        if (!this.isScheduled) return true;

        const date = new Date(`${this.dateInput.value} ${this.timeInput.value}`);
        const now = new Date();
        
        if (date <= now) {
            this.showToast('Schedule time must be in the future', 'error');
            return false;
        }
        
        return true;
    }

    async handleSubmit() {
        // Check authentication - DISABLED
        // if (!this.checkAuth()) {
        //     this.pendingAction = this.handleSubmit.bind(this);
        //     return;
        // }

        // Validate inputs
        if (!this.imageUrl && !this.imageFile) {
            this.showToast('Please select an image', 'error');
            return;
        }
        
        if (!this.captionInput.value.trim()) {
            this.showToast('Please enter a caption', 'error');
            return;
        }
        
        if (this.isScheduled && !this.validateScheduleTime()) {
            return;
        }
        
        // Start posting
        this.isPosting = true;
        this.submitBtn.disabled = true;
        this.loadingIcon.classList.remove('hidden');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const successMessage = this.isScheduled
                ? `Post scheduled for ${this.formatScheduleTime()}`
                : 'Posted successfully!';
            
            this.showToast(successMessage, 'success');
            this.closeModal();
        } catch (error) {
            this.showToast('Error posting to social media', 'error');
        } finally {
            this.isPosting = false;
            this.submitBtn.disabled = false;
            this.loadingIcon.classList.add('hidden');
        }
    }

    checkAuth() {
        const isAuthenticated = window.authManager && window.authManager.user;
        
        if (!isAuthenticated) {
            this.showToast('Please sign in to post', 'error');
            window.authManager.showAuthModal(() => {
                if (this.pendingAction) {
                    this.pendingAction();
                }
            });
            return false;
        }
        
        return true;
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.resetForm();
    }

    resetForm() {
        this.removeImage();
        this.captionInput.value = '';
        this.updateCharacterCount();
        this.scheduleToggle.checked = false;
        this.toggleScheduleOptions();
        this.isPosting = false;
        this.submitBtn.disabled = false;
        this.loadingIcon.classList.add('hidden');
        this.pendingAction = null;
    }

    // Utility functions
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatScheduleTime() {
        const date = new Date(`${this.dateInput.value} ${this.timeInput.value}`);
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showToast(message, type) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} visible`;

        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3000);
    }
}

// Initialize the DirectPost functionality
document.addEventListener('DOMContentLoaded', () => {
    window.directPost = new DirectPost();
});