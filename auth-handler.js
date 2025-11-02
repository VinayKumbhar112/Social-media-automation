// Auth Handler
class AuthHandler {
    constructor() {
        this.pendingAction = null;
        this.isAuthenticated = false;
        this.initializeElements();
        this.initializeListeners();
        this.checkInitialAuth();
    }

    initializeElements() {
        // Get UI elements
        this.authButton = document.getElementById('authButton');
        this.userAvatar = document.getElementById('userAvatar');
        this.userDropdown = document.getElementById('userDropdown');
        this.userName = document.getElementById('userName');
        this.userEmailDisplay = document.getElementById('userEmailDisplay');
        this.userInitials = document.getElementById('userInitials');
        this.userInitialsLarge = document.getElementById('userInitialsLarge');
        this.logoutBtn = document.getElementById('logoutBtn');
    }

    initializeListeners() {
        // Auth button click - just show login modal
        this.authButton.addEventListener('click', () => {
            const authModal = document.getElementById('authModal');
            authModal.classList.remove('hidden');
        });

        // User avatar click - toggle dropdown
        this.userAvatar.addEventListener('click', () => {
            this.userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.userDropdown.classList.remove('show');
            }
        });

        // Listen for successful login
        document.addEventListener('login-success', () => {
            this.isAuthenticated = true;
            this.updateUI(true);
        });

        // Listen for logout
        document.addEventListener('logout', () => {
            this.isAuthenticated = false;
            this.updateUI(false);
        });
    }

    checkInitialAuth() {
        // Check if user is already logged in (from localStorage)
        const userEmail = document.getElementById('userEmailDisplay').textContent;
        this.isAuthenticated = userEmail !== 'Not logged in';
        this.updateUI(this.isAuthenticated);
    }

    updateUI(isAuthenticated) {
        if (isAuthenticated) {
            this.authButton.classList.add('hidden');
            this.userAvatar.classList.remove('hidden');
            this.userName.textContent = this.userEmailDisplay.textContent.split('@')[0];
        } else {
            this.authButton.classList.remove('hidden');
            this.userAvatar.classList.add('hidden');
            this.userDropdown.classList.remove('show');
        }
    }

    checkAuth() {
        const userEmail = document.getElementById('userEmailDisplay').textContent;
        this.isAuthenticated = userEmail !== 'Not logged in';
        return this.isAuthenticated;
    }
}

// Initialize auth handler
window.authHandler = new AuthHandler();