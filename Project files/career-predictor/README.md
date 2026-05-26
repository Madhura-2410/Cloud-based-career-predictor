# Cloud Based Career Longevity and Skill Obsolescence Predictor

A responsive, modern web application designed to predict career longevity and skill obsolescence in the cloud era.

## Features

### Landing Page
- **Eye-catching hero section** with the application title and description
- **User-friendly registration form** with validation:
  - Name validation (2+ characters, letters only)
  - Email validation (proper email format)
  - Phone number validation (10-15 digits)
- **Real-time error feedback** as users type
- **Smooth animations** and transitions

### Dashboard Page
- **Personalized welcome message** with user's first name
- **User information display** (Name, Email, Contact)
- **Feature overview cards** showcasing:
  - Career Analysis
  - Skill Predictions
  - Recommendations
  - Market Trends
- **Logout functionality** with confirmation

### Responsive Design
- **Mobile-first approach** with breakpoints at:
  - 480px (Mobile devices)
  - 768px (Tablets)
  - 1200px+ (Desktop)
- **Touch-friendly interface** optimized for all devices
- **Adaptive layouts** and typography

## File Structure

```
career-predictor/
├── index.html          # Main HTML file with all page layouts
├── styles.css          # Responsive styling with media queries
├── script.js           # Form validation and navigation logic
└── README.md           # This file
```

## Getting Started

### Option 1: Direct Browser Opening
1. Navigate to the project folder: `career-predictor`
2. Right-click on `index.html` and select "Open with" → Your browser
3. Or simply double-click `index.html`

### Option 2: Using Python's Built-in Server
```bash
# Navigate to the project folder
cd career-predictor

# Python 3.x
python -m http.server 8080

# Open browser and go to
http://localhost:8080
```

### Option 3: Using Node.js HTTP Server
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the project folder
cd career-predictor

# Start the server
http-server

# Open browser (usually opens automatically at)
http://localhost:8080
```

## Form Validation Rules

### Name
- Minimum 2 characters
- Only letters, spaces, hyphens, and apostrophes allowed
- Cannot be empty

### Email
- Must be a valid email format (example@domain.com)
- Cannot be empty

### Phone
- 10-15 digits required
- Supports common formatting (spaces, hyphens, parentheses)
- Cannot be empty

## Features & Functionality

### Form Submission
- Validates all fields before submission
- Displays specific error messages for each field
- Prevents submission until all fields are valid
- Shows real-time validation feedback on blur

### Data Persistence
- User data is stored in browser's localStorage
- Session persists even after page refresh
- Automatic redirect to dashboard if user data exists

### Navigation
- Seamless page transitions with fade-in animations
- Logout clears stored data and returns to landing page
- Confirmation dialog before logout

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with media queries and gradients
- **Vanilla JavaScript** - No external dependencies

### Key Classes

#### FormValidator
Handles all form validation logic with methods for:
- `validateName()` - Name validation
- `validateEmail()` - Email validation
- `validatePhone()` - Phone number validation
- `validateAll()` - Batch validation

#### StorageManager
Manages localStorage operations:
- `saveUserData()` - Persists user data
- `getUserData()` - Retrieves stored data
- `clearUserData()` - Removes user data
- `hasUserData()` - Checks if data exists

#### PageManager
Handles page navigation:
- `showPage()` - Switches between pages
- `getCurrentPage()` - Returns active page

#### App
Main application controller that coordinates:
- Event listeners
- Form submission
- Navigation
- Session management

## Customization

### Colors
Edit the gradient and accent colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Validation Rules
Modify validation methods in `script.js` within the `FormValidator` class

### Page Content
Edit text and descriptions in `index.html`

## Future Enhancements

- [ ] Multi-page form with progress indicator
- [ ] Skill assessment questionnaire
- [ ] Career prediction algorithm
- [ ] Analytics dashboard
- [ ] Export reports as PDF
- [ ] Integration with LinkedIn/GitHub
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Email verification
- [ ] Two-factor authentication

## Support

For issues or questions, check:
1. Browser console for error messages (F12 or Cmd+Option+I)
2. Ensure all files (HTML, CSS, JS) are in the same directory
3. Clear browser cache if changes don't appear

## License

This project is created as part of the Cloud Career Longevity prediction platform.

---

**Last Updated:** April 23, 2026
