# 🕉️ Dharma Desk - Spiritual Productivity Dashboard

A beautiful browser extension that transforms your new tab into a spiritual productivity workspace, combining ancient wisdom with modern productivity tools.

## ✨ Features

### 🎯 **Smart Goal Management**
- Add up to 5 daily goals with intuitive interface
- Real-time progress tracking with beautiful circular progress indicator
- Goals persist throughout the day and reset daily
- Smart progress calculation (only counts goals with actual content)
- Visual completion status with smooth animations

### 🔍 **Enhanced Search Experience**
- Beautiful glass-morphism search bar with golden focus effects
- Seamless integration with your preferred search engine
- Responsive design that works on all screen sizes

### 🔗 **Quick Access Links**
- One-click access to essential platforms:
  - **GitHub** - For your development workflow
  - **YouTube** - For learning and entertainment
  - **Gmail** - For communication
- Hover effects with brand-specific colors and animations

### 📚 **Daily Spiritual Wisdom**
- Random Bhagavad Gita quotes with explanations
- Refreshes daily to provide new insights
- Beautifully formatted with Sanskrit Om symbol

### 🕐 **Live Clock & Date**
- Real-time clock display
- Full date information with day of the week
- Clean, readable typography

### 💬 **Daily Reminders**
- Motivational reminders to keep you on track
- Encouraging messages for productivity and growth

## 🚀 Installation

### For Users
1. Download or clone this repository
2. Open your browser's extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Firefox**: `about:addons`
3. Enable "Developer mode" (Chrome/Edge) or "Debug mode" (Firefox)
4. Click "Load unpacked" and select the project folder
5. Enjoy your new spiritual productivity dashboard!

### For Developers
```bash
git clone https://github.com/SumantSagar73/Dharma-desk.git
cd Dharma-desk
# Open the folder in your preferred code editor
# Load as unpacked extension in your browser
```

## 🛠️ Development

### Project Structure
```
Dharma-desk/
├── manifest.json          # Extension configuration
├── index.html             # Main dashboard layout
├── index.css              # Styles and animations
├── index.js               # JavaScript functionality
├── icon*.png              # Dharma wheel icons (16px, 32px, 48px, 128px)
├── icon.svg               # Vector version of icon
├── test.js                # Test utilities
└── README.md              # This file
```

### Key Technologies
- **HTML5** - Semantic structure
- **CSS3** - Advanced styling with flexbox, grid, and animations
- **Vanilla JavaScript** - No external dependencies
- **LocalStorage API** - Persistent goal storage
- **Chrome Extension API** - Browser integration

### Customization
- **Colors**: Modify the CSS gradient variables in `index.css`
- **Goals Limit**: Change the limit in the `addNewGoal()` function
- **Quotes**: Add more spiritual quotes in the `fetchRandomGitaQuote()` function
- **Links**: Update quick links in the HTML structure

## 🎯 Usage Guide

### Managing Goals
1. Click "Add Goal" to create a new goal
2. Type your goal and press Enter to save
3. Check the circle to mark as complete
4. Remove goals using the × button
5. Watch your progress update in real-time

### Search Functionality
- Click the search bar and type your query
- Press Enter or click the search button
- Results open in the current tab

### Progress Tracking
- The progress circle shows completion percentage
- Stats display completed vs total goals
- Progress widget hides when no goals are set

## 🔧 Browser Compatibility

- ✅ **Chrome** (Recommended)
- ✅ **Microsoft Edge**
- ✅ **Firefox** (with minor adaptations)
- ✅ **Opera**
- ✅ **Brave**

## 📱 Responsive Design

- **Desktop**: Full three-column layout with sidebars
- **Tablet**: Adjusted spacing and sizing
- **Mobile**: Single-column stacked layout

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Ideas for Contributions
- 🌍 Internationalization (i18n)
- 🎨 Theme customization options
- 📊 Advanced analytics and insights
- 🔔 Notification system
- 🎵 Background music/sounds
- 📝 Note-taking functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Bhagavad Gita** - For the timeless wisdom
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For typography
- **The Open Source Community** - For inspiration and tools

## 📞 Support

If you encounter any issues or have suggestions:
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit an enhancement request
- 📧 **Direct Contact**: Reach out via GitHub profile

---

*Made with ❤️ by [SumantSagar73](https://github.com/SumantSagar73)*

**Transform your browsing experience with ancient wisdom and modern productivity.** 🚀
