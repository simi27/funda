(function() {
  var currencies = window.__FUNDA_CURRENCIES__ || [];
  if (!currencies.length) return;

  var defaultCurrency = currencies.find(function(c) { return c.countries.indexOf('default') !== -1; }) || currencies[0];

  function getCurrencyForCountry(countryCode) {
    for (var i = 0; i < currencies.length; i++) {
      if (currencies[i].countries.indexOf(countryCode) !== -1) return currencies[i];
    }
    return defaultCurrency;
  }

  function formatPrice(zarAmount, currency) {
    var converted = Math.round(zarAmount * currency.rate);
    if (currency.code === 'USD') return currency.symbol + converted;
    return currency.symbol + converted.toLocaleString();
  }

  window.applyCurrency = function(currency) {
    document.querySelectorAll('[data-price-zar]').forEach(function(el) {
      var zar = parseFloat(el.getAttribute('data-price-zar'));
      el.textContent = formatPrice(zar, currency);
    });
    var label = document.getElementById('currencyLabel');
    if (label) label.textContent = currency.symbol + ' ' + currency.code;
    localStorage.setItem('funda-currency', currency.code);
    window.__fundaCurrency = currency;
    // Update period text to reflect currency
    document.querySelectorAll('.pricing-amount small').forEach(function(s) {
      if (currency.code === 'ZAR') { s.textContent = s.textContent.replace(/\/[a-z]+/i, '/mo'); }
    });
  };

  window.cycleCurrency = function() {
    var current = window.__fundaCurrency || defaultCurrency;
    var idx = currencies.indexOf(current);
    var next = currencies[(idx + 1) % currencies.length];
    window.applyCurrency(next);
  };

  // Init
  function init() {
    var stored = localStorage.getItem('funda-currency');
    if (stored) {
      var c = currencies.find(function(c) { return c.code === stored; });
      if (c) { window.applyCurrency(c); return; }
    }
    fetch('https://ipapi.co/json/')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var currency = getCurrencyForCountry(data.country_code);
        window.applyCurrency(currency);
      })
      .catch(function() {
        window.applyCurrency(defaultCurrency);
      });
  }

  init();
})();
