// Social Media Direct Post Integration
document.addEventListener('DOMContentLoaded', () => {
    // Initialize direct post functionality
    window.directPost = new DirectPost();
    
    const socialCards = document.querySelectorAll('.social-card');
    console.log('Found social cards:', socialCards.length);
    
    socialCards.forEach(card => {
        console.log('Adding click handler to card:', card.dataset.platform);
        card.style.cursor = 'pointer'; // Make it clear it's clickable
        
        card.addEventListener('click', (event) => {
            console.log('Social card clicked:', card.dataset.platform);
            event.preventDefault();
            
            if (!window.authManager || !window.authManager.user) {
                if (window.authManager) {
                    window.authManager.showAuthModal(() => {
                        openDirectPostModal(card.dataset.platform);
                    });
                } else {
                    console.error('Auth manager not initialized');
                }
                return;
            }
            openDirectPostModal(card.dataset.platform);
        });
    });
});

function openDirectPostModal(platform) {
    // Show the modal
    const modal = document.getElementById('directPostModal');
    modal.classList.remove('hidden');

    // Reset the form before opening for a new post
    window.directPost.resetForm();

    // Set the active platform
    const platformBtns = document.querySelectorAll('.platform-btn');
    platformBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.platform === platform) {
            btn.classList.add('active');
            window.directPost.currentPlatform = platform;
        }
    });

    // Update submit button text
    window.directPost.updateSubmitButton();
};