# Cloudflare Analytics Setup Guide

**Last reviewed:** 2026-07-25 · **Next review:** 2027-01-25

This guide explains how to set up privacy-friendly analytics for "10 Minutes of Nothing" using Cloudflare Web Analytics, while respecting the app's commitment to user privacy.

> ⚠️ **This guide is partially out of date, and that matters.** It was written when the Privacy
> Policy said "no analytics". Since then, `public/legal/privacy.html` §3 was changed to declare
> that Google Analytics *is* used with cookies — which directly contradicts the "Analytics to
> Avoid" section below, as well as the README and the Terms of Service. Meanwhile no analytics
> script is actually loaded on any page.
>
> Reconciling this is an open decision: entry **0003** in [docs/DECISIONS.md](./docs/DECISIONS.md).
> **Do not add any analytics or tracking script until it is resolved.** The recommendation in
> this guide (Cloudflare, no cookies) remains the suggested path.

## ⚠️ Important Privacy Considerations

**Before enabling any analytics, review your Privacy Policy.** The Privacy Policy *originally*
stated — and the README still states:
- "No tracking. No accounts."
- "We do not collect, store, or transmit any personal information"
- "No analytics or tracking data"

### Privacy-Friendly Analytics Options

**Cloudflare Web Analytics** can be configured in a privacy-friendly way:
- ✅ **No cookies** - No tracking cookies are used
- ✅ **No personal data** - Only aggregated, anonymized statistics
- ✅ **GDPR compliant** - Meets privacy regulations
- ✅ **No user identification** - Cannot identify individual users

However, **you must update your Privacy Policy** if you enable analytics to accurately reflect what data is collected.

## 📊 Cloudflare Web Analytics Setup

### Step 1: Enable Web Analytics

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Analytics & Logs** → **Web Analytics**
3. Click **"Add a site"** or **"Get started"**
4. Enter your domain: `nothing10.com`
5. Click **"Add site"**

### Step 2: Configure Privacy Settings

1. In Web Analytics settings, enable:
   - ✅ **"Privacy-focused mode"** (if available)
   - ✅ **"No cookies"** option
   - ✅ **"Anonymize IP addresses"**
2. Disable:
   - ❌ **"User tracking"**
   - ❌ **"Session replay"**
   - ❌ **"Personal data collection"**

### Step 3: Add Analytics Script (Optional)

Cloudflare Web Analytics works **without** adding any script to your site if you use DNS-level analytics. However, for more detailed metrics, you can add the lightweight script:

1. Get your **Beacon Token** from Web Analytics dashboard
2. Add to `index.html` in the `<head>` section:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_BEACON_TOKEN"}'></script>
```

**Note:** This script is privacy-friendly (no cookies, no personal data), but adding it still requires Privacy Policy update.

### Step 4: DNS-Level Analytics (Recommended)

The **best privacy-friendly option** is DNS-level analytics, which doesn't require any script:
- Cloudflare automatically collects basic metrics from DNS requests
- No JavaScript needed
- No user-side tracking
- Already available in Cloudflare dashboard under **Analytics** → **Traffic**

**Metrics available:**
- Total page views
- Unique visitors (approximate, anonymized)
- Requests per second
- Bandwidth usage
- Status codes

## 📈 What Data You Can See

### DNS-Level Analytics (No Script Required)
- ✅ Page views count
- ✅ Bandwidth usage
- ✅ Request patterns (aggregated)
- ✅ Geographic distribution (country-level, not city)
- ❌ No individual user data
- ❌ No session tracking
- ❌ No device information

### Web Analytics (With Script)
- ✅ Page views
- ✅ Unique visitors (anonymized)
- ✅ Referrers (where traffic comes from)
- ✅ Popular pages
- ✅ Core Web Vitals (performance metrics)
- ❌ No personal information
- ❌ No user IDs
- ❌ No cross-site tracking

## 🔒 Privacy Policy Update Required

If you enable analytics, you **must update** `public/legal/privacy.html` to reflect:

### Add Section About Analytics

```html
<h2>3. Web Analytics (Optional)</h2>
<p>We use privacy-friendly analytics provided by Cloudflare to understand how our service is used. This analytics:</p>
<ul>
  <li>Does not use cookies or track individual users</li>
  <li>Only collects aggregated, anonymized data</li>
  <li>Does not collect personal information or identifiers</li>
  <li>Cannot identify you or your device</li>
  <li>Is used solely to improve our service</li>
</ul>
<p>You can opt out by using privacy-focused browsers or browser extensions that block analytics.</p>
```

## 🎯 Recommended Approach

### Option 1: DNS-Level Only (Most Privacy-Friendly)
- ✅ No Privacy Policy changes needed (only server-side data)
- ✅ Basic metrics available in Cloudflare dashboard
- ✅ Zero user-side tracking
- ⚠️ Limited insights (no page-level details)

### Option 2: Cloudflare Web Analytics (Balanced)
- ✅ Privacy-friendly (no cookies, no personal data)
- ✅ More detailed insights
- ✅ GDPR compliant
- ⚠️ Requires Privacy Policy update

### Option 3: No Analytics (Fully Private)
- ✅ 100% aligned with current Privacy Policy
- ✅ Maximum user privacy
- ❌ No usage insights

## 🚫 Analytics to Avoid

These violate your Privacy Policy:
- ❌ Google Analytics (uses cookies, tracks users)
- ❌ Facebook Pixel (tracks across sites)
- ❌ Third-party analytics scripts
- ❌ Any service that collects personal data
- ❌ User session recording tools

## 📝 Implementation Steps

### If You Choose DNS-Level Analytics Only:
1. Use existing Cloudflare dashboard analytics
2. No code changes needed
3. No Privacy Policy update needed

### If You Choose Cloudflare Web Analytics:
1. Enable Web Analytics in Cloudflare dashboard
2. Configure privacy settings (disable cookies, anonymize IP)
3. Optionally add beacon script to index.html
4. **Update Privacy Policy** to include analytics section
5. Test to ensure no personal data is collected

## ✅ Verification Checklist

Before going live with analytics:
- [ ] Privacy settings configured (no cookies, anonymize IP)
- [ ] Privacy Policy updated (if using Web Analytics script)
- [ ] Test in privacy mode to verify no tracking
- [ ] Verify no personal data in analytics reports
- [ ] Document analytics usage in project README

## 🔍 Testing Privacy

1. Open site in **Private/Incognito mode**
2. Use browser DevTools → Network tab
3. Check for cookies or tracking requests
4. Verify no personal identifiers in requests
5. Test with privacy extensions (uBlock, Privacy Badger)

## 📚 Additional Resources

- [Cloudflare Web Analytics Docs](https://developers.cloudflare.com/analytics/web-analytics/)
- [Privacy-First Analytics Guide](https://developers.cloudflare.com/analytics/privacy/)
- [GDPR Compliance](https://developers.cloudflare.com/analytics/gdpr/)

---

**Recommendation:** If you want to maintain strict "No tracking" policy, use **DNS-level analytics only** (available in Cloudflare dashboard by default) - this provides basic insights without any user-side tracking or Privacy Policy changes.

