// Adds the DOM matchers (toBeInTheDocument, toHaveTextContent, ...)
import '@testing-library/jest-dom';

// jsdom has no IntersectionObserver; the sticky ChplFilterSearchBar needs one to mount
global.IntersectionObserver = function IntersectionObserver() {
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  };
};
