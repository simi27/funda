# Geo-Currency Pricing Plan

> **Branch:** panafrican

**Goal:** Auto-detect user's country via IP geolocation, show pricing in local currency (ZAR/NGN/MWK/KES), with a toggle to switch to USD. Manual preference persists in localStorage.

**Architecture:** Client-side JS with ipapi.co (no API key, 1k req/month free). Currency rates stored in hugo.toml, injected as JS object. All prices rendered with `data-price-zar` attributes for JS conversion. Small currency pill button next to pricing heading.

**Tech Stack:** Hugo static site, vanilla JS, ipapi.co geolocation API.

---

## Task 1: Add currency config to hugo.toml

**File:** `/home/simi27/funda-site/hugo.toml`

Add before the Pricing section:

```toml
  # Geo-currency
  [[params.currencies]]
    code = "ZAR"
    symbol = "R"
    name = "South African Rand"
    rate = 1.0
    countries = ["ZA", "LS", "SZ", "NA"]

  [[params.currencies]]
    code = "NGN"
    symbol = "₦"
    name = "Nigerian Naira"
    rate = 84.0
    countries = ["NG"]

  [[params.currencies]]
    code = "MWK"
    symbol = "MK"
    name = "Malawian Kwacha"
    rate = 98.0
    countries = ["MW"]

  [[params.currencies]]
    code = "KES"
    symbol = "KSh"
    name = "Kenyan Shilling"
    rate = 7.5
    countries = ["KE"]

  [[params.currencies]]
    code = "USD"
    symbol = "$"
    name = "US Dollar"
    rate = 0.055
    countries = ["US", "default"]
```

## Task 2: Add data-price-zar attributes to pricing-card.html

**File:** `/home/simi27/funda-site/themes/mana/layouts/partials/pricing-card.html`

Wrap price amount in a span with data attr:

```html
<div class="pricing-amount"><span data-price-zar="{{ $tier.priceZAR }}">{{ $tier.price }}</span><small>{{ $tier.period }}</small></div>
```

## Task 3: Add priceZAR fields to hugo.toml pricing tiers

Each tier gets `priceZAR = "79"` (numeric value of price in ZAR).

## Task 4: Inject currency JS object via Hugo partial

**Create:** `/home/simi27/funda-site/themes/mana/layouts/partials/currencies.html`

```html
<script>
window.__FUNDA_CURRENCIES__ = [
  {{ range site.Params.currencies }}
  { code: "{{ .code }}", symbol: "{{ .symbol }}", name: "{{ .name }}", rate: {{ .rate }}, countries: [{{ range $i, $c := .countries }}{{ if $i }},{{ end }}"{{ $c }}"{{ end }}] },
  {{ end }}
];
</script>
```

## Task 5: Add currency toggle button to pricing section

**File:** `/home/simi27/funda-site/themes/mana/layouts/_default/home.html`

Add below `<h2 class="section-heading">Pricing</h2>`:

```html
<button class="currency-toggle" id="currencyToggle" onclick="cycleCurrency()" title="Change currency">
  <span id="currencyLabel">R</span>
</button>
```

## Task 6: Write geo-currency JS

**Create:** `/home/simi27/funda-site/themes/mana/assets/js/currency.js`

```js
(function() {
  const currencies = window.__FUNDA_CURRENCIES__ || [];
  const defaultCurrency = currencies.find(c => c.countries.indexOf('default') !== -1) || currencies[0];
  
  function getCurrencyForCountry(countryCode) {
    for (const c of currencies) {
      if (c.countries.indexOf(countryCode) !== -1) return c;
    }
    return defaultCurrency;
  }
  
  function formatPrice(zarAmount, currency) {
    const converted = Math.round(zarAmount * currency.rate);
    if (currency.code === 'USD') return currency.symbol + converted;
    return currency.symbol + converted.toLocaleString();
  }
  
  function applyCurrency(currency) {
    document.querySelectorAll('[data-price-zar]').forEach(el => {
      const zar = parseFloat(el.dataset.priceZar);
      el.textContent = formatPrice(zar, currency);
    });
    const label = document.getElementById('currencyLabel');
    if (label) label.textContent = currency.symbol + ' ' + currency.code;
    localStorage.setItem('funda-currency', currency.code);
    if (window.__fundaCurrency) window.__fundaCurrency = currency;
  }
  
  function cycleCurrency() {
    const current = window.__fundaCurrency;
    const idx = currencies.indexOf(current);
    const next = currencies[(idx + 1) % currencies.length];
    applyCurrency(next);
  }
  
  async function init() {
    // Check for stored preference first
    const stored = localStorage.getItem('funda-currency');
    if (stored) {
      const c = currencies.find(c => c.code === stored);
      if (c) { applyCurrency(c); return; }
    }
    
    // Geo-detect
    try {
      const resp = await fetch('https://ipapi.co/json/');
      const data = await resp.json();
      const currency = getCurrencyForCountry(data.country_code);
      applyCurrency(currency);
    } catch {
      applyCurrency(defaultCurrency);
    }
  }
  
  init();
})();
```

## Task 7: Add currency.css

**Create:** `/home/simi27/funda-site/themes/mana/assets/css/currency.css`

```css
.currency-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: var(--s2);
  padding: 2px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--hair);
  border-radius: var(--r1);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--mute);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-standard);
  vertical-align: middle;
}

.currency-toggle:hover {
  border-color: var(--forest);
  color: var(--forest);
}

#currencyLabel {
  font-weight: 700;
  color: var(--forest);
}
```

## Task 8: Add currency.js import to head/css.html

**File:** `/home/simi27/funda-site/themes/mana/layouts/partials/head.html`

Add the JS and CSS partials. Also include the currencies.html data injection.

---

## Verification

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c '__FUNDA_CURRENCIES__' public/index.html    # 1
grep -c 'data-price-zar' public/index.html           # >0
grep -c 'currency-toggle' public/index.html          # 1
grep -c 'ipapi.co' public/index.html                 # 1
```
