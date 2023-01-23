import { createContext } from 'react';

const CompareContext = createContext({
  addListing: () => {},
  isInWidget: () => false,
  listings: [],
  removeListing: () => {},
});
CompareContext.displayName = 'compare-widget';

export default CompareContext;
