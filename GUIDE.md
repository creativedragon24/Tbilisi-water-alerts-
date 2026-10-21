# Tbilisi Water: hosting and launch guide

## What is in the folder

| File | Purpose |
|---|---|
| `index.html` | The whole app (UI, logic, icon sprite) |
| `manifest.webmanifest` | Makes it installable ("Add to Home Screen") |
| `sw.js` | Offline support and caching |
| `icons/` | Logo (SVG) and app icons (PNG) |
| `fonts/` | Inter and Noto Sans Georgian (self-hosted, work offline) |
| `THIRD-PARTY-NOTICES.md` | Licenses for the free icons and fonts |

Free sources used: [Phosphor Icons](https://github.com/phosphor-icons/core) (MIT), [Inter](https://github.com/rsms/inter) and [Noto Sans Georgian](https://github.com/notofonts/georgian) (SIL Open Font License), packaged via [Fontsource](https://fontsource.org). Layout and styling are custom.

The app reads `current_alerts.json` from your bot repo (`creativedragon24/potential-telegram-water`, branch `main`). Your GitHub Action already updates that file every hour, so no API key is needed. The bot repo must stay **public**.

---

## Option A: GitHub Pages (free, recommended)

### 1. Create a new repo
1. Go to github.com → **New repository**.
2. Name: `tbilisi-water`. Visibility: **Public**. Click **Create repository**.

Use a separate repo from the bot. The bot repo holds subscriber data and should not be your public website.

### 2. Upload the files
**Easiest (on a computer):**
1. Unzip `tbilisi-water.zip`.
2. In the new repo click **Add file → Upload files**.
3. Drag in everything from inside the unzipped folder: `index.html`, `manifest.webmanifest`, `sw.js`, `THIRD-PARTY-NOTICES.md`, `GUIDE.md` and the `icons` and `fonts` folders.
4. Click **Commit changes**.

**With git:**
```bash
unzip tbilisi-water.zip -d tbilisi-water
cd tbilisi-water
git init -b main
git add .
git commit -m "Tbilisi Water PWA"
git remote add origin https://github.com/creativedragon24/tbilisi-water.git
git push -u origin main
```

### 3. Turn on Pages
1. Repo → **Settings → Pages**.
2. Under **Build and deployment** set Source to **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Click **Save**.

### 4. Open your site
After 1 to 2 minutes it is live at:

`https://creativedragon24.github.io/tbilisi-water/`

(The URL is `https://YOUR-USERNAME.github.io/REPO-NAME/`.) GitHub provides HTTPS automatically, which installable apps require.

### 5. Test the install
- **Android (Chrome):** open the site. An **Install** banner appears in the app. You can also use the browser menu (⋮) → **Install app**.
- **iPhone (must be Safari):** tap **Share** → **Add to Home Screen**. The app shows these instructions itself.
- After installing, open it from the home screen. It should open full screen with no browser bar.

### 6. Check the data is live
The "Updated" time under the title should be recent. If you see "Data may be outdated":
- Repo `potential-telegram-water` → **Actions** tab: is the hourly workflow running and green?
- Is that repo public?
- Does `DATA_URL` at the top of the script in `index.html` match your repo and branch?

---

## Option B: no-git alternatives (also free tiers)
- **Netlify Drop:** go to app.netlify.com/drop and drag the unzipped folder in. You get an HTTPS link in seconds.
- **Cloudflare Pages:** create a project with **Direct Upload** and upload the folder.

Check each platform's current free-tier limits before relying on it.

---

## Customizing
- **Telegram link:** in `index.html` set `const TELEGRAM_URL = 'https://t.me/YOUR_BOT';`. A "Get alerts on Telegram" row then appears in Settings. This is your best retention tool, because the PWA cannot send background push alerts without a server and your bot already can.
- **Colors:** brand colors are CSS variables at the top of the `<style>` block (`--brand`, `--hero`).
- **Releasing an update:** after changing any file, change `VERSION` in `sw.js` (for example `tbwater-v3`). Otherwise phones may keep showing the old version.

---

## Reaching real users

Water outages are a "right now" problem. People search and ask for help during the outage, so reach them there.

1. **Post at the moment of need.** When GWP announces an outage, post in the affected district's groups: "Water out on Iqalto? Back by 16:00 per GWP", with a screenshot of the app and the link. This is the highest-intent moment.
2. **Neighborhood groups first.** Facebook district and building groups, Viber and Telegram building chats, expat groups. Start with the districts that have the most outages. Read each group's rules on self-promotion first and ask admins if needed.
3. **QR code.** Generate a free QR code for your link (any QR generator). Print it for building entrances, notice boards, local cafes and shops. Add a line in Georgian.
4. **Search.** Outages make people search in Georgian. Put the Georgian words people actually search (for example "წყლის გათიშვა თბილისი") in the page title and description. The app already has a bilingual description tag, so review and tune it.
5. **Local media and creators.** Send a short note to Tbilisi news pages and local community admins: "free tool that shows when water returns, by street".
6. **Ask GWP.** A reply or a link from them is the strongest trust signal. Use the email draft from earlier.
7. **Share button.** Settings has a "Share app" row (on phones that support sharing). Ask people who find it useful to send it to their building chat.
8. **Measure.** Add a privacy-friendly counter such as GoatCounter (free for non-commercial use) if you want visit numbers. Mention it if you add one, since the app currently collects no personal data.

I have not verified which specific groups or channels exist or allow posts, so search for them yourself first.

---

## Before you launch
- Have a native Georgian speaker read the Georgian text. I wrote the translations and they need a native check.
- Keep the "Unofficial app" note in Settings. The app is not made by GWP.
- Remove `subscribers.json` from the bot repo (it lists Telegram chat IDs) and add it to `.gitignore`. The IDs stay in git history unless you rewrite it.
- Test on one real Android phone and one iPhone, in light and dark mode.
- Street names in English are automatic transliterations from Georgian, so spellings are approximate.
