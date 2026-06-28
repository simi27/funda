# Pan-African Audience Expansion Plan

> **For Hermes:** Implement task-by-task. Each task is self-contained, ~3-5 minutes.

**Goal:** Adapt funda.africa to speak to businesses across South Africa, Tanzania, Malawi, Kenya, Nigeria, and the USA — replacing SA-only references with pan-African messaging, multi-currency awareness, and region-inclusive contact info.

**Architecture:** The site is a single-page Hugo site with all data in `hugo.toml` (SSoT), layouts in `themes/mana/layouts/`, and styles in `themes/mana/assets/css/`. Changes are surgical: TOML data arrays, partial HTML templates, and CSS tweaks. No structural overhaul needed.

**Tech Stack:** Hugo 0.123.7, HTML/CSS/JS, Netlify Forms, Netlify deploy.

---

## Task 1: Update Hero Copy for Pan-African Audience

**Objective:** Replace SA-centric hero copy with messaging that speaks to the full target audience.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `heroHeading`, `heroTagline`, `description`

**Step 1: Update `heroHeading`**

Change from the current heading to something inclusive:

```toml
heroHeading = "Your domain. Your email. Your brand — across Africa and beyond."
```

**Step 2: Update `heroTagline`**

Change from SA-focused to pan-African:

```toml
heroTagline = "Professional online presence for businesses in South Africa, Tanzania, Kenya, Malawi, Nigeria, and the United States."
```

**Step 3: Update site `description`**

```toml
description = "Funda gives African businesses the essential building blocks to get online — professional email at your own domain, fast websites, and reliable hosting. Serving South Africa, Tanzania, Kenya, Malawi, Nigeria, and the USA."
```

**Step 4: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c "across Africa" public/index.html
```

Expected: `1`

**Step 5: Commit**

```bash
git add hugo.toml
git commit -m "expand hero copy to pan-African audience"
```

---

## Task 2: Restructure Contact Section with All Target Regions

**Objective:** Replace the current SA/TZ two-column contact layout with a compact multi-region format covering all 6 target markets.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `[[params.countries]]` array and `ctaPhone`, `ctaWhatsApp`
- Replace: `/home/simi27/funda-site/themes/mana/layouts/_default/home.html` — contact info block

**Step 1: Rewrite `[[params.countries]]` in hugo.toml**

Remove old `[[params.countries]]` entries. Add entries for all 6 target markets:

```toml
[[params.countries]]
  name = "South Africa"
  code = "+27"
  flag_icon = "https://img.icons8.com/color/96/south-africa.png"
  phone = "+27 65 969 3995"
  whatsapp = "+27659693995"

[[params.countries]]
  name = "Tanzania"
  code = "+255"
  flag_icon = "https://img.icons8.com/color/96/tanzania.png"
  phone = "+255 79 699 9195"
  whatsapp = "+255796999195"

[[params.countries]]
  name = "Kenya"
  code = "+254"
  flag_icon = "https://img.icons8.com/color/96/kenya.png"
  phone = ""
  whatsapp = ""

[[params.countries]]
  name = "Malawi"
  code = "+265"
  flag_icon = "https://img.icons8.com/color/96/malawi.png"
  phone = ""
  whatsapp = ""

[[params.countries]]
  name = "Nigeria"
  code = "+234"
  flag_icon = "https://img.icons8.com/color/96/nigeria.png"
  phone = ""
  whatsapp = ""

[[params.countries]]
  name = "United States"
  code = "+1"
  flag_icon = "https://img.icons8.com/color/96/usa.png"
  phone = ""
  whatsapp = ""
```

**Step 2: Update global phone/WhatsApp fallbacks**

Set `ctaPhone` and `ctaWhatsApp` to the primary SA numbers (existing values are fine).

**Step 3: Rewrite the contact-info block in home.html**

Replace the current hardcoded SA/TZ contact section with a `range` loop over `site.Params.countries`. Use a compact horizontal grid (3 columns on desktop, 2 on tablet, 1 on mobile) instead of the current vertical stacking.

Format per country:

```html
<div class="contact-country">
  <h4 class="contact-country-label">
    <img width="18" height="13" src="{{ .flag_icon }}" alt="{{ .name }}" class="flag-icon">
    {{ .name }}
  </h4>
  {{ if .phone }}
  <a href="tel:{{ .phone }}" class="contact-phone">{{ .phone }}</a>
  {{ end }}
  {{ if .whatsapp }}
  <a href="https://wa.me/{{ .whatsapp }}" target="_blank" rel="noopener" class="contact-whatsapp">WhatsApp</a>
  {{ end }}
</div>
```

**Step 4: Update CSS for country grid**

In `/home/simi27/funda-site/themes/mana/assets/css/custom.css`, replace the `.contact-countries` CSS with a responsive grid:

```css
.contact-countries {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s2);
  margin-top: var(--s2);
}

@media (max-width: 768px) {
  .contact-countries {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .contact-countries {
    grid-template-columns: 1fr;
  }
}
```

**Step 5: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c "Kenya" public/index.html
grep -c "Malawi" public/index.html
grep -c "Nigeria" public/index.html
grep -c "United States" public/index.html
```

Expected: `1` for each.

**Step 6: Commit**

```bash
git add hugo.toml themes/mana/layouts/_default/home.html themes/mana/assets/css/custom.css
git commit -m "restructure contact section for 6 target regions"
```

---

## Task 3: Add Multi-Currency Pricing Awareness

**Objective:** Acknowledge USD and multi-currency pricing. Keep ZAR as primary but add "or USD equivalent" notes so USA/Nigerian/Kenyan clients understand pricing.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `pricingLabel`
- Modify: `/home/simi27/funda-site/themes/mana/layouts/_default/home.html` — pricing section heading

**Step 1: Update `pricingLabel` in hugo.toml**

```toml
pricingLabel = "All prices in South African Rand (ZAR). USD equivalents available on request. We serve businesses across Africa and the USA."
```

**Step 2: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c "USD equivalents" public/index.html
```

Expected: `1`

**Step 3: Commit**

```bash
git add hugo.toml
git commit -m "add multi-currency pricing note for international clients"
```

---

## Task 4: Update Domain Extensions for Pan-African Markets

**Objective:** Replace .co.za-only domain references with a broader set including .ke, .ng, .mw, .com.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `[[params.servicePricing]]` DOMAIN section tiers

**Step 1: Update domain pricing tiers in hugo.toml**

Replace the DOMAIN pricing tiers:

```toml
[[params.servicePricing.tiers]]
  name = "Country Domains"
  price = "From R199"
  period = "/yr"
  sub = ".co.za · .ke · .ng · .mw · .tz"
  ...
[[params.servicePricing.tiers]]
  name = "Global Domains"
  price = "From R249"
  period = "/yr"
  sub = ".com · .org · .net · .africa"
  ...
```

**Step 2: Update FAQ to reflect multi-country domains**

Modify the domain FAQ entry in hugo.toml:

```toml
answer = "Absolutely. You can bring any domain you own, or we'll register one for you — .co.za (South Africa), .ke (Kenya), .ng (Nigeria), .mw (Malawi), .tz (Tanzania), .com, and more."
```

**Step 3: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c "\.ke" public/index.html
grep -c "\.ng" public/index.html
```

Expected: `1` for each.

**Step 4: Commit**

```bash
git add hugo.toml
git commit -m "add pan-African domain extensions to pricing and FAQ"
```

---

## Task 5: Remove SA-Only References

**Objective:** Strip "Built in South Africa" messaging and any SA-exclusive copy. Replace with inclusive pan-African phrasing.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `footerText` or similar
- Modify: `/home/simi27/funda-site/themes/mana/layouts/partials/footer.html`

**Step 1: Check for SA-only references**

```bash
cd /home/simi27/funda-site && grep -rn "South Africa\|SA\|🇿🇦" hugo.toml themes/mana/layouts/ themes/mana/assets/
```

**Step 2: Replace "Built in South Africa" with pan-African message**

If `footerLocation` or `footerText` contains "Built in South Africa", change to:

```toml
footerLocation = "Serving businesses across Africa and the USA"
```

**Step 3: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep "Built in South Africa" public/index.html
```

Expected: `0` (no matches — removed)

**Step 4: Commit**

```bash
git add hugo.toml
git commit -m "remove SA-only references, use pan-African messaging"
```

---

## Task 6: Ensure All Target Countries in Phone Dropdown

**Objective:** Verify Malawi, Kenya, Nigeria, and USA are near the top of the country code dropdown (currently they exist but are buried).

**Files:**
- Modify: `/home/simi27/funda-site/themes/mana/layouts/_default/home.html` — country `<select>` options

**Step 1: Reorder the country dropdown**

Place target countries first in the `<select>`:

1. South Africa (+27)
2. Tanzania (+255)
3. Kenya (+254)
4. Malawi (+265)
5. Nigeria (+234)
6. United States (+1)
7. Then all others alphabetically

**Step 2: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
# Check Kenya, Malawi, Nigeria, USA all appear
grep -c "+254 KE" public/index.html
grep -c "+265 MW" public/index.html
grep -c "+234 NG" public/index.html
grep -c "+1 US" public/index.html
```

Expected: `1` for each.

**Step 3: Commit**

```bash
git add themes/mana/layouts/_default/home.html
git commit -m "reorder country dropdown with target markets first"
```

---

## Task 7: Add Pan-African Trust Signals to Value Props

**Objective:** Update the value proposition cards to reflect multi-country service.

**Files:**
- Modify: `/home/simi27/funda-site/hugo.toml` — `[[params.values]]` array

**Step 1: Update value prop copy**

Change the "SA Support" card to something broader:

```toml
[[params.values]]
  emoji = "🌍"
  heading = "Pan-African"
  text = "We serve businesses across South Africa, Tanzania, Kenya, Malawi, Nigeria, and the USA."
```

**Step 2: Build and verify**

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
grep -c "Pan-African" public/index.html
```

Expected: `1`

**Step 3: Commit**

```bash
git add hugo.toml
git commit -m "update value props with pan-African messaging"
```

---

## Validation Summary

After all tasks, run:

```bash
cd /home/simi27/funda-site && rm -rf public && hugo --minify
# All 6 target countries mentioned
for country in "South Africa" Tanzania Kenya Malawi Nigeria "United States"; do
  grep -cq "$country" public/index.html && echo "✅ $country" || echo "❌ $country"
done
# No stale SA-only references
grep -c "Built in South Africa" public/index.html && echo "❌ SA-only ref remains" || echo "✅ SA-only ref removed"
# Multi-currency note present
grep -c "USD" public/index.html && echo "✅ USD note" || echo "❌ USD note"
```

Expected: 6/6 countries, zero SA-only refs, USD note present.

---

## Risks & Notes

- **Contact section length:** 6 country cards could be visually heavy. The 3-column grid keeps it compact on desktop. The cards without phone numbers (Kenya, Malawi, Nigeria, USA) are smaller — just flag + country name, which signals "we serve here" without cluttering.
- **Pricing remains ZAR:** True multi-currency is complex (exchange rates, payment gateways). The "USD equivalents on request" approach is pragmatic and honest.
- **Malawi/KE/NG/USA phone numbers:** Currently empty. As the business grows, these can be populated. The template handles empty gracefully (no phone link rendered).
- **No structural changes:** All changes are data (hugo.toml), layout partials, and CSS. Nothing that risks breaking the build pipeline or Netlify deploy.
