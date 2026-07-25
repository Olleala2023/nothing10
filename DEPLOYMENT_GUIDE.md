# Nothing10.com - Cloudflare Pages Deployment Guide

**Last reviewed:** 2026-07-25 · **Next review:** 2027-01-25

Scope: infrastructure only — Cloudflare account, domain, DNS, email. Code rules live in
[CONTRIBUTING.md](./CONTRIBUTING.md); repository structure in
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Overview
This guide will help you deploy the "10 Minutes of Nothing" PWA to Cloudflare Pages with custom domain `nothing10.com`.

## Prerequisites
- [x] Domain `nothing10.com` purchased and ready
- [x] GitHub repository: `git@github.com:Olleala2023/nothing10.git`
- [x] Cloudflare account (free tier works)

## Step 1: Prepare Cloudflare Account

### 1.1 Add Domain to Cloudflare
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Find the "add site" button** — its placement varies between dashboard versions:
   - Top right corner: "Add a Site" / "Add Site"
   - Home screen: large "Add a Site" button
   - Left menu: "Sites" → "Add Site"
   - Dashboard: "Get started" / "Connect a Site"
3. Enter `nothing10.com`
4. Choose "Free" plan
5. Cloudflare will scan your DNS records

**If you cannot find the button:** go directly to `https://dash.cloudflare.com/add-site`

### 1.2 Update Nameservers
1. Go to your domain registrar (where you bought nothing10.com)
2. Change nameservers to Cloudflare's:
   - `alex.ns.cloudflare.com`
   - `zara.ns.cloudflare.com`
3. Wait for DNS propagation (5-30 minutes)

## Step 2: Deploy to Cloudflare Pages

### 2.1 Connect Repository
1. In Cloudflare Dashboard, go to **Pages** (left menu)
2. Click "Create a project" or "Create project"
3. Choose "Connect to Git" or "Connect Git repository"
4. Select GitHub and authorize Cloudflare
5. Choose repository: `Olleala2023/nothing10`

**Button label varies by dashboard version:** "Create project", "New project",
"Deploy a site", or "Get started".

### 2.2 Configure Build Settings
```
Project name: nothing10
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
```

### 2.3 Environment Variables
No environment variables needed for this project.

### 2.4 Deploy
1. Click "Save and Deploy"
2. Wait for build to complete (2-3 minutes)
3. You'll get a preview URL like: `https://nothing10-abc123.pages.dev`

## Step 3: Configure Custom Domain

### 3.1 Add Custom Domain
1. Go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter `nothing10.com`
5. Click "Continue"

### 3.2 DNS Configuration
Cloudflare will automatically create:
- `nothing10.com` → Pages project
- `www.nothing10.com` → Pages project (optional)

### 3.3 SSL Certificate
- Cloudflare automatically provisions SSL
- Wait 5-15 minutes for certificate activation
- Check "Always Use HTTPS" in SSL/TLS settings

## Step 4: Verify Deployment

### 4.1 Test URLs

Cloudflare Pages issues a 308 redirect from `.html` to the extensionless URL and this cannot be
disabled via `_redirects`. The extensionless forms below are the canonical ones — always link to
these, never to the `.html` variants.

- **Landing page**: `https://nothing10.com/`
- **PWA app**: `https://nothing10.com/app/`
- **Focus Lock guide**: `https://nothing10.com/focus-lock/`
- **Privacy Policy**: `https://nothing10.com/legal/privacy`
- **Terms of Service**: `https://nothing10.com/legal/terms`

Also verify that `https://nothing10.com/src/app/` does **not** serve the app. The build
currently leaks a duplicate copy there — see `AUDIT_2026-07-25.md`, finding 2.3.

### 4.1a Security Headers

`public/.htaccess` is Apache configuration and **Cloudflare Pages does not read it**, so the
headers declared in it are not applied in production. A `public/_headers` file is required
instead. Verify with:

```bash
curl -sI https://nothing10.com/ | grep -iE 'content-security-policy|x-frame-options|strict-transport'
```

Empty output means no headers are set. See `AUDIT_2026-07-25.md`, finding 1.5.

### 4.2 PWA Testing
1. Open `https://nothing10.com/app/` on mobile
2. Test "Add to Home Screen" functionality
3. Verify offline mode works
4. Test all timer modes (Hidden, Ghost, Breathing)

### 4.3 Performance Check
1. Run [Lighthouse audit](https://pagespeed.web.dev/)
2. Target scores:
   - Performance: ≥90
   - Accessibility: ≥90
   - Best Practices: ≥90
   - PWA: Installable ✅

## Step 5: Email Setup (Optional)

### 5.1 Cloudflare Email Routing
1. In Cloudflare Dashboard, go to **Email** → **Email Routing**
2. Click "Get started"
3. Cloudflare will automatically add required MX and TXT DNS records
4. Go to **Email Routing** → **Email Addresses** → **Create Address**
5. Enter `contact` as the local part (creates `contact@nothing10.com`)
6. Set destination: Enter your personal email address (Gmail, Outlook, etc.)
7. Verify setup by sending a test email to `contact@nothing10.com`

## Step 6: Monitoring & Maintenance

### 6.1 Analytics (Optional)
- Cloudflare provides DNS-level analytics (no tracking, privacy-friendly)
- For detailed analytics setup, see [ANALYTICS_GUIDE.md](./ANALYTICS_GUIDE.md)
- No analytics script is currently loaded on any page. Note that the Privacy Policy says
  otherwise — reconciling this is an open decision, entry **0003** in
  [docs/DECISIONS.md](./docs/DECISIONS.md). Do not add analytics before it is resolved.

### 6.2 Updates
1. Make changes locally
2. Commit and push to GitHub
3. Cloudflare Pages auto-deploys from main branch
4. No manual deployment needed

### 6.3 Backup
- Code is backed up in GitHub
- No database to backup (localStorage only)

## Troubleshooting

### Common Issues

#### Build Fails
- Check build command: `npm run build`
- Verify output directory: `dist`
- Note: there is no type-checking step in this project. `tsconfig.json` covers only unused
  template files, and the application itself is plain JavaScript — a build failure will not
  be a TypeScript error. See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

#### PWA Not Installable
- Verify manifest.webmanifest is accessible
- Check service worker registration
- Ensure HTTPS is enabled

#### Custom Domain Not Working
- Check DNS propagation: `nslookup nothing10.com`
- Verify nameservers are Cloudflare's
- Wait 24-48 hours for full propagation

#### SSL Certificate Issues
- Enable "Always Use HTTPS"
- Check certificate status in SSL/TLS settings
- Force refresh browser cache

### Support
- Cloudflare Support: [support.cloudflare.com](https://support.cloudflare.com)
- GitHub Issues: [github.com/Olleala2023/nothing10/issues](https://github.com/Olleala2023/nothing10/issues)

## Project Structure

⚠️ This section previously pointed at `app/`, which is a **stale build artifact**, not the
source. The authoritative structure and dependency rules live in
[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — refer to that document, not to a copy here.

```
nothing10/
├── index.html              # Landing page — Vite entry point #1
├── src/app/                # ★ PWA source of truth — Vite entry point #2
│   ├── index.html
│   ├── app.js
│   └── style.css
├── public/                 # Copied into dist/ as-is
│   ├── app/               # manifest.webmanifest, sw.js
│   ├── icons/, sounds/, data/
│   ├── styles/, scripts/  # Shared CSS and theme toggle
│   ├── tools/, research/, modes/, focus-lock/, legal/
│   ├── robots.txt, sitemap.xml, _redirects
│   └── .htaccess          # ✗ Apache format — Cloudflare Pages ignores this
├── scripts/               # Build scripts (Node)
├── app/                   # ✗ Stale artifact — do not edit
└── dist/                  # Production build (git-ignored)
```

## Success Checklist
- [ ] Domain `nothing10.com` resolves to Cloudflare Pages
- [ ] HTTPS certificate is active
- [ ] Landing page loads correctly
- [ ] PWA installs on mobile devices
- [ ] Offline mode works
- [ ] All timer modes function properly
- [ ] Focus lock guide is accessible
- [ ] Legal pages are accessible
- [ ] Email contact works (if configured)
- [ ] Lighthouse PWA score is "Installable"

## Next Steps After Deployment
1. Test on multiple devices (iOS, Android, Desktop)
2. Share with beta users for feedback
3. Monitor usage through Cloudflare analytics
4. Consider adding to app stores (PWA to TWA)
5. Implement user feedback improvements

---

**Deployment completed successfully!** 🎉

Your "10 Minutes of Nothing" PWA is now live at `https://nothing10.com`
