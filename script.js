// Default language
let currentLang = 'en';

// Load translations from JSON
async function loadTranslations(lang) {
  try {
    const res = await fetch(`translations/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load ${lang} translations`);
    return await res.json();
  } catch (err) {
    console.warn(`Translation load error for ${lang}:`, err);
    return {};
  }
}

// Apply translations to DOM
async function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update active button
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const translations = await loadTranslations(lang);
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    if (value !== undefined) el.textContent = value;
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => setLanguage('en'));

// Bind language buttons
document.querySelectorAll('.lang-switcher button').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
