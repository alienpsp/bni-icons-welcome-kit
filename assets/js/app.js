/* ==============================================================
 * BNI ICONS · Member Business Directory
 *
 * Loads data/members.json, renders one card per member and filters
 * them as the visitor types. Every value from the JSON is written
 * with textContent or a validated attribute, never as HTML.
 *
 * Adding a member never requires editing this file: see README.md.
 * ============================================================== */

(function () {
  'use strict';

  var DATA_URL = 'data/members.json';
  // ?sample=1 loads the clearly labelled sample members instead, for testing.
  var SAMPLE_URL = 'data/members.sample.json';
  var DEFAULT_AVATAR = 'assets/images/default-avatar.svg';

  var els = {
    form: document.getElementById('filters'),
    search: document.getElementById('search'),
    classification: document.getElementById('classification'),
    sort: document.getElementById('sort'),
    count: document.getElementById('count'),
    stats: document.getElementById('stats'),
    grid: document.getElementById('grid'),
    empty: document.getElementById('empty'),
    emptyReset: document.getElementById('empty-reset'),
    error: document.getElementById('error')
  };

  var members = [];

  /* ------------------------------------------------------------
   * DATA -- validate and normalise each record
   * ---------------------------------------------------------- */

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  // Lower-case and strip accents so "jose" finds "José".
  function fold(value) {
    return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  // Absolute http(s) URLs, or a relative path inside this site.
  // Anything else (javascript:, data:, //host) is dropped.
  function safeUrl(value) {
    var url = text(value);
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.indexOf('//') === 0) return '';
    return url.replace(/^\/+/, ''); // keep paths relative to the site root
  }

  function normalise(raw, index) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      console.warn('[directory] Skipped entry #' + (index + 1) + ': not an object.');
      return null;
    }
    var name = text(raw.name);
    if (!name) {
      console.warn('[directory] Skipped entry #' + (index + 1) + ': missing "name".');
      return null;
    }

    var keywords = raw.keywords;
    if (typeof keywords === 'string') keywords = keywords.split(',');
    keywords = Array.isArray(keywords) ? keywords.map(text).filter(Boolean) : [];

    var member = {
      slug: text(raw.slug) || fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: name,
      company: text(raw.company),
      classification: text(raw.classification),
      photo: safeUrl(raw.photo),
      bniProfileUrl: safeUrl(raw.bniProfileUrl),
      localProfileUrl: safeUrl(raw.localProfileUrl),
      keywords: keywords,
      sample: raw.sample === true
    };
    member.haystack = fold([member.name, member.company, member.classification].concat(keywords).join(' '));
    return member;
  }

  /* ------------------------------------------------------------
   * CARDS
   * ---------------------------------------------------------- */

  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var EXTERNAL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9"/></svg>';

  function el(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  }

  function photo(member) {
    var img = document.createElement('img');
    img.className = 'card__img';
    img.width = 600;
    img.height = 600;
    img.loading = 'lazy';
    img.decoding = 'async';

    var useDefault = function () {
      img.src = DEFAULT_AVATAR;
      img.alt = ''; // decorative: the name is right below
    };
    if (member.photo) {
      img.alt = 'Photo of ' + member.name;
      img.addEventListener('error', function onError() {
        img.removeEventListener('error', onError);
        useDefault();
      });
      img.src = member.photo;
    } else {
      useDefault();
    }

    var media = el('div', 'card__media');
    media.appendChild(img);
    return media;
  }

  function card(member) {
    // BNI profile first, then the local profile page, else no link at all.
    var href = member.bniProfileUrl || member.localProfileUrl;
    var external = /^https?:\/\//i.test(href);
    var root;

    if (href) {
      root = document.createElement('a');
      root.href = href;
      if (external) {
        root.target = '_blank';
        root.rel = 'noopener noreferrer';
      }
    } else {
      root = document.createElement('article');
    }
    root.className = 'card';

    root.appendChild(photo(member));

    var body = el('div', 'card__body');
    if (member.classification) body.appendChild(el('p', 'card__class', member.classification));
    body.appendChild(el('h3', 'card__name', member.name + (member.sample ? ' (sample)' : '')));
    if (member.company) body.appendChild(el('p', 'card__company', member.company));

    var cta;
    if (href) {
      cta = el('span', 'card__cta', member.bniProfileUrl ? 'View BNI Profile' : 'View Profile');
      cta.insertAdjacentHTML('beforeend', external ? EXTERNAL : ARROW); // static icon markup only
      if (external) cta.appendChild(el('span', 'visually-hidden', ' (opens in a new tab)'));
    } else {
      cta = el('span', 'card__cta card__cta--muted', 'Profile coming soon');
    }
    body.appendChild(cta);
    root.appendChild(body);

    var item = document.createElement('li');
    item.appendChild(root);
    return item;
  }

  /* ------------------------------------------------------------
   * FILTER + SORT
   * ---------------------------------------------------------- */

  var collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

  var SORTS = {
    'name-asc': function (a, b) { return collator.compare(a.name, b.name); },
    'name-desc': function (a, b) { return collator.compare(b.name, a.name); },
    'company-asc': function (a, b) {
      // Members without a business go last.
      if (!a.company !== !b.company) return a.company ? -1 : 1;
      return collator.compare(a.company, b.company) || collator.compare(a.name, b.name);
    }
  };

  function plural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
  }

  function render() {
    // Every term must appear somewhere: "ai sme" matches members tagged with both.
    var terms = fold(els.search.value).split(/\s+/).filter(Boolean);
    var chosen = els.classification.value;
    var sorter = SORTS[els.sort.value] || SORTS['name-asc'];

    var shown = members.filter(function (m) {
      if (chosen && m.classification !== chosen) return false;
      return terms.every(function (t) { return m.haystack.indexOf(t) !== -1; });
    }).sort(sorter);

    var fragment = document.createDocumentFragment();
    shown.forEach(function (m) { fragment.appendChild(card(m)); });
    els.grid.replaceChildren(fragment);

    els.count.textContent = 'Showing ' + shown.length + ' of ' + plural(members.length, 'member');
    els.empty.hidden = shown.length > 0 || members.length === 0;
  }

  function fillClassifications() {
    var seen = {};
    members.forEach(function (m) { if (m.classification) seen[m.classification] = true; });
    Object.keys(seen).sort(collator.compare).forEach(function (c) {
      var option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      els.classification.appendChild(option);
    });
    return Object.keys(seen).length;
  }

  function reset() {
    els.form.reset();
    render();
    els.search.focus();
  }

  /* ------------------------------------------------------------
   * BOOT
   * ---------------------------------------------------------- */

  function showError(err) {
    console.error('[directory] Could not load members:', err);
    els.grid.removeAttribute('aria-busy');
    els.count.textContent = 'Member list unavailable';
    els.error.hidden = false;
  }

  function start(data) {
    if (!Array.isArray(data)) throw new Error('members.json must contain a list ([ ... ]) of members.');

    members = data.map(normalise).filter(Boolean);
    var classes = fillClassifications();

    if (members.length) {
      els.stats.textContent = plural(members.length, 'member') + ' · ' + plural(classes, 'classification');
      els.stats.hidden = false;
    }

    els.form.addEventListener('submit', function (e) { e.preventDefault(); });
    els.search.addEventListener('input', render);
    els.classification.addEventListener('change', render);
    els.sort.addEventListener('change', render);
    els.form.addEventListener('reset', function () { setTimeout(render, 0); }); // after the browser clears the fields
    els.emptyReset.addEventListener('click', reset);

    els.grid.removeAttribute('aria-busy');
    render();

    if (!members.length) {
      els.count.textContent = 'No members listed yet';
    }
  }

  var url = /[?&]sample=1\b/.test(location.search) ? SAMPLE_URL : DATA_URL;

  fetch(url, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      return res.json();
    })
    .then(start)
    .catch(showError);
})();
