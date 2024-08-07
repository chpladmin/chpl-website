/* global ENABLE_LOGGING */

const eventTrack = ({
  event, category, label, group,
}) => {
  if (typeof window.gtag === 'function') {
    if (ENABLE_LOGGING) {
      console.info({
        action: 'tracking event', event, category, label, group,
      });
    } else {
      window.gtag('event', event, {
        event_category: category,
        event_label: label,
        group,
      });
    }
  }
};

export { eventTrack }; // eslint-disable-line import/prefer-default-export
