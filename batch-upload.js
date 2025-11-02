// Batch Upload Functionality
class BatchUpload {
    constructor() {
        this.isAuthenticated = false;
        this.isUploading = false;
        this.isDragging = false;
        this.selectedFile = null;
        this.uploadResult = '';
        this.scheduleName = '';
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Main elements
        this.uploadBtn = document.getElementById('uploadFileBtn');
        this.uploadModal = document.getElementById('uploadModal');
        this.dragDropZone = document.getElementById('dragDropZone');
        this.fileInput = document.getElementById('fileInput');
        this.chooseFileBtn = document.querySelector('.choose-file-btn');
        this.dragOverlay = document.getElementById('dragOverlay');
        this.closeModalBtn = document.getElementById('closeUploadModal');
        this.scheduleNameInput = document.getElementById('scheduleName');
        this.uploadResultDiv = document.getElementById('uploadResult');
        this.dragDropText = document.getElementById('dragDropText');
        this.uploadProcessBtn = document.getElementById('uploadProcessBtn');
        this.cancelUploadBtn = document.getElementById('cancelUploadBtn');
        this.downloadSampleBtn = document.getElementById('downloadSampleBtn');
    }

    attachEventListeners() {
        // Main button click
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => this.handleUploadClick());
        }

        // Modal events
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.cancelUploadBtn) {
            this.cancelUploadBtn.addEventListener('click', () => this.closeModal());
        }

        // Drag and drop events
        if (this.dragDropZone) {
            this.dragDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.dragDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.dragDropZone.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // File input events
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileInputChange(e));
        }
        if (this.chooseFileBtn) {
            this.chooseFileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.fileInput.click();
            });
        }

        // Upload process
        if (this.uploadProcessBtn) {
            this.uploadProcessBtn.addEventListener('click', () => this.handleUpload());
        }

        // Download sample
        if (this.downloadSampleBtn) {
            this.downloadSampleBtn.addEventListener('click', () => this.downloadSampleTemplate());
        }
    }

    handleUploadClick() {
        // Simply open the modal without auth check
        this.openModal();
    }

    openModal() {
        this.uploadModal.classList.remove('hidden');
        this.resetUploadState();
    }

    closeModal() {
        if (this.isUploading) {
            if (!confirm('Upload in progress. Are you sure you want to cancel?')) {
                return;
            }
        }
        this.uploadModal.classList.add('hidden');
        this.resetUploadState();
    }

    resetUploadState() {
        this.isUploading = false;
        this.isDragging = false;
        this.selectedFile = null;
        this.uploadResult = '';
        this.scheduleName = '';
        this.fileInput.value = '';
        this.scheduleNameInput.value = '';
        this.uploadResultDiv.classList.add('hidden');
        this.dragDropText.textContent = 'Drag and drop your Excel file here';
        this.uploadProcessBtn.disabled = false;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isUploading) {
            this.isDragging = true;
            this.dragDropZone.classList.add('dragging');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        this.dragDropZone.classList.remove('dragging');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
        this.dragDropZone.classList.remove('dragging');

        if (this.isUploading) return;

        const file = e.dataTransfer.files[0];
        if (this.validateFile(file)) {
            this.selectedFile = file;
            this.updateDropZoneUI();
        }
    }

    handleFileInputChange(e) {
        const file = e.target.files[0];
        if (this.validateFile(file)) {
            this.selectedFile = file;
            this.updateDropZoneUI();
        }
    }

    validateFile(file) {
        const validTypes = ['.xlsx', '.xls', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            this.showToast('Please select an Excel (.xlsx, .xls) or CSV file', 'error');
            return false;
        }

        // 10MB file size limit
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('File size should be less than 10MB', 'error');
            return false;
        }

        return true;
    }

    updateDropZoneUI() {
        if (this.selectedFile) {
            this.dragDropText.innerHTML = `
                <strong>${this.selectedFile.name}</strong><br>
                <span class="text-sm">${this.formatFileSize(this.selectedFile.size)}</span>
                <button class="remove-file-btn">Remove</button>
            `;
            const removeBtn = this.dragDropText.querySelector('.remove-file-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectedFile = null;
                    this.fileInput.value = '';
                    this.dragDropText.textContent = 'Drag and drop your Excel file here';
                });
            }
        }
    }

    async handleUpload() {
        if (!this.selectedFile) {
            this.showToast('Please select a file to upload', 'error');
            return;
        }

        const scheduleName = this.scheduleNameInput.value.trim();
        if (!scheduleName) {
            this.showToast('Please enter a schedule name', 'error');
            return;
        }

        this.isUploading = true;
        this.uploadProcessBtn.disabled = true;
        this.dragDropText.textContent = 'Uploading...';
        this.uploadResultDiv.classList.remove('hidden');
        this.uploadResultDiv.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Processing your file...</p>
            </div>
        `;

        try {
            // Simulate file upload (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.uploadResult = 'success';
            this.uploadResultDiv.innerHTML = `
                <div class="success-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <p>Upload successful! Campaign "${scheduleName}" has been created.</p>
                </div>
            `;
            this.showToast(`Campaign "${scheduleName}" has been created successfully!`, 'success');

            // Close modal after success
            setTimeout(() => this.closeModal(), 2000);
        } catch (error) {
            this.uploadResult = 'error';
            this.uploadResultDiv.innerHTML = `
                <div class="error-message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <p>Error uploading file. Please try again.</p>
                </div>
            `;
            this.showToast('Error uploading file. Please try again.', 'error');
            this.uploadProcessBtn.disabled = false;
        } finally {
            this.isUploading = false;
        }
    }

    downloadSampleTemplate() {
        // Create sample CSV content
        const csvContent = `date,topic_title,textual_description,target_accounts,image_constraints
2025-11-01,Black Friday Sale,Promote special discounts for Black Friday,@shoppers;@deals,dark theme;product focused
2025-11-15,Holiday Collection,Showcase winter fashion collection,@fashion;@style,bright;lifestyle
2025-12-01,Christmas Special,Announce Christmas deals and gifts,@gifts;@holidays,festive;red and green`;

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'campaign_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden', 'success', 'error');
        toast.classList.add(type);
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize batch upload functionality
document.addEventListener('DOMContentLoaded', () => {
    window.batchUpload = new BatchUpload();
});