import { createContext } from 'react';

const BrowserContext = createContext({
  addToCompared: () => {},
  addToViewed: () => {},
  getPreviouslyCompared: () => {},
  getPreviouslyViewed: () => {},
});
BrowserContext.displayName = 'browser-context';

export default BrowserContext;
