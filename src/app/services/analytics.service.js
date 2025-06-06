/* global ENABLE_LOGGING */

const eventTrack = ({
  aggregationName,
  category,
  event,
  group,
  label,
  organization,
}) => {
  // Push to GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      aggregationName,
      event_category: category,
      group,
      event_label: label,
      organization,
      debug_mode:'true',
    });
  }

  // Push to GA4 directly
  if (typeof window.gtag === 'function') {
    if (ENABLE_LOGGING) {
      console.info({
        aggregationName,
        category,
        event,
        group,
        label,
        organization,
      });
    } else {
      window.gtag('event', event, {
        aggregationName,
        event_category: category,
        group,
        event_label: label,
        organization,
      });
    }
  }
};

export { eventTrack }; // eslint-disable-line import/prefer-default-export
