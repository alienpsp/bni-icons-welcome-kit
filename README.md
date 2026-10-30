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
│   └── members.json              ← the member list (the only file you edit)
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
| `role` | recommended | `Member`, or a leadership role: `President`, `Vice President`, `Secretary/Treasurer`, `Secretary`, `Treasurer`, `Membership Committee`, `Visitor Host`, `Education Coordinator`, `Mentor Coordinator`, `Event Coordinator`, `Growth Coordinator`. Shown as a badge on the photo exactly as written: red for any leadership role, grey for `Member`. Left out, it counts as `Member`. |
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

The **EN / BM / 中文** buttons switch the page text (introduction, filters, counts, messages, footer) between English, Bahasa Melayu and Simplified Chinese. The choice is remembered on that device, and a link can open in a set language with `?lang=en`, `?lang=bm` or `?lang=cn`. The member cards are never translated: names, businesses, classifications, role badges and the "View Profile" link stay exactly as written. Page wording lives in the `STRINGS` table at the top of `assets/js/app.js`.

### Editing or removing a member

Edit their block in `members.json`, or delete the whole block (including its `{ }` and the comma that separated it). Delete their photo too if it's no longer needed.

---

## Running it locally

`fetch()` doesn't work when the page is opened straight from disk (`file://`). Run a tiny local server from the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

A test entry can carry `"sample": true`; its card then shows "(sample)" after the name so nobody mistakes it for a real member. Remove test entries before the site goes public.

