# 10 Minutes of Nothing

A minimalist Progressive Web App for digital mindfulness - a 10-minute pause ritual with guided breathing.

## 🌟 Features

- **Three Focus Modes**:
  - **Hidden**: Complete black screen with motivational phrase
  - **Ghost**: Dim timer display for time awareness  
  - **Breathing**: Guided breathing dot at 6 breaths per minute

- **Smart Reset**: Timer resets on any interaction (mouse movement, touch, window switching)
- **Local Statistics**: Tracks sessions, weekly minutes, and streak days
- **Offline Support**: Works without internet connection
- **PWA Installable**: Add to home screen on mobile devices
- **Focus Lock Guide**: Instructions for iOS Guided Access and Android Screen Pinning

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

## 🧘 Breathing Mode

The breathing dot follows a 6-breaths-per-minute rhythm:
- **10-second cycles** (5 seconds in, 5 seconds out)
- **Visual guidance** with size and opacity changes
- **Calming animation** to help focus

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
├── app/                    # PWA application
│   ├── index.html         # Main app interface
│   ├── app.js             # Timer logic & interactions
│   └── style.css          # App styles
├── public/                 # Static assets
│   ├── app/               # PWA manifest & service worker
│   ├── icons/             # PWA icons (PNG + SVG)
│   ├── legal/             # Privacy, Terms, Email setup
│   └── focus-lock/        # Screen locking instructions
└── scripts/               # Build utilities
```

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
