/* ==============================================================
 * BNI ICONS · Member Business Directory
 *
 * Loads data/members.json, renders one card per member and filters
 * them as the visitor types. Every value from the JSON is written
 * with textContent or a validated attribute, never as HTML.
 *
 * Page text comes in English, Bahasa Melayu and Chinese. The member
 * cards always stay in English, exactly as written in the JSON.
 *
 * Adding a member never requires editing this file: see README.md.
 * ============================================================== */

(function () {
  'use strict';

  var DATA_URL = 'data/members.json';
  var DEFAULT_AVATAR = 'assets/images/default-avatar.svg';
  var LANG_KEY = 'icons-lang';

  /* ------------------------------------------------------------
   * LANGUAGE -- interface strings
   * ---------------------------------------------------------- */

  var STRINGS = {
    en: {
      skip: 'Skip to member directory',
      language: 'Language',
      eyebrowIndex: 'Chapter',
      eyebrow: 'Business referral network',
      subtitle: 'Member Business Directory',
      lede: 'Find trusted professionals from our chapter, get to know what each member does, and connect with the right person for your next referral or business conversation.',
      metaDescription: 'Find trusted professionals in the BNI ICONS chapter. Search members by name, business, classification or expertise and connect with the right person for your next referral.',
      filtersRegion: 'Search and filter members',
      searchLabel: 'Search',
      searchPlaceholder: 'Search by name, business or expertise...',
      classLabel: 'Classification',
      allClasses: 'All Classifications',
      sortLabel: 'Sort by',
      sortNameAsc: 'Name (A–Z)',
      sortNameDesc: 'Name (Z–A)',
      sortCompany: 'Business (A–Z)',
      reset: 'Clear filters',
      loading: 'Loading members…',
      resultsRegion: 'Members',
      emptyTitle: 'No members match your search',
      emptyText: 'Try a different name or keyword, or show every classification.',
      emptyReset: 'Show all members',
      errorTitle: "The member list couldn't be loaded",
      errorText: 'Please refresh the page. If the problem continues, let the chapter administrator know.',
      footerNote: 'A chapter-maintained directory. Member details are provided by each member.',
      count: function (shown, total) { return 'Showing ' + shown + ' of ' + total + (total === 1 ? ' member' : ' members'); },
      stats: function (m, c) { return m + (m === 1 ? ' member' : ' members') + ' · ' + c + (c === 1 ? ' classification' : ' classifications'); },
      noMembers: 'No members listed yet',
      unavailable: 'Member list unavailable'
    },
    ms: {
      skip: 'Langkau ke direktori ahli',
      language: 'Bahasa',
      eyebrowIndex: 'Chapter',
      eyebrow: 'Rangkaian rujukan perniagaan',
      subtitle: 'Direktori Perniagaan Ahli',
      lede: 'Cari profesional yang dipercayai dalam chapter kami, kenali perniagaan setiap ahli, dan berhubung dengan orang yang tepat untuk rujukan atau perbincangan perniagaan anda yang seterusnya.',
      metaDescription: 'Cari profesional yang dipercayai dalam chapter BNI ICONS. Cari ahli mengikut nama, perniagaan, klasifikasi atau kepakaran.',
      filtersRegion: 'Cari dan tapis ahli',
      searchLabel: 'Cari',
      searchPlaceholder: 'Cari mengikut nama, perniagaan atau kepakaran...',
      classLabel: 'Klasifikasi',
      allClasses: 'Semua Klasifikasi',
      sortLabel: 'Susun mengikut',
      sortNameAsc: 'Nama (A–Z)',
      sortNameDesc: 'Nama (Z–A)',
      sortCompany: 'Perniagaan (A–Z)',
      reset: 'Kosongkan penapis',
      loading: 'Memuatkan ahli…',
      resultsRegion: 'Ahli',
      emptyTitle: 'Tiada ahli yang sepadan dengan carian anda',
      emptyText: 'Cuba nama atau kata kunci lain, atau paparkan semua klasifikasi.',
      emptyReset: 'Papar semua ahli',
      errorTitle: 'Senarai ahli tidak dapat dimuatkan',
      errorText: 'Sila muat semula halaman. Jika masalah berterusan, maklumkan kepada pentadbir chapter.',
      footerNote: 'Direktori yang diselenggara oleh chapter. Butiran ahli diberikan oleh setiap ahli.',
      count: function (shown, total) { return 'Memaparkan ' + shown + ' daripada ' + total + ' ahli'; },
      stats: function (m, c) { return m + ' ahli · ' + c + ' klasifikasi'; },
      noMembers: 'Belum ada ahli disenaraikan',
      unavailable: 'Senarai ahli tidak tersedia'
    },
    zh: {
      skip: '跳至会员名录',
      language: '语言',
      eyebrowIndex: '分会',
      eyebrow: '商业转介网络',
      subtitle: '会员商业名录',
      lede: '在本分会中寻找值得信赖的专业人士，了解每位会员的业务，并为您的下一次转介或商业洽谈联系合适的人。',
      metaDescription: '在 BNI ICONS 分会中寻找值得信赖的专业人士。按姓名、公司、行业类别或专长搜索会员。',
      filtersRegion: '搜索和筛选会员',
      searchLabel: '搜索',
      searchPlaceholder: '按姓名、公司或专长搜索...',
      classLabel: '行业类别',
      allClasses: '所有类别',
      sortLabel: '排序',
      sortNameAsc: '姓名（A–Z）',
      sortNameDesc: '姓名（Z–A）',
      sortCompany: '公司（A–Z）',
      reset: '清除筛选',
      loading: '正在加载会员…',
      resultsRegion: '会员',
      emptyTitle: '没有符合搜索条件的会员',
      emptyText: '请尝试其他姓名或关键词，或显示所有类别。',
      emptyReset: '显示所有会员',
      errorTitle: '无法加载会员名单',
      errorText: '请刷新页面。如问题持续，请联系分会管理员。',
      footerNote: '由分会维护的名录，会员资料由各会员提供。',
      count: function (shown, total) { return '显示 ' + total + ' 位会员中的 ' + shown + ' 位'; },
      stats: function (m, c) { return m + ' 位会员 · ' + c + ' 个类别'; },
      noMembers: '暂无会员',
      unavailable: '会员名单暂不可用'
    }
  };

  // Cards and member details stay in English whatever the page language.
  var CARD_TEXT = {
    viewBni: 'View BNI Profile',
    viewProfile: 'View Profile',
    comingSoon: 'Profile coming soon',
    newTab: ' (opens in a new tab)',
    sample: ' (sample)'
  };

  var LANGS = ['en', 'ms', 'zh'];
  var HTML_LANG = { en: 'en', ms: 'ms', zh: 'zh-Hans' };
  var lang = 'en';

  function t(key) {
    var value = STRINGS[lang][key];
    return value === undefined ? STRINGS.en[key] : value;
  }

  /* ------------------------------------------------------------
   * DOM
   * ---------------------------------------------------------- */

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
    error: document.getElementById('error'),
    langButtons: document.querySelectorAll('.lang button'),
    metaDescription: document.querySelector('meta[name="description"]')
  };

  // Whatever is written before " · " in <title> stays as it is.
  var titlePrefix = document.title.split(' · ')[0];

  var members = [];
  var state = 'loading'; // loading | ready | error
  var mainClassCount = 0;

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

    // Shown exactly as written; anything other than "Member" counts as a leadership role.
    var role = text(raw.role) || 'Member';

    var member = {
      slug: text(raw.slug) || fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: name,
      company: text(raw.company),
      mainClassification: text(raw.mainClassification),
      // "classification" is the older single field; it counts as the second layer.
      subClassification: text(raw.subClassification) || text(raw.classification),
      role: role,
      committee: role.toLowerCase() !== 'member',
      photo: safeUrl(raw.photo),
      bniProfileUrl: safeUrl(raw.bniProfileUrl),
      localProfileUrl: safeUrl(raw.localProfileUrl),
      keywords: keywords,
      sample: raw.sample === true
    };
    member.haystack = fold([member.name, member.company, member.mainClassification, member.subClassification, role]
      .concat(keywords).join(' '));
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
    media.appendChild(el('span', 'badge' + (member.committee ? ' badge--committee' : ''), member.role));
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
    root.className = 'card' + (member.committee ? ' card--committee' : '');

    root.appendChild(photo(member));

    var body = el('div', 'card__body');
    if (member.mainClassification) body.appendChild(el('p', 'card__main-class', member.mainClassification));
    if (member.subClassification) body.appendChild(el('p', 'card__class', member.subClassification));
    body.appendChild(el('h3', 'card__name', member.name + (member.sample ? CARD_TEXT.sample : '')));
    if (member.company) body.appendChild(el('p', 'card__company', member.company));

    var cta;
    if (href) {
      cta = el('span', 'card__cta', member.bniProfileUrl ? CARD_TEXT.viewBni : CARD_TEXT.viewProfile);
      cta.insertAdjacentHTML('beforeend', external ? EXTERNAL : ARROW); // static icon markup only
      if (external) cta.appendChild(el('span', 'visually-hidden', CARD_TEXT.newTab));
    } else {
      cta = el('span', 'card__cta card__cta--muted', CARD_TEXT.comingSoon);
    }
    // Cards keep English markup language even when the page is switched.
    root.setAttribute('lang', 'en');
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

  function render() {
    if (state !== 'ready') return;

    // Every term must appear somewhere: "ai sme" matches members tagged with both.
    var terms = fold(els.search.value).split(/\s+/).filter(Boolean);
    var chosen = els.classification.value;
    var sorter = SORTS[els.sort.value] || SORTS['name-asc'];

    var shown = members.filter(function (m) {
      if (chosen && m.mainClassification !== chosen) return false;
      return terms.every(function (term) { return m.haystack.indexOf(term) !== -1; });
    }).sort(sorter);

    var fragment = document.createDocumentFragment();
    shown.forEach(function (m) { fragment.appendChild(card(m)); });
    els.grid.replaceChildren(fragment);

    els.count.textContent = members.length ? t('count')(shown.length, members.length) : t('noMembers');
    els.empty.hidden = shown.length > 0 || members.length === 0;

    if (members.length) {
      els.stats.textContent = t('stats')(members.length, mainClassCount);
      els.stats.hidden = false;
    }
  }

  // The dropdown filters by the main classification only.
  function fillClassifications() {
    var seen = {};
    members.forEach(function (m) { if (m.mainClassification) seen[m.mainClassification] = true; });
    var list = Object.keys(seen).sort(collator.compare);
    list.forEach(function (c) {
      var option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      els.classification.appendChild(option);
    });
    return list.length;
  }

  function reset() {
    els.form.reset();
    render();
    els.search.focus();
  }

  /* ------------------------------------------------------------
   * LANGUAGE SWITCHING
   * ---------------------------------------------------------- */

  function setLang(next) {
    lang = LANGS.indexOf(next) === -1 ? 'en' : next;

    document.documentElement.lang = HTML_LANG[lang];
    document.title = titlePrefix + ' · ' + t('subtitle');
    if (els.metaDescription) els.metaDescription.setAttribute('content', t('metaDescription'));

    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) {
      node.setAttribute('placeholder', t(node.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
    });
    els.langButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    if (state === 'ready') render();
    else if (state === 'error') els.count.textContent = t('unavailable');

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode: not remembered */ }
  }

  function initialLang() {
    var match = location.search.match(/[?&]lang=(en|ms|my|bm|zh|cn)\b/i);
    if (match) {
      var code = match[1].toLowerCase();
      return code === 'my' || code === 'bm' ? 'ms' : code === 'cn' ? 'zh' : code;
    }
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }

  els.langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
  });
  setLang(initialLang());

  /* ------------------------------------------------------------
   * BOOT
   * ---------------------------------------------------------- */

  function showError(err) {
    console.error('[directory] Could not load members:', err);
    state = 'error';
    els.grid.removeAttribute('aria-busy');
    els.count.textContent = t('unavailable');
    els.error.hidden = false;
  }

  function start(data) {
    if (!Array.isArray(data)) throw new Error('members.json must contain a list ([ ... ]) of members.');

    members = data.map(normalise).filter(Boolean);
    mainClassCount = fillClassifications();

    els.form.addEventListener('submit', function (e) { e.preventDefault(); });
    els.search.addEventListener('input', render);
    els.classification.addEventListener('change', render);
    els.sort.addEventListener('change', render);
    els.form.addEventListener('reset', function () { setTimeout(render, 0); }); // after the browser clears the fields
    els.emptyReset.addEventListener('click', reset);

    els.grid.removeAttribute('aria-busy');
    state = 'ready';
    render();
  }

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + DATA_URL);
      return res.json();
    })
    .then(start)
    .catch(showError);
})();
