# Dharma Desk 🕉️

Hey there! This is my little passion project - a browser extension that turns your new tab into something more meaningful than just a blank page or random news feed.

## What's this about?

I got tired of opening new tabs and seeing the same boring stuff. So I built something that combines productivity with a bit of spiritual wisdom. Every time you open a new tab, you get:

- A beautiful space to track your daily goals
- Random quotes from the Bhagavad Gita (because who doesn't need some ancient wisdom?)
- Quick access to the sites you actually use
- A clean, peaceful interface that doesn't assault your eyes

## Features that I'm proud of

**Goal Tracking That Actually Works**

- Add up to 5 goals for the day (trust me, more than that is just setting yourself up for failure)
- Check them off as you go and watch that satisfying progress circle fill up
- Only counts goals you actually write down - no cheating with empty boxes!
- Everything resets daily because fresh starts are important

**Quick Access Links**

- GitHub, YouTube, and Gmail right there when you need them
- Hover effects that I spent way too much time perfecting
- Colors that match each platform because details matter

**Daily Wisdom**

- Random Bhagavad Gita quotes that change daily
- Sometimes you need a moment of reflection between checking emails

**Search That Doesn't Suck**

- Clean search bar that actually looks good
- Works with whatever search engine you prefer
- No tracking, no ads, just search

## How to install this thing

1. Download or clone this repo (you know the drill)
2. Open Chrome/Edge and go to extensions (chrome://extensions/)
3. Turn on "Developer mode"
4. Click "Load unpacked" and point it to this folder
5. Boom! Your new tabs just got an upgrade

## For the curious developers

Built with vanilla JavaScript because sometimes you don't need a framework for everything. The styling uses modern CSS with some nice glass-morphism effects that I learned while building this.

```
├── manifest.json      # Extension config
├── index.html         # The main dashboard
├── index.css          # All the pretty styles
├── index.js           # The brains of the operation
├── icon*.png          # Hand-crafted Dharma wheel icons
└── README.md          # You are here
```

No external dependencies, no bloat, just clean code that does what it says.

## Want to make it better?

I'd love some help! Here's what I'm thinking about adding:

- More wisdom sources (maybe some Buddhist texts, Stoic quotes?)
- Themes because not everyone likes blue gradients
- Better mobile support (it works, but could be prettier)
- Maybe some gentle reminder notifications?

If you want to contribute, just fork it, make your changes, and send a PR. I'm pretty chill about code style as long as it works and doesn't break things.

## Technical stuff (if you care)

- Uses localStorage to remember your goals
- Resets everything at midnight (in your timezone)
- Works on Chrome, Edge, and probably other Chromium browsers
- The icon is made with Python PIL because I like making things from scratch
- Responsive design that doesn't look terrible on different screen sizes

## Problems?

If something breaks, just open an issue. I actually read them and try to fix stuff when I have time.

## Why did I build this?

Honestly? I wanted something that would make me pause for a second when opening a new tab. Instead of mindlessly diving into social media or news, I get a moment to think about what I'm trying to accomplish today. Plus, those Gita quotes sometimes hit different when you're stressed about a deadline.

It's nothing revolutionary, just a small attempt to bring a bit more intentionality to the chaos of modern browsing.

---

Built with care (and probably too much coffee) by [SumantSagar73](https://github.com/SumantSagar73)

_May your goals be clear and your wisdom timeless_ ✨

---

## Updated features

This project has received several recent improvements to the UI, UX, accessibility, and theming. Here's a concise list of what's new:

- Theme system
	- Multiple new themes added (e.g. `blue`, `dark`, `zen`, `yellow`, `indigo`, `funny`, `calm`, `peace`, `genz`, `lavender`).
	- Theme selection persistence using `localStorage` so your preference remains across sessions.
	- A compact top-left mini-palette: a small current-theme circle that opens a horizontal row of theme icons when clicked.

- Accessibility and keyboard support
	- The theme palette is keyboard accessible: `tabindex` on theme icons, Enter/Space to select, Arrow keys to navigate, and Escape to close.
	- Visible focus styles and tooltips appear on focus so keyboard users can see and read theme names.
	- `aria` attributes added for assistive technologies (`aria-hidden`, `aria-expanded`, `role=\"menuitem\"`).

- Guided helper (tour)
	- A guided tour (`ℹ️` helper) now walks users through key UI parts: Today's Goals, the centered Search, Theme Switcher, Daily Wisdom, Quick Links, Progress, and Clock.
	- The tour opens the theme mini-palette automatically during the Theme Switcher step and highlights it so it's easy to find.
	- Tour tooltips have been made more readable (opaque background and higher z-index) so text is legible across themes.

- Visual & interaction fixes
	- The cross icon on Today's Goals removal button no longer animates to avoid accidental visual distraction.
	- The search bar has been moved/centered in the header for a clean layout.
	- Theme icons receive brighter borders in dark themes so they remain visible.

- Small UX niceties
	- Tooltips on theme icons show on both hover and keyboard focus.
	- The current theme button shows the selected theme's color so theme changes are immediately visible.

If you'd like more details about any of these changes (code pointers, specific CSS variables to tweak, or adding more themes), open an issue or send a PR — I'd be glad to collaborate.
