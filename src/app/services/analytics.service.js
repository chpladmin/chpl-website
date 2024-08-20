/* global ENABLE_LOGGING */

const eventTrack = ({
  event, category, label, aggregationName, group,
}) => {
  if (typeof window.gtag === 'function') {
    if (ENABLE_LOGGING) {
      console.info({
        event, category, label, aggregationName, group,
      });
    } else {
      window.gtag('event', event, {
        event_category: category,
        event_label: label,
        aggregationName,
        group,
      });
    }
  }
};

export { eventTrack }; // eslint-disable-line import/prefer-default-export
