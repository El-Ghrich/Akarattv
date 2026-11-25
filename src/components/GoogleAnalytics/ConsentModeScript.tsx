import Script from 'next/script'

/**
 * Advanced Consent Mode v2 must be in place *before* GTM starts, otherwise
 * Google tags read the default consent state as "granted" and write cookies.
 * `beforeInteractive` is injected into <head> on the server, ahead of the GTM
 * tag that the consent-gated client wrapper mounts after hydration.
 *
 * Ads are never used on this site, so every ad consent type stays denied and
 * `ads_data_redaction` redacts click identifiers. URL passthrough is
 * deliberately not enabled: there are no Google Ads campaigns and appending
 * tracking parameters to internal links is not needed to measure visits.
 */
const consentModeScript = `
(function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['consent', 'default', {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'denied'
  }]);
  window.dataLayer.push(['set', 'ads_data_redaction', true]);

  // A returning visitor already has a cookie; send the granted state before
  // GTM loads so their first page view is measured normally.
  var parts = document.cookie.split(';');
  for (var i = 0; i < parts.length; i += 1) {
    var part = parts[i].trim();
    if (part.indexOf('akarat-consent=') === 0) {
      if (decodeURIComponent(part.slice('akarat-consent='.length)) === 'granted') {
        window.dataLayer.push(['consent', 'update', {
          ad_personalization: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          analytics_storage: 'granted'
        }]);
      }
      break;
    }
  }
})();
`

export function ConsentModeScript() {
  return (
    <Script
      dangerouslySetInnerHTML={{ __html: consentModeScript }}
      id="gtm-consent-mode-default"
      strategy="beforeInteractive"
    />
  )
}

export default ConsentModeScript
