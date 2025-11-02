// ============================================
// SIMPLE AD GENERATOR - JAVASCRIPT
// ============================================

class SimpleAdGenerator {
  constructor() {
    this.form = document.getElementById('adGeneratorForm');
    this.productNameInput = document.getElementById('productName');
    this.productDescInput = document.getElementById('productDescription');
    this.targetAudienceInput = document.getElementById('targetAudience');
    this.brandColorsInput = document.getElementById('brandColors');
    this.adStyleSelect = document.getElementById('adStyle');
    
    this.generateBtn = document.getElementById('generateBtn');
    this.btnText = document.getElementById('btnText');
    this.backBtn = document.getElementById('backBtn');
    
    this.emptyState = document.getElementById('emptyState');
    this.loadingState = document.getElementById('loadingState');
    this.imageContainer = document.getElementById('imageContainer');
    this.generatedImage = document.getElementById('generatedImage');
    this.adInfoCard = document.getElementById('adInfoCard');
    
    this.errorMessage = document.getElementById('errorMessage');
    this.errorText = document.getElementById('errorText');
    
    this.charCount = document.getElementById('charCount');
    
    this.downloadBtn = document.getElementById('downloadBtn');
    this.shareBtn = document.getElementById('shareBtn');
    this.regenerateBtn = document.getElementById('regenerateBtn');
    
    this.isGenerating = false;
    this.currentAdData = null;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleGenerate();
    });

    // Character counter
    this.productDescInput.addEventListener('input', () => {
      this.updateCharCount();
    });

    // Back button
    this.backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    // Action buttons
    this.downloadBtn.addEventListener('click', () => this.downloadImage());
    this.shareBtn.addEventListener('click', () => this.shareImage());
    this.regenerateBtn.addEventListener('click', () => this.handleGenerate());
  }

  updateCharCount() {
    const count = this.productDescInput.value.length;
    this.charCount.textContent = count;
    
    if (count > 450) {
      this.charCount.style.color = '#ef4444';
    } else if (count > 400) {
      this.charCount.style.color = '#f59e0b';
    } else {
      this.charCount.style.color = '#9ca3af';
    }
  }

  async handleGenerate() {
    if (this.isGenerating) return;

    // Validate form
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }

    // Get form data
    const formData = {
      productName: this.productNameInput.value.trim(),
      productDescription: this.productDescInput.value.trim(),
      targetAudience: this.targetAudienceInput.value.trim(),
      brandColors: this.brandColorsInput.value.trim(),
      adStyle: this.adStyleSelect.value
    };

    // Start generation
    this.startGeneration();

    try {
      // Build AI prompt
      const prompt = this.buildPrompt(formData);
      
      // Call AI generation API (simulated for now)
      const result = await this.generateAdImage(prompt, formData);
      
      // Display result
      this.displayGeneratedAd(result, formData);
      
      // Show success toast
      this.showToast('Advertisement generated successfully!', 'success');
      
    } catch (error) {
      console.error('Generation error:', error);
      this.showError(error.message || 'Failed to generate advertisement. Please try again.');
      this.showToast('Generation failed. Please try again.', 'error');
    } finally {
      this.stopGeneration();
    }
  }

  buildPrompt(formData) {
    let prompt = `Create a professional advertisement image for:\n`;
    prompt += `Product: ${formData.productName}\n`;
    prompt += `Description: ${formData.productDescription}\n`;
    
    if (formData.targetAudience) {
      prompt += `Target Audience: ${formData.targetAudience}\n`;
    }
    
    if (formData.brandColors) {
      prompt += `Brand Colors: ${formData.brandColors}\n`;
    }
    
    prompt += `Style: ${this.getStyleDescription(formData.adStyle)}\n`;
    prompt += `\nRequirements: Modern, eye-catching, high-quality commercial advertisement with clear product focus and professional composition.`;
    
    return prompt;
  }

  getStyleDescription(style) {
    const styles = {
      modern: 'Modern and minimalist with clean lines',
      bold: 'Bold and vibrant with strong colors',
      elegant: 'Elegant and professional with sophisticated design',
      playful: 'Playful and creative with fun elements',
      luxury: 'Luxury and premium with high-end aesthetics'
    };
    return styles[style] || 'Modern and professional';
  }

  async generateAdImage(prompt, formData) {
    // Simulate API call with delay
    await this.delay(3000);
    
    // For demonstration, we'll use a placeholder image service
    // In production, this would call your actual AI image generation API
    
    // Example API call structure (commented out):
    /*
    const response = await fetch('/api/generate-ad-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        productName: formData.productName,
        description: formData.productDescription,
        style: formData.adStyle
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return {
      imageUrl: data.imageUrl,
      generatedAt: new Date().toISOString()
    };
    */
    
    // Simulated response with placeholder
    return {
      imageUrl: `https://via.placeholder.com/800x600/5b5fff/ffffff?text=${encodeURIComponent(formData.productName)}`,
      generatedAt: new Date().toISOString()
    };
  }

  startGeneration() {
    this.isGenerating = true;
    this.generateBtn.disabled = true;
    this.generateBtn.classList.add('loading');
    this.btnText.textContent = 'Generating...';
    
    // Hide states
    this.emptyState.style.display = 'none';
    this.imageContainer.classList.add('hidden');
    this.adInfoCard.classList.add('hidden');
    this.errorMessage.classList.add('hidden');
    
    // Show loading
    this.loadingState.classList.remove('hidden');
  }

  stopGeneration() {
    this.isGenerating = false;
    this.generateBtn.disabled = false;
    this.generateBtn.classList.remove('loading');
    this.btnText.textContent = 'Generate Advertisement';
    
    // Hide loading
    this.loadingState.classList.add('hidden');
  }

  displayGeneratedAd(result, formData) {
    // Store current ad data
    this.currentAdData = {
      ...formData,
      imageUrl: result.imageUrl,
      generatedAt: result.generatedAt
    };
    
    // Display image
    this.generatedImage.src = result.imageUrl;
    this.imageContainer.classList.remove('hidden');
    
    // Update info card
    document.getElementById('infoProduct').textContent = formData.productName;
    document.getElementById('infoStyle').textContent = this.getStyleLabel(formData.adStyle);
    document.getElementById('infoDate').textContent = this.formatDate(result.generatedAt);
    this.adInfoCard.classList.remove('hidden');
  }

  getStyleLabel(style) {
    const labels = {
      modern: 'Modern & Minimalist',
      bold: 'Bold & Vibrant',
      elegant: 'Elegant & Professional',
      playful: 'Playful & Creative',
      luxury: 'Luxury & Premium'
    };
    return labels[style] || style;
  }

  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showError(message) {
    this.errorText.textContent = message;
    this.errorMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.errorMessage.classList.add('hidden');
    }, 5000);
  }

  downloadImage() {
    if (!this.currentAdData || !this.currentAdData.imageUrl) {
      this.showToast('No image to download', 'error');
      return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = this.currentAdData.imageUrl;
    link.download = `${this.currentAdData.productName.replace(/\s+/g, '_')}_ad.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showToast('Image downloaded successfully!', 'success');
  }

  shareImage() {
    if (!this.currentAdData || !this.currentAdData.imageUrl) {
      this.showToast('No image to share', 'error');
      return;
    }
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: `Advertisement: ${this.currentAdData.productName}`,
        text: this.currentAdData.productDescription,
        url: this.currentAdData.imageUrl
      })
      .then(() => {
        this.showToast('Shared successfully!', 'success');
      })
      .catch((error) => {
        console.error('Share failed:', error);
      });
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(this.currentAdData.imageUrl)
        .then(() => {
          this.showToast('Image link copied to clipboard!', 'success');
        })
        .catch(() => {
          this.showToast('Share not supported on this browser', 'error');
        });
    }
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// THEME SYNC - Apply theme from dashboard
// ============================================

function applyThemeFromDashboard() {
  // Check localStorage for theme preference set by dashboard
  // Dashboard uses 'automatter_theme' as the key
  const savedTheme = localStorage.getItem('automatter_theme');

  console.log('Single Ad: Applying theme from localStorage:', savedTheme);

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    console.log('Single Ad: Dark mode applied');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    console.log('Single Ad: Light mode applied');
  } else {
    // If no preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-mode');
      console.log('Single Ad: Dark mode applied (system preference)');
    } else {
      console.log('Single Ad: Light mode applied (system preference)');
    }
  }
}

// Apply theme immediately (before DOM loads) to prevent flash
applyThemeFromDashboard();

// CRITICAL: pageshow event fires every time page is shown (including back/forward navigation)
window.addEventListener('pageshow', (event) => {
  console.log('Single Ad: pageshow event fired, persisted:', event.persisted);
  applyThemeFromDashboard();
});

// Listen for storage changes (when theme is changed in another tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'automatter_theme') {
    console.log('Single Ad: storage event - theme changed to:', e.newValue);
    if (e.newValue === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
});

// Re-apply theme when page becomes visible (when navigating back)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('Single Ad: visibilitychange - page visible');
    applyThemeFromDashboard();
  }
});

// Also check when window gains focus (when user comes back to this tab)
window.addEventListener('focus', () => {
  console.log('Single Ad: focus event');
  applyThemeFromDashboard();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Single Ad: DOMContentLoaded');
  new SimpleAdGenerator();
  applyThemeFromDashboard(); // Apply again to be sure
});

