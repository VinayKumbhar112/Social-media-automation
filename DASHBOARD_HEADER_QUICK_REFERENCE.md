# Dashboard Header - Quick Reference Guide

## 🎯 Quick Start

### Test Search Feature
```
1. Click search box
2. Type any keyword (e.g., "gen", "post", "auto")
3. See filtered suggestions
4. Click suggestion to navigate
```

### Test Theme Toggle
```
1. Click moon/sun icon (top-right)
2. Dashboard switches to dark mode
3. Click again to switch back to light mode
4. Preference is saved automatically
```

### Test User Menu
```
1. Click user avatar (top-right)
2. Dropdown menu appears
3. Click "Login / Register" to authenticate
4. After login, see user email and "Logout" button
5. Click "Logout" to sign out
```

---

## 📋 Component IDs & Classes

### HTML IDs
```
searchInput          - Search input field
searchPopover        - Search suggestions dropdown
searchSuggestions    - Suggestions container
themeToggle          - Theme toggle button
userAvatar           - User avatar button
userDropdown         - User dropdown menu
userInitials         - Small avatar initials
userInitialsLarge    - Large avatar initials
userEmailDisplay     - User email in dropdown
logoutBtn            - Logout button
loginBtn             - Login button
```

### CSS Classes
```
search-container     - Search wrapper
search-box           - Search input container
search-input         - Search input field
search-popover       - Suggestions dropdown
search-suggestion    - Individual suggestion
theme-btn            - Theme toggle button
user-menu            - User menu container
user-avatar          - Avatar button
user-dropdown        - Dropdown menu
user-info            - User info section
user-avatar-large    - Large avatar
user-details         - Email and status
user-actions         - Buttons section
logout-btn           - Logout button
login-btn            - Login button
dark-mode            - Dark mode state (on body)
```

---

## 🔧 JavaScript API

### DashboardHeader Class

```javascript
// Initialize (automatic on page load)
const dashboardHeader = new DashboardHeader();

// Methods
dashboardHeader.initializeSearch()
dashboardHeader.renderSuggestions(query, container)
dashboardHeader.initializeThemeToggle()
dashboardHeader.applyDarkTheme()
dashboardHeader.applyLightTheme()
dashboardHeader.initializeUserMenu()
dashboardHeader.updateUserMenu()
dashboardHeader.getInitials(email)
```

### Search Suggestions Array

```javascript
dashboardHeader.searchSuggestions = [
  {
    icon: "🎯",
    label: "Generate Single Ad",
    href: "#generate-ad",
    keywords: ["generate", "ad", "create", "advertisement"]
  },
  // ... more suggestions
]
```

### Theme Management

```javascript
// Check current theme
document.body.classList.contains("dark-mode")

// Get theme preference
localStorage.getItem("automatter_theme")

// Set theme preference
localStorage.setItem("automatter_theme", "dark")
localStorage.setItem("automatter_theme", "light")
```

### User Menu Updates

```javascript
// Update user menu (called automatically)
dashboardHeader.updateUserMenu()

// Get user initials
dashboardHeader.getInitials("john@example.com") // "JO"
```

---

## 🎨 CSS Variables

```css
--primary-blue: #5b5fff
--light-blue: #f0f2ff
--dark-bg: #0f1419
--sidebar-bg: #f8f9fb
--text-dark: #1a1d23
--text-gray: #6b7280
--border-color: #e5e7eb
--success-green: #10b981
--danger-red: #ef4444
--light-gray: #f3f4f6
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop (1200px+) */
.search-container { width: 280px; }

/* Tablet (768px - 1199px) */
@media (max-width: 1199px) {
  .search-container { width: 240px; }
}

/* Mobile (320px - 767px) */
@media (max-width: 767px) {
  .search-container { width: 100%; }
  .header-right { flex-wrap: wrap; }
}
```

---

## 🔄 Event Listeners

```javascript
// Search input events
searchInput.addEventListener("focus", ...)
searchInput.addEventListener("input", ...)

// Theme toggle
themeToggle.addEventListener("click", ...)

// User avatar
userAvatar.addEventListener("click", ...)

// Document click (close dropdowns)
document.addEventListener("click", ...)

// Search suggestions
searchSuggestion.addEventListener("click", ...)
```

---

## 🎯 Search Suggestions

| Icon | Label | Keywords |
|------|-------|----------|
| 🎯 | Generate Single Ad | generate, ad, create, advertisement |
| 👁️ | My Topics | topics, campaigns, view, manage |
| 🤖 | Auto Post | auto, post, automated, posting |
| 📅 | Scheduled Posts | scheduled, posts, calendar, upcoming |
| 📊 | Analytics | analytics, stats, reports, data |
| ⚙️ | Settings | settings, preferences, config, options |

---

## 🌙 Dark Mode Colors

```
Background:     #0f1419
Cards:          #1f2937
Text Primary:   #f3f4f6
Text Secondary: #9ca3af
Borders:        #374151
Hover:          #374151
```

---

## 🔐 localStorage Keys

```javascript
// Theme preference
localStorage.getItem("automatter_theme")
// Values: "dark" or "light"

// User data (from AuthManager)
localStorage.getItem("automatter_user")
// Value: JSON string with user object
```

---

## 🐛 Debugging Tips

### Check Search Functionality
```javascript
console.log(dashboardHeader.searchSuggestions)
console.log(document.getElementById("searchPopover").classList)
```

### Check Theme
```javascript
console.log(document.body.classList.contains("dark-mode"))
console.log(localStorage.getItem("automatter_theme"))
```

### Check User Menu
```javascript
console.log(authManager.user)
console.log(document.getElementById("userDropdown").classList)
```

---

## 📊 Performance Tips

- Search filtering is O(n) - efficient for small lists
- Theme toggle uses CSS classes - no reflow
- Event delegation for suggestions - minimal listeners
- localStorage is synchronous - fast access

---

## 🚀 Customization

### Add New Search Suggestion
```javascript
dashboardHeader.searchSuggestions.push({
  icon: "🆕",
  label: "New Feature",
  href: "#new-feature",
  keywords: ["new", "feature", "custom"]
});
```

### Change Theme Colors
```css
body.dark-mode {
  --dark-bg: #your-color;
  --text-dark: #your-color;
  /* ... more colors */
}
```

### Customize Search Placeholder
```javascript
// In HTML
<input placeholder="Your custom text..." />
```

---

## ✅ Testing Checklist

- [ ] Search filters suggestions correctly
- [ ] Theme toggle switches modes
- [ ] Dark mode applies to all elements
- [ ] User menu shows/hides correctly
- [ ] Login/Logout buttons work
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] No console errors
- [ ] localStorage persists data

---

## 📞 Common Issues & Solutions

**Issue**: Search popover not showing
- Solution: Check if `searchPopover` element exists
- Check: `document.getElementById("searchPopover")`

**Issue**: Theme not persisting
- Solution: Check localStorage is enabled
- Check: `localStorage.getItem("automatter_theme")`

**Issue**: User menu not updating
- Solution: Ensure AuthManager is initialized first
- Check: `authManager.user` exists

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0

