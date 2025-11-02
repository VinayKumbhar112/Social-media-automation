# Automatter Dashboard - Usage Examples

## 🎯 How to Use Each Feature

---

## 1. AUTHENTICATION

### Login
```
1. Click user avatar (top-right corner)
2. Click "Login" button
3. Enter email: user@example.com
4. Enter password: password123
5. Click "Login" button
6. Success! User is logged in
```

### Register
```
1. Click user avatar (top-right corner)
2. Click "Login" button
3. Click "Register" tab
4. Enter email: newuser@example.com
5. Enter password: password123
6. Confirm password: password123
7. Click "Create Account" button
8. Success! Account created and logged in
```

### Logout
```
1. Click user avatar (top-right corner)
2. Click "Logout" button
3. User is logged out
4. Avatar shows "--" initials
```

---

## 2. QUICK ACTIONS

### Generate Single Ad
```
1. Click "Generate Single Ad" card
2. If not logged in, login first
3. Success notification appears
4. Modal would open (ready for implementation)
```

### My Topics
```
1. Click "My Topics" card
2. If not logged in, login first
3. Success notification appears
4. Topics list would open (ready for implementation)
```

### Auto Post
```
1. Click "Auto Post" card
2. If not logged in, login first
3. Success notification appears
4. Settings modal would open (ready for implementation)
```

---

## 3. BATCH UPLOAD

### Upload Files
```
1. Click "Upload Files" button
2. If not logged in, login first
3. Upload modal opens
4. Select files to upload
5. Click upload to proceed
```

---

## 4. SCHEDULED POSTS

### View Posts
```
1. Scroll to "Scheduled Posts" section
2. See list of scheduled posts
3. Each post shows:
   - Thumbnail image
   - Title and description
   - Scheduled time
   - Status badge
   - Action buttons
```

### Refresh Posts
```
1. Click "Refresh" button
2. Posts list updates
3. Success notification appears
```

### Filter Posts
```
1. Click filter dropdown
2. Select: "Upcoming", "Past", or "All"
3. Posts are filtered
4. Success notification appears
```

### Open Post
```
1. Click open icon (→) on any post
2. Post details open
3. Success notification appears
```

### Delete Post
```
1. Click delete icon (✕) on any post
2. Post is removed from list
3. Success notification appears
4. List updates automatically
```

---

## 5. STATISTICS

### View Stats
```
1. See stat cards at top of dashboard
2. Each card shows:
   - Metric name
   - Current value
   - Trend indicator (up/down)
   - Percentage change
```

### Click Stat Card
```
1. Click on any stat card
2. Details notification appears
3. More information would load (ready for implementation)
```

---

## 6. THEME TOGGLE

### Switch Theme
```
1. Click moon/sun icon (top-right)
2. Theme switches to dark mode
3. Click again to switch back to light mode
4. Theme preference is saved
5. Theme persists on next visit
```

---

## 7. NAVIGATION

### Navigate Sections
```
1. Click any item in sidebar:
   - Dashboard
   - Single Ad
   - Schedule
   - Analytics
   - Settings
2. Active section is highlighted
3. Content updates accordingly
```

### Search
```
1. Click search box
2. Type search query
3. Search box highlights with blue border
4. Results would filter (ready for implementation)
```

---

## 8. USER MENU

### Open User Menu
```
1. Click user avatar (top-right)
2. Dropdown menu appears
3. Shows user email
4. Shows Login/Logout buttons
```

### Close User Menu
```
1. Click anywhere outside menu
2. Menu closes automatically
3. Or click avatar again to toggle
```

---

## 9. NOTIFICATIONS

### Success Notification
```
- Green toast appears
- Shows success message
- Auto-dismisses after 3 seconds
- Example: "Login successful!"
```

### Error Notification
```
- Red toast appears
- Shows error message
- Auto-dismisses after 3 seconds
- Example: "Passwords do not match"
```

---

## 10. FORM VALIDATION

### Login Form
```
- Email field: Required, must be valid email
- Password field: Required, minimum 1 character
- Submit button: Disabled if form invalid
- Shows "Logging in..." while processing
```

### Register Form
```
- Email field: Required, must be valid email
- Password field: Required, minimum 6 characters
- Confirm field: Must match password
- Submit button: Disabled if form invalid
- Shows "Creating account..." while processing
```

---

## 🔄 WORKFLOW EXAMPLES

### Complete User Journey
```
1. User visits dashboard
2. Clicks "Generate Single Ad"
3. Authentication modal opens
4. User registers with email/password
5. Account created and logged in
6. Generate Ad modal opens
7. User creates advertisement
8. Ad is scheduled
9. Post appears in Scheduled Posts
10. User can view, edit, or delete post
```

### Theme Preference
```
1. User visits dashboard (light theme)
2. Clicks theme toggle
3. Dashboard switches to dark theme
4. User closes browser
5. User returns to dashboard
6. Dark theme is still active (persisted)
```

### Post Management
```
1. User views scheduled posts
2. Clicks refresh to update list
3. Filters posts by "Upcoming"
4. Clicks open on a post
5. Post details appear
6. User decides to delete
7. Clicks delete button
8. Post is removed
9. List updates automatically
```

---

## 💡 TIPS & TRICKS

- **Quick Login**: Use any email/password combination
- **Persistent Data**: All data saved to localStorage
- **Responsive**: Works on mobile, tablet, and desktop
- **Keyboard**: Use Tab to navigate forms
- **Notifications**: Watch for toast messages for feedback
- **Theme**: Your preference is remembered

---

## ⚠️ IMPORTANT NOTES

- This is a frontend-only implementation
- Data is stored locally in browser
- For production, connect to backend API
- Passwords are not encrypted (demo only)
- Clear browser data to reset everything

---

**Last Updated**: October 23, 2025

