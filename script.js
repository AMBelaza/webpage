const DEFAULT_LANG = 'en';
let currentLang = DEFAULT_LANG;

// Fetch JSON safely
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

// Load language, merge with English defaults, and render
async function loadAndApplyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update active button state
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Load base (English) and target translations in parallel
  const [base, trans] = await Promise.all([
    fetchJSON(`translations/${DEFAULT_LANG}.json`),
    fetchJSON(`translations/${lang}.json`).catch(() => ({})) // Returns {} if file missing
  ]);

  // Merge: target overrides base, missing keys fall back to base
  const merged = {
    name: trans.name || base.name,
    bio: trans.bio || base.bio,
    social: {}
  };

  // Merge social links safely
  for (const [key, baseLink] of Object.entries(base.social)) {
    merged.social[key] = {
      name: trans.social?.[key]?.name || baseLink.name,
      url: trans.social?.[key]?.url || baseLink.url
    };
  }

  renderSocialLinks(merged.social);
  applyTextTranslations(trans);
}

// Dynamically render social links
function renderSocialLinks(socialData) {
  const container = document.getElementById('social-links');
  container.innerHTML = ''; // Clear previous

  for (const [key, data] of Object.entries(socialData)) {
    const a = document.createElement('a');
    a.href = data.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'social-link';
    a.dataset.socialKey = key;
    a.textContent = data.name;
    container.appendChild(a);
  }
}

// Apply text translations to data-i18n elements
function applyTextTranslations(trans) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const keys = key.split('.');
    let value = trans;
    for (const k of keys) value = value?.[k];
    if (value) el.textContent = value;
  });
}

// Map of flag emoji → language code
const FLAG_TO_LANG = {
  '🇪🇸': 'es',
  '🇺🇸': 'en',
  '🇳🇱': 'nl'
};

// Valid languages that have translation files
const VALID_LANGUAGES = ['en', 'es'];

// Just the flags, no extra data needed
const userLanguages = ['🇪🇸', '🇺🇸', '🇳🇱'];

function renderLanguages() {
  const container = document.getElementById('languages');
  if (!container) return;
  
  container.innerHTML = ''; // Clear previous
  userLanguages.forEach(flag => {
    const span = document.createElement('span');
    span.className = 'lang-flag';
    span.textContent = flag;
    span.title = flag;

    const lang = FLAG_TO_LANG[flag];
    const isValid = VALID_LANGUAGES.includes(lang);

    if (isValid) {
      span.dataset.lang = lang;
      span.classList.add('valid');
      span.addEventListener('click', () => {
        loadAndApplyLanguage(lang);
      });
    } else {
      span.classList.add('invalid');
    }

    container.appendChild(span);
  });
}

// Make sure it's called on load
document.addEventListener('DOMContentLoaded', () => {
  renderLanguages();
  loadAndApplyLanguage('en');

  // Attach click handlers to language switcher buttons
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      loadAndApplyLanguage(btn.dataset.lang);
    });
  });
});

