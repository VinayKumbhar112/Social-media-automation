// ============================================
// AUTHENTICATION SYSTEM
// ============================================

class AuthManager {
  constructor() {
    this.user = null;
    this.pendingAction = null;
    this.loadUserFromStorage();
    this.initializeAuthUI();
  }

  loadUserFromStorage() {
    const storedUser = localStorage.getItem("automatter_user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.updateUI();
    }
  }

  saveUserToStorage() {
    if (this.user) {
      localStorage.setItem("automatter_user", JSON.stringify(this.user));
    }
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email && password) {
          this.user = {
            id: "user_" + Date.now(),
            email: email,
            initials: email.split("@")[0].substring(0, 2).toUpperCase(),
            createdAt: new Date().toISOString(),
          };
          this.saveUserToStorage();
          this.updateUI();
          resolve(this.user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  }

  register(email, password, confirmPassword) {
    return new Promise((resolve, reject) => {
      if (password !== confirmPassword) {
        reject(new Error("Passwords do not match"));
        return;
      }
      if (password.length < 6) {
        reject(new Error("Password must be at least 6 characters"));
        return;
      }
      // Simulate API call
      setTimeout(() => {
        this.user = {
          id: "user_" + Date.now(),
          email: email,
          initials: email.split("@")[0].substring(0, 2).toUpperCase(),
          createdAt: new Date().toISOString(),
        };
        this.saveUserToStorage();
        this.updateUI();
        resolve(this.user);
      }, 500);
    });
  }

  logout() {
    this.user = null;
    localStorage.removeItem("automatter_user");
    // Dispatch logout event
    document.dispatchEvent(new Event('logout'));
    this.updateUI();
    this.hideAuthModal();
  }

  updateUI() {
    // Update old UI elements for backward compatibility
    const userInitials = document.getElementById("userInitials");
    const userEmail = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");

    if (this.user) {
      if (userInitials) userInitials.textContent = this.user.initials;
      if (userEmail) userEmail.textContent = this.user.email;
      if (logoutBtn) logoutBtn.style.display = "block";
      if (loginBtn) loginBtn.classList.remove("show");
    } else {
      if (userInitials) userInitials.textContent = "--";
      if (userEmail) userEmail.textContent = "Not logged in";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (loginBtn) loginBtn.classList.add("show");
    }

    // Update dashboard header if it exists
    if (typeof window.dashboardHeader !== "undefined" && window.dashboardHeader) {
      window.dashboardHeader.updateUserMenu();
    }
  }

  showAuthModal(pendingAction = null) {
    this.pendingAction = pendingAction;
    document.getElementById("authModal").classList.remove("hidden");
  }

  hideAuthModal() {
    document.getElementById("authModal").classList.add("hidden");
  }

  executePendingAction() {
    if (this.pendingAction && typeof this.pendingAction === "function") {
      this.pendingAction();
      this.pendingAction = null;
    }
  }

  initializeAuthUI() {
    // Auth modal close button
    document.getElementById("closeAuthModal").addEventListener("click", () => {
      this.hideAuthModal();
    });

    // Modal overlay click to close
    document.querySelector(".modal-overlay").addEventListener("click", () => {
      this.hideAuthModal();
    });

    // Auth tabs
    document.querySelectorAll(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        document
          .querySelectorAll(".auth-tab")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelectorAll(".auth-form")
          .forEach((f) => f.classList.remove("active"));
        e.target.classList.add("active");
        document.getElementById(tabName + "Form").classList.add("active");
      });
    });

    // Login form
    document
      .getElementById("loginForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const btn = document.getElementById("loginBtn");

        btn.disabled = true;
        btn.textContent = "Logging in...";

        try {
          await this.login(email, password);
          this.showToast("Login successful!", "success");
          this.hideAuthModal();
          // Dispatch login success event
          document.dispatchEvent(new Event('login-success'));
          this.executePendingAction();
          document.getElementById("loginForm").reset();
        } catch (error) {
          this.showToast(error.message, "error");
        } finally {
          btn.disabled = false;
          btn.textContent = "Login";
        }
      });

    // Register form
    document
      .getElementById("registerForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirm = document.getElementById("registerConfirm").value;
        const btn = document.getElementById("registerBtn");

        btn.disabled = true;
        btn.textContent = "Creating account...";

        try {
          await this.register(email, password, confirm);
          this.showToast("Account created successfully!", "success");
          this.hideAuthModal();
          this.executePendingAction();
          document.getElementById("registerForm").reset();
        } catch (error) {
          this.showToast(error.message, "error");
        } finally {
          btn.disabled = false;
          btn.textContent = "Create Account";
        }
      });

    // User avatar dropdown
    document.getElementById("userAvatar").addEventListener("click", () => {
      const dropdown = document.getElementById("userDropdown");
      dropdown.classList.toggle("hidden");
    });

    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.logout();
      document.getElementById("userDropdown").classList.add("hidden");
      this.showToast("Logged out successfully", "success");
    });

    // Login button in dropdown
    document.getElementById("loginBtn").addEventListener("click", () => {
      this.showAuthModal();
      document.getElementById("userDropdown").classList.add("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        document.getElementById("userDropdown").classList.add("hidden");
      }
    });

    this.updateUI();
  }

  showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove("hidden");

    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.classList.remove("active");
    });
    this.classList.add("active");
  });
});

// ============================================
// DASHBOARD HEADER FUNCTIONALITY
// ============================================

class DashboardHeader {
  constructor() {
    this.searchSuggestions = [
      {
        icon: "🎯",
        label: "Generate Single Ad",
        href: "#generate-ad",
        keywords: ["generate", "ad", "create", "advertisement"],
      },
      {
        icon: "👁️",
        label: "My Topics",
        href: "#topics",
        keywords: ["topics", "campaigns", "view", "manage"],
      },
      {
        icon: "🤖",
        label: "Auto Post",
        href: "#auto-post",
        keywords: ["auto", "post", "automated", "posting"],
      },
      {
        icon: "📅",
        label: "Scheduled Posts",
        href: "#scheduled",
        keywords: ["scheduled", "posts", "calendar", "upcoming"],
      },
      {
        icon: "📊",
        label: "Analytics",
        href: "#analytics",
        keywords: ["analytics", "stats", "reports", "data"],
      },
      {
        icon: "⚙️",
        label: "Settings",
        href: "#settings",
        keywords: ["settings", "preferences", "config", "options"],
      },
    ];

    this.initializeSearch();
    this.initializeThemeToggle();
    this.initializeUserMenu();
  }

  // ============================================
  // SEARCH FUNCTIONALITY
  // ============================================

  initializeSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchPopover = document.getElementById("searchPopover");
    const searchSuggestions = document.getElementById("searchSuggestions");

    if (!searchInput) return;

    // Show suggestions on focus
    searchInput.addEventListener("focus", () => {
      this.renderSuggestions("", searchSuggestions);
      searchPopover.classList.remove("hidden");
    });

    // Filter suggestions on input
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      this.renderSuggestions(query, searchSuggestions);

      if (query.length > 0) {
        searchPopover.classList.remove("hidden");
      } else {
        searchPopover.classList.remove("hidden");
      }
    });

    // Close popover when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        searchPopover.classList.add("hidden");
      }
    });
  }

  renderSuggestions(query, container) {
    const filtered = this.searchSuggestions.filter((suggestion) => {
      const matchLabel = suggestion.label
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchKeywords = suggestion.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase())
      );
      return matchLabel || matchKeywords;
    });

    container.innerHTML = filtered
      .map(
        (suggestion) => `
      <button class="search-suggestion" data-href="${suggestion.href}">
        <span class="search-suggestion-icon">${suggestion.icon}</span>
        <div class="search-suggestion-label">${suggestion.label}</div>
      </button>
    `
      )
      .join("");

    // Add click handlers to suggestions
    container.querySelectorAll(".search-suggestion").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const label = btn.textContent.trim();
        document.getElementById("searchPopover").classList.add("hidden");
        document.getElementById("searchInput").value = "";
        authManager.showToast(`Navigating to ${label}...`);
      });
    });
  }

  // ============================================
  // THEME TOGGLE FUNCTIONALITY
  // ============================================

  initializeThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    // Load theme preference from localStorage
    const isDarkMode = localStorage.getItem("automatter_theme") === "dark";
    if (isDarkMode) {
      this.applyDarkTheme();
    }

    // Toggle theme on button click
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      if (isDark) {
        this.applyLightTheme();
        localStorage.setItem("automatter_theme", "light");
      } else {
        this.applyDarkTheme();
        localStorage.setItem("automatter_theme", "dark");
      }
    });
  }

  applyDarkTheme() {
    document.body.classList.add("dark-mode");
    authManager.showToast("Dark mode enabled", "success");
  }

  applyLightTheme() {
    document.body.classList.remove("dark-mode");
    authManager.showToast("Light mode enabled", "success");
  }

  // ============================================
  // USER MENU FUNCTIONALITY
  // ============================================

  initializeUserMenu() {
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");

    if (!userAvatar) return;

    // Toggle dropdown on avatar click
    userAvatar.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        userDropdown.classList.add("hidden");
      }
    });

    // Update user menu when auth state changes
    this.updateUserMenu();
  }

  updateUserMenu() {
    const userInitials = document.getElementById("userInitials");
    const userInitialsLarge = document.getElementById("userInitialsLarge");
    const userEmailDisplay = document.getElementById("userEmailDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");

    if (authManager.user) {
      userInitials.textContent = authManager.user.initials;
      userInitialsLarge.textContent = authManager.user.initials;
      userEmailDisplay.textContent = authManager.user.email;
      logoutBtn.classList.remove("hidden");
      loginBtn.classList.add("hidden");
    } else {
      userInitials.textContent = "--";
      userInitialsLarge.textContent = "--";
      userEmailDisplay.textContent = "Not logged in";
      logoutBtn.classList.add("hidden");
      loginBtn.classList.remove("hidden");
    }
  }

  getInitials(email) {
    if (!email) return "--";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  }
}

// Initialize Dashboard Header
const dashboardHeader = new DashboardHeader();
window.dashboardHeader = dashboardHeader; // Make it globally accessible

// ============================================
// QUICK ACTIONS FUNCTIONALITY
// ============================================

class QuickActionsManager {
  constructor() {
    this.initializeActionCards();
    this.initializeSocialCards();
  }

  initializeActionCards() {
    const actionCards = document.querySelectorAll(".action-card");
    console.log('QuickActions: Found', actionCards.length, 'action cards');

    actionCards.forEach((card) => {
      const action = card.getAttribute("data-action");
      console.log('QuickActions: Attaching listener to card with action:', action);

      card.addEventListener("click", (e) => {
        console.log('QuickActions: Card clicked!', action);
        e.preventDefault();
        e.stopPropagation();

        const title = card.querySelector("h4").textContent;

        // Direct navigation for generate-ad (bypass all other logic)
        if (action === "generate-ad") {
          console.log('QuickActions: Direct navigation to simple-ad.html');
          window.location.href = "simple-ad.html";
          return;
        }

        this.handleActionClick(action, title);
      });
    });
  }

  initializeSocialCards() {
    const socialCards = document.querySelectorAll(".social-card");

    socialCards.forEach((card) => {
      card.addEventListener("click", () => {
        const platform = card.getAttribute("data-platform");
        const title = card.querySelector("h4").textContent;
        this.handleSocialClick(platform, title);
      });
    });
  }

  handleActionClick(action, actionTitle) {
    console.log('QuickActions: Action clicked:', action, actionTitle);
    // Allow direct access to Single Ad Generator and Auto Post without authentication
    if (action === "generate-ad" || action === "auto-post") {
      console.log('QuickActions: Bypassing auth for', action);
      this.executeAction(action, actionTitle);
      return;
    }

    // Require authentication for other actions
    if (!authManager.user) {
      authManager.showAuthModal(() => {
        this.executeAction(action, actionTitle);
      });
      return;
    }
    this.executeAction(action, actionTitle);
  }

  handleSocialClick(platform, platformName) {
    if (!authManager.user) {
      authManager.showAuthModal(() => {
        this.executeSocialAction(platform, platformName);
      });
      return;
    }
    this.executeSocialAction(platform, platformName);
  }

  executeAction(action, actionTitle) {
    switch (action) {
      case "generate-ad":
        this.openGenerateAdModal();
        break;
      case "my-topics":
        this.openMyTopicsModal();
        break;
      case "auto-post":
        this.openAutoPostModal();
        break;
    }
  }

  executeSocialAction(platform, platformName) {
    switch (platform) {
      case "twitter":
        this.openTwitterDirectPost();
        break;
      case "linkedin":
        this.openLinkedInDirectPost();
        break;
      case "instagram":
        this.openInstagramDirectPost();
        break;
    }
  }

  openGenerateAdModal() {
    console.log('QuickActions: Navigating to simple-ad.html');
    // Navigate to the single ad generator page
    window.location.href = "simple-ad.html";
  }

  openMyTopicsModal() {
    authManager.showToast("Opening My Topics...", "success");
    // Modal implementation would go here
  }

  openAutoPostModal() {
    console.log('QuickActions: Opening Auto Post Modal...');
    console.log('QuickActions: autoPostManager exists:', !!window.autoPostManager);
    if (window.autoPostManager) {
      window.autoPostManager.openModal();
    } else {
      console.error('QuickActions: autoPostManager not found!');
    }
  }

  openTwitterDirectPost() {
    authManager.showToast("Opening Twitter Direct Post...", "success");
    // Direct post implementation would go here
  }

  openLinkedInDirectPost() {
    authManager.showToast("Opening LinkedIn Direct Post...", "success");
    // Direct post implementation would go here
  }

  openInstagramDirectPost() {
    authManager.showToast("Opening Instagram Direct Post...", "success");
    // Direct post implementation would go here
  }
}

// ============================================
// BATCH UPLOAD FUNCTIONALITY
// ============================================

class BatchUploadManager {
  constructor() {
    this.fileInput = document.getElementById("fileInput");
    this.dragOverlay = document.getElementById("dragOverlay");
    this.uploadBtn = document.getElementById("uploadFileBtn");
    this.batchSection = document.getElementById("batchUploadSection");

    this.initializeUploadButton();
    this.initializeDragAndDrop();
    this.initializeFileInput();
  }

  initializeUploadButton() {
    if (this.uploadBtn) {
      this.uploadBtn.addEventListener("click", () => {
        this.handleUploadClick();
      });
    }
  }

  handleUploadClick() {
    if (!authManager.user) {
      authManager.showAuthModal(() => {
        this.fileInput.click();
      });
      return;
    }
    this.fileInput.click();
  }

  initializeDragAndDrop() {
    if (!this.batchSection) return;

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.batchSection.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
      this.batchSection.addEventListener(eventName, () => {
        this.showDragOverlay();
      });
    });

    // Unhighlight drop area when item leaves
    ["dragleave", "drop"].forEach((eventName) => {
      this.batchSection.addEventListener(eventName, () => {
        this.hideDragOverlay();
      });
    });

    // Handle dropped files
    this.batchSection.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      this.handleFiles(files);
    });
  }

  initializeFileInput() {
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => {
        this.handleFiles(e.target.files);
      });
    }
  }

  showDragOverlay() {
    if (this.dragOverlay) {
      this.dragOverlay.classList.remove("hidden");
    }
  }

  hideDragOverlay() {
    if (this.dragOverlay) {
      this.dragOverlay.classList.add("hidden");
    }
  }

    handleFiles(files) {
        // Process files directly without auth check
        this.processFiles(files);
    }  processFiles(files) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      return (
        validTypes.includes(file.type) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv")
      );
    });

    if (validFiles.length === 0) {
      authManager.showToast("Please upload valid Excel or CSV files", "error");
      return;
    }

    if (validFiles.length > 0) {
      authManager.showToast(
        `Uploading ${validFiles.length} file(s)...`,
        "success"
      );
      this.uploadFiles(validFiles);
    }
  }

  uploadFiles(files) {
    // Simulate file upload
    files.forEach((file) => {
      console.log(
        `Uploading: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      );
    });

    // Show success message after a delay
    setTimeout(() => {
      authManager.showToast(
        `Successfully uploaded ${files.length} file(s)!`,
        "success"
      );
    }, 1500);
  }

  openUploadModal() {
    authManager.showToast("Upload functionality coming soon!", "success");
    // Upload modal implementation would go here
  }
}

const batchUploadManager = new BatchUploadManager();

// ============================================
// UPGRADE FUNCTIONALITY
// ============================================

const upgradeBtn = document.querySelector(".upgrade-btn");
if (upgradeBtn) {
  upgradeBtn.addEventListener("click", function () {
    if (!authManager.user) {
      authManager.showAuthModal();
      return;
    }
    authManager.showToast("Redirecting to upgrade page...", "success");
  });
}

// ============================================
// THEME TOGGLE
// ============================================

class ThemeManager {
  constructor() {
    this.isDarkMode = localStorage.getItem("automatter_theme") === "dark";
    this.initializeTheme();
  }

  initializeTheme() {
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(
      "automatter_theme",
      this.isDarkMode ? "dark" : "light"
    );
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.style.backgroundColor = "#0F1419";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#fafbfc";
      document.body.style.color = "#1A1D23";
    }
  }
}

const themeManager = new ThemeManager();

// ============================================
// STATISTICS DASHBOARD
// ============================================

class StatisticsManager {
  constructor() {
    this.stats = {
      campaigns: 24,
      images: 156,
      posts: 42,
      successRate: 94,
    };
    this.initializeStats();
  }

  initializeStats() {
    this.updateStatCards();
  }

  updateStatCards() {
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        this.showStatDetails(index);
      });
    });
  }

  showStatDetails(index) {
    const statNames = [
      "Total Campaigns",
      "Images Generated",
      "Posts Scheduled",
      "Success Rate",
    ];
    authManager.showToast(`${statNames[index]} details loaded`, "success");
  }

  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats };
    this.updateStatCards();
  }
}

const statisticsManager = new StatisticsManager();

// ============================================
// SCHEDULED POSTS MANAGEMENT
// ============================================

class ScheduledPostsManager {
  constructor() {
    this.posts = [
      {
        id: 1,
        title: "Summer Campaign 2025",
        description: "Exciting new summer collection launch",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f0f0f0' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='12' font-family='Arial'%3EImg%3C/text%3E%3C/svg%3E",
        time: "03/20/2024, 03:30 PM (UTC)",
        status: "pending",
      },
    ];
    this.initializeScheduledPosts();
  }

  initializeScheduledPosts() {
    const refreshBtn = document.querySelector(".refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.refreshPosts();
      });
    }

    const filterDropdown = document.querySelector(".filter-dropdown");
    if (filterDropdown) {
      filterDropdown.addEventListener("change", (e) => {
        this.filterPosts(e.target.value);
      });
    }

    this.renderPosts();
  }

  renderPosts() {
    const postsList = document.querySelector(".scheduled-posts-list");
    if (!postsList) return;

    postsList.innerHTML = this.posts
      .map(
        (post) => `
      <div class="post-item" data-post-id="${post.id}">
        <div class="post-thumbnail">
          <img src="${post.image}" alt="${post.title}" />
        </div>
        <div class="post-content">
          <h4>${post.title}</h4>
          <p>${post.description}</p>
          <span class="post-time">📅 ${post.time}</span>
        </div>
        <div class="post-status">
          <span class="status-badge ${post.status}">${post.status}</span>
        </div>
        <div class="post-actions">
          <button class="action-btn open-btn" title="Open">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
          <button class="action-btn delete-btn" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");

    // Add event listeners to action buttons
    postsList.querySelectorAll(".open-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const postId = e.closest(".post-item").dataset.postId;
        this.openPost(postId);
      });
    });

    postsList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const postId = e.closest(".post-item").dataset.postId;
        this.deletePost(postId);
      });
    });
  }

  refreshPosts() {
    authManager.showToast("Posts refreshed!", "success");
    this.renderPosts();
  }

  filterPosts(filter) {
    authManager.showToast(`Filtering by: ${filter}`, "success");
    // Filter logic would go here
  }

  openPost(postId) {
    authManager.showToast(`Opening post ${postId}`, "success");
  }

  deletePost(postId) {
    this.posts = this.posts.filter((p) => p.id !== parseInt(postId));
    authManager.showToast("Post deleted successfully", "success");
    this.renderPosts();
  }

  addPost(post) {
    this.posts.push({
      ...post,
      id: Math.max(...this.posts.map((p) => p.id), 0) + 1,
    });
    this.renderPosts();
  }
}

const scheduledPostsManager = new ScheduledPostsManager();

// ============================================
// SIDEBAR NAVIGATION MANAGER
// ============================================

class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.navItems = document.querySelectorAll(".nav-item");
    this.upgradeBtn = document.getElementById("upgradeBtn");
    this.currentActive = "dashboard";

    this.initializeNavigation();
    this.initializeUpgradeButton();
  }

  initializeNavigation() {
    this.navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const navId = item.getAttribute("data-nav");
        this.setActive(navId);
        this.navigate(navId);
      });
    });
  }

  setActive(navId) {
    // Remove active class from all items
    this.navItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to clicked item
    const activeItem = document.querySelector(`[data-nav="${navId}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
      this.currentActive = navId;
    }
  }

  navigate(navId) {
    const routes = {
      dashboard: "index.html",
      "single-ad": "simple-ad.html",
      schedule: "/schedule",
      analytics: "analytics.html",
      settings: "/settings",
    };

    const route = routes[navId];
    if (route) {
      // Navigate to single-ad page
      if (navId === "single-ad") {
        window.location.href = route;
      } else if (navId === "analytics") {
        window.location.href = route;
      } else if (navId === "dashboard") {
        window.location.href = route;
      } else {
        authManager.showToast(`Navigating to ${navId}...`, "success");
        // Other routes would be implemented here
      }
    }
  }

  initializeUpgradeButton() {
    if (this.upgradeBtn) {
      this.upgradeBtn.addEventListener("click", () => {
        if (!authManager.user) {
          authManager.showAuthModal(() => {
            authManager.showToast(
              "Upgrade available for Pro members!",
              "success"
            );
          });
        } else {
          authManager.showToast("Redirecting to upgrade page...", "success");
        }
      });
    }
  }
}

const sidebarManager = new SidebarManager();

// Stat cards animation on hover
document.querySelectorAll(".stat-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-4px)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth";

// ============================================
// MODAL SYSTEMS
// ============================================

class UploadModalManager {
  constructor() {
    this.modal = document.getElementById("uploadModal");
    this.dragDropZone = document.getElementById("dragDropZone");
    this.fileInput = document.getElementById("fileInput");
    this.browseFilesBtn = document.getElementById("browseFilesBtn");
    this.uploadProcessBtn = document.getElementById("uploadProcessBtn");
    this.cancelUploadBtn = document.getElementById("cancelUploadBtn");
    this.downloadSampleBtn = document.getElementById("downloadSampleBtn");
    this.closeUploadModal = document.getElementById("closeUploadModal");
    this.dragDropText = document.getElementById("dragDropText");
    this.uploadResult = document.getElementById("uploadResult");
    this.scheduleName = document.getElementById("scheduleName");

    this.selectedFile = null;
    this.isUploading = false;

    this.initialize();
  }

  initialize() {
    // Drag-drop events
    this.dragDropZone.addEventListener("dragover", (e) =>
      this.handleDragOver(e)
    );
    this.dragDropZone.addEventListener("dragleave", (e) =>
      this.handleDragLeave(e)
    );
    this.dragDropZone.addEventListener("drop", (e) => this.handleDrop(e));

    // File input
    this.browseFilesBtn.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    // Buttons
    this.uploadProcessBtn.addEventListener("click", () => this.handleUpload());
    this.cancelUploadBtn.addEventListener("click", () => this.closeModal());
    this.closeUploadModal.addEventListener("click", () => this.closeModal());
    this.downloadSampleBtn.addEventListener("click", () =>
      this.downloadSample()
    );
  }

  handleDragOver(e) {
    e.preventDefault();
    this.dragDropZone.classList.add("dragging");
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.dragDropZone.classList.remove("dragging");
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragDropZone.classList.remove("dragging");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        this.selectedFile = file;
        this.dragDropText.textContent = `✅ ${file.name}`;
        authManager.showToast("File selected successfully", "success");
      } else {
        authManager.showToast(
          "Please upload an Excel file (.xlsx or .xls)",
          "error"
        );
      }
    }
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        this.selectedFile = file;
        this.dragDropText.textContent = `✅ ${file.name}`;
        authManager.showToast("File selected successfully", "success");
      } else {
        authManager.showToast(
          "Please upload an Excel file (.xlsx or .xls)",
          "error"
        );
      }
    }
  }

  handleUpload() {
    if (!this.selectedFile) {
      authManager.showToast("Please select a file first", "error");
      return;
    }

    this.isUploading = true;
    this.uploadProcessBtn.disabled = true;
    this.uploadProcessBtn.textContent = "Uploading...";

    // Simulate API call
    setTimeout(() => {
      const topicsCreated = Math.floor(Math.random() * 20) + 5;
      this.uploadResult.textContent = `✅ Successfully created ${topicsCreated} topics!`;
      this.uploadResult.classList.remove("hidden");

      authManager.showToast(
        `Successfully created ${topicsCreated} topics!`,
        "success"
      );

      this.isUploading = false;
      this.uploadProcessBtn.disabled = false;
      this.uploadProcessBtn.textContent = "Upload & Process";

      // Reset after 2 seconds
      setTimeout(() => {
        this.closeModal();
      }, 2000);
    }, 2000);
  }

  downloadSample() {
    authManager.showToast("Sample template downloaded", "success");
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.selectedFile = null;
    this.dragDropText.textContent = "Drag and drop your Excel file here";
    this.uploadResult.classList.add("hidden");
    this.uploadProcessBtn.disabled = false;
    this.uploadProcessBtn.textContent = "Upload & Process";
    this.scheduleName.value = "";
  }

  openModal() {
    this.modal.classList.remove("hidden");
  }
}

// OLD DirectPostModalManager - DISABLED (using new one from direct-post-modal.js)
class OldDirectPostModalManager {
  constructor() {
    this.modal = document.getElementById("directPostModal");
    this.imageDropZone = document.getElementById("imageDropZone");
    this.imageFileInput = document.getElementById("imageFileInput");
    this.browseImageBtn = document.getElementById("browseImageBtn");
    this.imageUrlInput = document.getElementById("imageUrlInput");
    this.captionInput = document.getElementById("captionInput");
    this.scheduleCheckbox = document.getElementById("scheduleCheckbox");
    this.scheduleFields = document.getElementById("scheduleFields");
    this.submitDirectPostBtn = document.getElementById("submitDirectPostBtn");
    this.cancelDirectPostBtn = document.getElementById("cancelDirectPostBtn");
    this.closeDirectPostModal = document.getElementById("closeDirectPostModal");
    this.imagePreviewContainer = document.getElementById(
      "imagePreviewContainer"
    );
    this.imagePreview = document.getElementById("imagePreview");
    this.imageUploadPrompt = document.getElementById("imageUploadPrompt");
    this.removeImageBtn = document.getElementById("removeImageBtn");

    this.imageFile = null;
    this.previewUrl = null;
    this.isPosting = false;

    this.initialize();
  }

  initialize() {
    // Drag-drop
    this.imageDropZone.addEventListener("dragover", (e) =>
      this.handleDragOver(e)
    );
    this.imageDropZone.addEventListener("dragleave", (e) =>
      this.handleDragLeave(e)
    );
    this.imageDropZone.addEventListener("drop", (e) => this.handleDrop(e));

    // File input
    this.browseImageBtn.addEventListener("click", () =>
      this.imageFileInput.click()
    );
    this.imageFileInput.addEventListener("change", (e) =>
      this.handleImageSelect(e)
    );

    // URL input
    this.imageUrlInput.addEventListener("change", (e) =>
      this.handleUrlInput(e)
    );

    // Schedule checkbox
    this.scheduleCheckbox.addEventListener("change", () => {
      this.scheduleFields.classList.toggle("hidden");
    });

    // Buttons
    this.submitDirectPostBtn.addEventListener("click", () =>
      this.handleSubmit()
    );
    this.cancelDirectPostBtn.addEventListener("click", () => this.closeModal());
    this.closeDirectPostModal.addEventListener("click", () =>
      this.closeModal()
    );
    this.removeImageBtn.addEventListener("click", () => this.removeImage());
  }

  handleDragOver(e) {
    e.preventDefault();
    this.imageDropZone.classList.add("dragging");
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.imageDropZone.classList.remove("dragging");
  }

  handleDrop(e) {
    e.preventDefault();
    this.imageDropZone.classList.remove("dragging");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        this.imageFile = file;
        this.createPreview(file);
        authManager.showToast("Image selected successfully", "success");
      } else {
        authManager.showToast("Please upload an image file", "error");
      }
    }
  }

  handleImageSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        this.imageFile = file;
        this.createPreview(file);
        authManager.showToast("Image selected successfully", "success");
      } else {
        authManager.showToast("Please upload an image file", "error");
      }
    }
  }

  createPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target.result;
      this.imagePreview.src = this.previewUrl;
      this.imagePreviewContainer.classList.remove("hidden");
      this.imageUploadPrompt.classList.add("hidden");
      this.imageUrlInput.disabled = true;
    };
    reader.readAsDataURL(file);
  }

  handleUrlInput(e) {
    const url = e.target.value;
    if (url && this.isValidImageUrl(url)) {
      this.previewUrl = url;
      this.imagePreview.src = url;
      this.imagePreviewContainer.classList.remove("hidden");
      this.imageUploadPrompt.classList.add("hidden");
      this.imageFile = null;
    }
  }

  isValidImageUrl(url) {
    try {
      new URL(url);
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const hasImageExtension = imageExtensions.some((ext) =>
        url.toLowerCase().includes(ext)
      );
      const knownHosts = ["imgur", "imgbb", "cloudinary"];
      const hasKnownHost = knownHosts.some((host) =>
        url.toLowerCase().includes(host)
      );
      return hasImageExtension || hasKnownHost;
    } catch {
      return false;
    }
  }

  removeImage() {
    this.imageFile = null;
    this.previewUrl = null;
    this.imagePreviewContainer.classList.add("hidden");
    this.imageUploadPrompt.classList.remove("hidden");
    this.imageUrlInput.disabled = false;
    this.imageUrlInput.value = "";
  }

  handleSubmit() {
    if (!this.previewUrl) {
      authManager.showToast("Please select an image", "error");
      return;
    }

    if (!this.captionInput.value.trim()) {
      authManager.showToast("Please enter a caption", "error");
      return;
    }

    this.isPosting = true;
    this.submitDirectPostBtn.disabled = true;
    this.submitDirectPostBtn.textContent = "Posting...";

    // Simulate API call
    setTimeout(() => {
      const isScheduled = this.scheduleCheckbox.checked;
      const message = isScheduled
        ? "Post scheduled successfully!"
        : "Posted to Instagram successfully!";

      authManager.showToast(message, "success");

      this.isPosting = false;
      this.submitDirectPostBtn.disabled = false;
      this.submitDirectPostBtn.textContent = "Post to Instagram";

      setTimeout(() => {
        this.closeModal();
      }, 1500);
    }, 2000);
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.removeImage();
    this.captionInput.value = "";
    this.scheduleCheckbox.checked = false;
    this.scheduleFields.classList.add("hidden");
    this.submitDirectPostBtn.disabled = false;
    this.submitDirectPostBtn.textContent = "Post to Instagram";
  }

  openModal() {
    this.modal.classList.remove("hidden");
  }
}

class TopicsModalManager {
  constructor() {
    this.modal = document.getElementById("topicsModal");
    this.topicsContainer = document.getElementById("topicsContainer");
    this.topicsLoading = document.getElementById("topicsLoading");
    this.topicsEmpty = document.getElementById("topicsEmpty");
    this.closeTopicsModal = document.getElementById("closeTopicsModal");
    this.closeTopicsBtn = document.getElementById("closeTopicsBtn");

    this.topics = [];
    this.statusColors = {
      pending: "pending",
      processing: "processing",
      completed: "completed",
      failed: "failed",
    };

    this.mockTopics = [
      {
        id: 1,
        title: "Summer Fashion Campaign",
        description: "Showcase latest summer collection with vibrant colors",
        status: "completed",
        scheduled_date: "2024-03-25",
        created_at: "2024-03-20",
      },
      {
        id: 2,
        title: "Tech Product Launch",
        description: "Innovative tech gadget announcement campaign",
        status: "processing",
        scheduled_date: "2024-03-28",
        created_at: "2024-03-22",
      },
      {
        id: 3,
        title: "Fitness Equipment Sale",
        description: "Spring sale promotion for fitness equipment",
        status: "pending",
        scheduled_date: "2024-04-01",
        created_at: "2024-03-23",
      },
    ];

    this.initialize();
  }

  initialize() {
    this.closeTopicsModal.addEventListener("click", () => this.closeModal());
    this.closeTopicsBtn.addEventListener("click", () => this.closeModal());
  }

  loadTopics() {
    this.topicsLoading.classList.remove("hidden");
    this.topicsEmpty.classList.add("hidden");
    this.topicsContainer.innerHTML = "";

    // Simulate API call
    setTimeout(() => {
      this.topics = this.mockTopics;
      this.topicsLoading.classList.add("hidden");

      if (this.topics.length === 0) {
        this.topicsEmpty.classList.remove("hidden");
      } else {
        this.renderTopics();
      }
    }, 1000);
  }

  renderTopics() {
    this.topicsContainer.innerHTML = this.topics
      .map(
        (topic) => `
      <div class="topic-card">
        <div class="topic-header">
          <h3 class="topic-title">${topic.title}</h3>
          <span class="status-badge ${this.statusColors[topic.status]}">
            ${topic.status.charAt(0).toUpperCase() + topic.status.slice(1)}
          </span>
        </div>
        <p class="topic-description">${topic.description}</p>
        <div class="topic-metadata">
          <div class="metadata-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${new Date(topic.scheduled_date).toLocaleDateString()}
          </div>
          <div class="metadata-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${new Date(topic.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  closeModal() {
    this.modal.classList.add("hidden");
  }

  openModal() {
    this.modal.classList.remove("hidden");
    this.loadTopics();
  }
}

class AutoPostModalManager {
  constructor() {
    console.log('AutoPostManager: Initializing...');
    this.modal = document.getElementById("autoPostModal");
    this.imagesContainer = document.getElementById("imagesContainer");
    this.imagesLoading = document.getElementById("imagesLoading");
    this.imagesEmpty = document.getElementById("imagesEmpty");
    this.loadImagesBtn = document.getElementById("loadImagesBtn");
    this.toggleAutoPostBtn = document.getElementById("toggleAutoPostBtn");
    this.autoPostingBadge = document.getElementById("autoPostingBadge");
    this.imageCountDisplay = document.getElementById("imageCountDisplay");
    this.closeAutoPostModal = document.getElementById("closeAutoPostModal");
    this.closeAutoPostBtn = document.getElementById("closeAutoPostBtn");

    console.log('AutoPostManager: Modal element found:', !!this.modal);
    console.log('AutoPostManager: All elements initialized');

    this.unpostedImages = [];
    this.isAutoPosting = false;

    this.mockImages = [
      {
        id: 1,
        image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='18' font-family='Arial'%3ESummer Fashion%3C/text%3E%3C/svg%3E",
        topic: "Summer Fashion Campaign",
        prompt: "Vibrant summer fashion collection showcase",
        workflow_id: "WF-001",
        timestamp: new Date().toISOString(),
        attempt: 1,
      },
      {
        id: 2,
        image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e0e0e0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-size='18' font-family='Arial'%3ETech Product%3C/text%3E%3C/svg%3E",
        topic: "Tech Product Launch",
        prompt: "Modern tech gadget product photography",
        workflow_id: "WF-002",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        attempt: 1,
      },
      {
        id: 3,
        image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23d0d0d0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23555' font-size='18' font-family='Arial'%3EFitness Sale%3C/text%3E%3C/svg%3E",
        topic: "Fitness Equipment Sale",
        prompt: "Professional fitness equipment display",
        workflow_id: "WF-003",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        attempt: 2,
      },
    ];

    this.initialize();
  }

  initialize() {
    console.log('AutoPostManager: Attaching event listeners...');

    if (this.loadImagesBtn) {
      this.loadImagesBtn.addEventListener("click", () =>
        this.loadUnpostedImages()
      );
    }

    if (this.toggleAutoPostBtn) {
      this.toggleAutoPostBtn.addEventListener("click", () =>
        this.toggleAutoPosting()
      );
    }

    if (this.closeAutoPostModal) {
      this.closeAutoPostModal.addEventListener("click", () => this.closeModal());
    }

    if (this.closeAutoPostBtn) {
      this.closeAutoPostBtn.addEventListener("click", () => this.closeModal());
    }

    // Close modal when clicking on overlay
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    console.log('AutoPostManager: Event listeners attached successfully');
  }

  loadUnpostedImages() {
    this.imagesLoading.classList.remove("hidden");
    this.imagesEmpty.classList.add("hidden");
    this.imagesContainer.innerHTML = "";
    this.imageCountDisplay.classList.add("hidden");

    // Simulate API call
    setTimeout(() => {
      this.unpostedImages = this.mockImages;
      this.imagesLoading.classList.add("hidden");

      if (this.unpostedImages.length === 0) {
        this.imagesEmpty.classList.remove("hidden");
      } else {
        this.imageCountDisplay.textContent = `📊 Found ${this.unpostedImages.length} unposted image(s)`;
        this.imageCountDisplay.classList.remove("hidden");
        this.renderImages();
      }

      authManager.showToast(
        `Loaded ${this.unpostedImages.length} unposted images`,
        "success"
      );
    }, 1000);
  }

  renderImages() {
    this.imagesContainer.innerHTML = this.unpostedImages
      .map(
        (image, index) => `
      <div class="image-card" data-image-id="${image.id}">
        <img src="${image.image_url}" alt="${
          image.topic
        }" class="image-thumbnail" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2296%22 height=%2296%22%3E%3Crect fill=%22%23ddd%22 width=%2296%22 height=%2296%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EImage%3C/text%3E%3C/svg%3E'" />
        <div class="image-metadata">
          <div class="image-topic">${image.topic}</div>
          <div class="image-info">⏰ ${new Date(
            image.timestamp
          ).toLocaleString()}</div>
          <div class="image-info">🔗 Workflow: ${image.workflow_id}</div>
          <div class="image-info">🔄 Attempt: ${image.attempt}</div>
          <div class="image-prompt">${image.prompt}</div>
        </div>
        <div class="image-action">
          <button class="post-now-btn" onclick="autoPostManager.postSingleImage(${
            image.id
          })">
            📤 Post Now
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  postSingleImage(imageId) {
    this.unpostedImages = this.unpostedImages.filter(
      (img) => img.id !== imageId
    );
    this.renderImages();

    if (this.unpostedImages.length === 0) {
      this.imagesEmpty.classList.remove("hidden");
      this.imageCountDisplay.classList.add("hidden");
    } else {
      this.imageCountDisplay.textContent = `📊 Found ${this.unpostedImages.length} unposted image(s)`;
    }

    authManager.showToast("Image posted to Instagram successfully!", "success");
  }

  toggleAutoPosting() {
    this.isAutoPosting = !this.isAutoPosting;

    if (this.isAutoPosting) {
      this.autoPostingBadge.classList.remove("hidden");
      this.toggleAutoPostBtn.textContent = "⏹️ Stop Auto Posting";
      authManager.showToast("Auto-posting started", "success");
    } else {
      this.autoPostingBadge.classList.add("hidden");
      this.toggleAutoPostBtn.textContent = "▶️ Start Auto Posting";
      authManager.showToast("Auto-posting stopped", "success");
    }
  }

  closeModal() {
    this.modal.style.opacity = '0';
    setTimeout(() => {
      this.modal.classList.add("hidden");
      this.modal.style.opacity = '';
    }, 300);
  }

  openModal() {
    console.log('AutoPostManager: Opening modal...');
    console.log('AutoPostManager: Modal element exists:', !!this.modal);
    if (!this.modal) {
      console.error('AutoPostManager: Modal element not found!');
      return;
    }
    this.modal.classList.remove("hidden");
    // Trigger reflow to ensure animation plays
    this.modal.offsetHeight;
    this.modal.style.opacity = '1';
    console.log('AutoPostManager: Modal opened successfully');
  }
}

// Initialize Auto Post Manager FIRST (before QuickActionsManager needs it)
console.log("Initializing Auto Post Manager...");
const autoPostManager = new AutoPostModalManager();
window.autoPostManager = autoPostManager; // Make it globally accessible
console.log("Auto Post Manager initialized and made global");

// Initialize other Modal Managers
const uploadManager = new UploadModalManager();
// const directPostManager = new OldDirectPostModalManager(); // DISABLED - using new direct-post-modal.js
const topicsManager = new TopicsModalManager();

// Initialize Quick Actions Manager (needs autoPostManager to be ready)
console.log("Initializing Quick Actions Manager...");
const quickActionsManager = new QuickActionsManager();
window.quickActionsManager = quickActionsManager; // Make it globally accessible for debugging
console.log("Quick Actions Manager initialized");

console.log("Dashboard initialized successfully");
console.log("window.autoPostManager available:", !!window.autoPostManager);
console.log("window.quickActionsManager available:", !!window.quickActionsManager);
// EMERGENCY FIX: Add direct click handler to Generate Single Ad card
setTimeout(() => {
  console.log("EMERGENCY FIX: Adding direct click handler to Generate Single Ad card");
  const generateAdCard = document.querySelector('[data-action="generate-ad"]');
  if (generateAdCard) {
    console.log("EMERGENCY FIX: Found Generate Single Ad card, adding click handler");

    // Remove any existing listeners by cloning the element
    const newCard = generateAdCard.cloneNode(true);
    generateAdCard.parentNode.replaceChild(newCard, generateAdCard);

    // Add fresh click handler
    newCard.addEventListener('click', function(e) {
      console.log("EMERGENCY FIX: Card clicked! Navigating to simple-ad.html");
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.href = "simple-ad.html";
    }, true);

    console.log("EMERGENCY FIX: Click handler attached successfully");
  } else {
    console.error("EMERGENCY FIX: Generate Single Ad card NOT FOUND!");
  }
}, 500);

