/* global ENABLE_LOGGING */

const eventTrack = ({
  aggregationName,
  category,
  event,
  group,
  label,
  organization,
}) => {
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
