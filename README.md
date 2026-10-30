# BNI ICONS · Member Business Directory

A static member directory for the BNI ICONS chapter, served at **https://icons.funnel135.com/** by GitHub Pages (branch `main`, repository root).

It is plain HTML, CSS and JavaScript: no build step, no frameworks, no CDN, no tracking.

```
/
├── index.html                    the directory page
├── CNAME                         custom domain (do not edit or delete)
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   ├── fonts/                    self-hosted General Sans + IBM Plex Mono
│   └── images/
│       ├── default-avatar.svg    shown when a photo is missing or fails
│       └── members/              member headshots
├── data/
│   ├── members.json              ← the member list (the only file you edit)
│   └── members.sample.json       sample data for testing only
└── profile/
    └── ryan.html                 member presentation pages (do not edit here)
```

---

## Adding a member

You only touch two places: the photo folder and `data/members.json`. Never `index.html` or `app.js`.

**1. Add the photo**

- Square headshot, at least **600 × 600 px**, saved as **WebP** (`.webp`). JPG or PNG also work.
- Name it after the member in lower case with hyphens, for example `jane-tan.webp`.
- Upload it to `assets/images/members/`.

**2. Add the member to `data/members.json`**

Copy an existing block, paste it after the last one, and put a **comma** between the blocks:

```json
[
  {
    "slug": "ryan",
    "...": "..."
  },
  {
    "slug": "jane-tan",
    "name": "Jane Tan",
    "company": "Tan & Co Accounting",
    "mainClassification": "Professional Services",
    "subClassification": "Accounting",
    "role": "Member",
    "photo": "assets/images/members/jane-tan.webp",
    "bniProfileUrl": "https://bnimalaysia.com/en-MY/memberdetails?encryptedMemberId=...",
    "localProfileUrl": "",
    "keywords": ["Tax", "Bookkeeping", "Audit"]
  }
]
```

| Field | Required | Notes |
|---|---|---|
| `slug` | recommended | Short id, lower case with hyphens. Must be unique. |
| `name` | **yes** | Entries without a name are skipped. |
| `company` | no | Business name. |
| `mainClassification` | recommended | The BNI main classification group, e.g. `TED (Tech, E-Commerce, Digital)`. The **Classification** dropdown is built from these automatically and filters by them. Spell it exactly the same for every member in the same group. |
| `subClassification` | recommended | The member's own (second-layer) classification, e.g. `Computer Hardware`, `Social Media Production`. Shown on the card under the main group and included in search. (An older `classification` field is still read as this.) |
| `role` | recommended | `Member`, or a leadership role: `President`, `Vice President`, `Secretary/Treasurer`, `Secretary`, `Treasurer`, `Membership Committee`, `Visitor Host`, `Education Coordinator`, `Mentor Coordinator`, `Event Coordinator`, `Growth Coordinator`. Shown as a badge on the photo (red for leadership, grey for Member) and translated automatically. Any other role is shown exactly as written. Left out, it counts as `Member`. |
| `photo` | no | Path to the photo. Leave `""` to show the default avatar. |
| `bniProfileUrl` | no | The member's real BNI profile page. Copy it from the browser address bar on the BNI site. Never guess it. Opens in a new tab. |
| `localProfileUrl` | no | A page in this site, e.g. `profile/jane-tan.html`. Used only when there is no BNI URL. |
| `keywords` | no | Extra search words: services, specialities, industries. |

If both profile URLs are empty, the card shows "Profile coming soon" and isn't clickable.

**3. Commit**

On GitHub: open the file → pencil icon → edit → **Commit changes**. The site updates in about a minute.

### Before you commit: check the JSON

One missing comma or quote breaks the whole list. Paste the file into https://jsonlint.com (or any JSON validator) and fix anything it reports. Common mistakes:

- no comma between two `{ ... }` blocks
- a comma after the **last** block or last field (not allowed)
- curly quotes `“ ”` instead of straight quotes `" "`

If the list ever fails to load, the page shows "The member list couldn't be loaded" and the browser console (F12) says why.

### Languages

The **EN / MY / CN** buttons switch the page text between English, Bahasa Melayu and Chinese. The choice is remembered on that device, and a link can open in a set language with `?lang=en`, `?lang=my` or `?lang=cn`. Member details (names, businesses, classifications, keywords) are shown exactly as written in `members.json` and are not translated. Role badges are the exception. Interface wording lives in the `STRINGS` table at the top of `assets/js/app.js`.

### Editing or removing a member

Edit their block in `members.json`, or delete the whole block (including its `{ }` and the comma that separated it). Delete their photo too if it's no longer needed.

---

## Running it locally

`fetch()` doesn't work when the page is opened straight from disk (`file://`). Run a tiny local server from the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. Add `?sample=1` (http://localhost:8000/?sample=1) to load the sample members instead of the real list. They're marked "(sample)" and use example.com links only.

---

## Test checklist

**Responsive layout**
- [ ] Phone (≈375 px): one card per row, filters stacked, no sideways scrolling.
- [ ] Large phone / small tablet (≥480 px): two cards per row.
- [ ] Tablet (≈768 px): two per row; search, classification, sort and Clear filters on one line.
- [ ] Laptop (≥960 px): three per row. Desktop (≥1200 px): four per row.
- [ ] The filter bar sticks to the top while scrolling the list.

**Search and filters** (use `?sample=1` for more than one member)
- [ ] Typing filters instantly, with no reload, across name, business, classification and keywords.
- [ ] Matching ignores case (`ai`, `AI`, `Ai` give the same result).
- [ ] The classification dropdown starts on "All Classifications" and lists each **main** classification once, A–Z. Choosing one shows every member in that group, whatever their second-layer classification.
- [ ] Cards show the main classification (grey) above the member's own classification (red).
- [ ] Leadership roles show a red badge on the photo; everyone else shows a grey "Member" badge. Searching "president" finds the President.
- [ ] EN / MY / CN switches every label, button, placeholder, count and badge, and the choice survives a page refresh.
- [ ] Search and classification work together, and changing either one keeps the other applied.
- [ ] Sort switches between Name A–Z, Name Z–A and Business A–Z.
- [ ] "Showing X of Y members" updates every time.
- [ ] Searching for nonsense shows "No members match your search"; "Show all members" and "Clear filters" both bring everyone back.

**Profile navigation**
- [ ] Clicking anywhere on a card opens the profile.
- [ ] A card with a BNI URL says "View BNI Profile" and opens a new tab.
- [ ] A card with only a local page says "View Profile" and opens in the same tab (e.g. `profile/ryan.html`).
- [ ] A card with neither says "Profile coming soon" and isn't a link.
- [ ] Tab moves through the search, dropdowns, button and every card with a visible red focus ring; Enter opens the focused card.

**Photos**
- [ ] Photos are square and aren't stretched.
- [ ] A member with `"photo": ""` shows the default avatar.
- [ ] A wrong photo path shows the default avatar, never a broken-image icon (sample member B tests this).
- [ ] Photos further down the page load only as you scroll (lazy loading).

**GitHub Pages deployment**
- [ ] `CNAME` still contains `icons.funnel135.com`.
- [ ] Settings → Pages: source is `main` / root, custom domain is `icons.funnel135.com`, **Enforce HTTPS** is ticked.
- [ ] https://icons.funnel135.com/ loads the directory and https://icons.funnel135.com/profile/ryan.html still works.
- [ ] After editing `members.json`, the change appears within a few minutes (hard-refresh with Ctrl+Shift+R if not).
- [ ] The browser console (F12) shows no errors.
