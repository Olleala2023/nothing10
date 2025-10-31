# 10 Minutes of Nothing

A minimalist Progressive Web App for digital mindfulness - a 10-minute pause ritual with guided breathing.

## 🌟 Features

- **Three Focus Modes**:
  - **Hidden**: Complete black screen with motivational phrase
  - **Ghost**: Dim timer display for time awareness  
  - **Breathing**: Guided breathing dot at 6 breaths per minute

- **Smart Reset**: Timer resets on any interaction (mouse movement, touch, window switching)
- **Local Statistics**: Tracks sessions, weekly minutes, and streak days
- **Reflection Journal**: Save thoughts and gratitude after each session
- **Offline Support**: Works without internet connection
- **PWA Installable**: Add to home screen on mobile devices
- **Focus Lock Guide**: Instructions for iOS Guided Access and Android Screen Pinning
- **SEO Optimized**: Comprehensive meta-tags for social sharing (OG, Twitter, LinkedIn)

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

**Note**: The build process now uses Vite with asset hashing for optimal caching. CSS and JS files are automatically versioned to prevent browser caching issues.

## 📱 Installation

### Mobile (PWA)
1. Open `https://nothing10.com/app/` in mobile browser
2. Tap "Add to Home Screen" when prompted
3. App installs like a native app

### Desktop
1. Open `https://nothing10.com/app/` in Chrome/Edge
2. Click install icon in address bar
3. App opens in standalone window

## 🎯 How to Use

1. **Choose Duration**: 3, 5, 10 minutes, or custom
2. **Select Mode**: Hidden, Ghost, or Breathing
3. **Start Timer**: Tap "Start" and put device down
4. **Stay Focused**: Any interaction resets the timer
5. **Complete**: Get completion message and statistics
6. **Reflect** (optional): Record your thoughts or gratitude after the session

## 🧘 Breathing Mode

The breathing indicator follows a 6-breaths-per-minute rhythm:
- **Square indicator** with moving dot along the edges
- **Phase labels**: Inhale, Hold, Exhale, Rest
- **10-second cycles** (5 seconds in, 5 seconds out)
- **Visual guidance** to help maintain focus

## 🔒 Focus Lock (For Parents)

Perfect for children who need help staying focused:
- **iOS**: Guided Access instructions
- **Android**: Screen Pinning guide
- **Desktop**: Fullscreen mode tips

## 📊 Privacy

- **No data collection**: Everything stays on your device
- **No tracking**: No analytics or third-party services
- **Local storage only**: Statistics stored in browser
- **Open source**: Code is transparent and auditable

## 🛠️ Technical Details

- **Framework**: Vite + Vanilla JavaScript
- **PWA**: Service Worker + Web App Manifest
- **Icons**: 192px, 512px, 512px maskable
- **Offline**: Cache-first strategy
- **Responsive**: Mobile-first design

## 📁 Project Structure

```
nothing10/
├── index.html              # Landing page
├── src/app/                # PWA application source
│   ├── index.html         # Main app interface
│   ├── app.js             # Timer logic & interactions (ES modules)
│   └── style.css          # App styles
├── public/                 # Static assets
│   ├── app/               # PWA manifest & service worker
│   │   ├── manifest.webmanifest
│   │   └── sw.js
│   ├── icons/             # PWA icons (PNG + SVG)
│   ├── legal/             # Privacy Policy, Terms of Service
│   │   ├── privacy.html
│   │   └── terms.html
│   ├── focus-lock/        # Screen locking instructions
│   │   └── index.html
│   ├── tools/             # Resources & Tools section
│   │   ├── index.html     # Tools landing page
│   │   ├── 10-minute-timer.html
│   │   └── breathing-pacer.html
│   ├── styles/            # Common styles for static pages
│   │   └── common.css
│   ├── about.html         # About page
│   ├── robots.txt
│   └── sitemap.xml
├── dist/                   # Production build (auto-generated)
│   ├── app/               # Processed PWA files
│   └── assets/            # Versioned CSS/JS files with hashes
└── vite.config.js         # Vite configuration for asset hashing
```

## 📝 Recent Updates

### UI/UX Improvements
- **Unified Button Styles**: All buttons now have consistent 30px border-radius
- **Enhanced Hover Effects**: Improved animations with glare and colored border effects
- **Updated Landing Page**: Replaced SVG logo with text "Launch App" for better readability
- **Standardized Typography**: Consistent font sizes across all pages (1.1rem for buttons, 0.9rem for small text)
- **Improved Button Labels**: Changed "How to Lock Screen" to "How It Works & Why"

### New Features
- **Reflection Journal**: Users can record thoughts, gratitude, or state after each session
- **Enhanced Breathing Mode**: Replaced circular indicator with square breathing guide with phase labels
- **Extended Touch Hint**: Increased display time for timer reset hint to 2.5 seconds

### Technical Improvements
- **Vite Asset Hashing**: Implemented automatic file versioning to prevent browser caching issues
- **ES Modules**: Converted to modern JavaScript modules for better performance
- **Build Optimization**: Streamlined build process with Vite for faster, more reliable builds
- **SEO Enhancement**: Added comprehensive meta-tags for Open Graph, Twitter Cards, and LinkedIn
- **Code Cleanup**: Removed email-setup.html page (not for end users)
- **Bug Fixes**: Fixed phrase display duplication, improved button hover states

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed Cloudflare Pages deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- **Email**: contact@nothing10.com
- **Issues**: [GitHub Issues](https://github.com/Olleala2023/nothing10/issues)
- **Website**: [nothing10.com](https://nothing10.com)

## 🙏 Acknowledgments

- Inspired by digital minimalism and mindfulness practices
- Built for the community of people seeking digital balance
- Special thanks to beta testers and feedback providers

---

**Take a 10-minute pause. Everything else can wait.** ⏰
