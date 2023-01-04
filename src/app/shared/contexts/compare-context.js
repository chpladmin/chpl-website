import { createContext } from 'react';

const CompareContext = createContext({
  addListing: () => {},
  isInWidget: () => false,
  removeListing: () => {},
});
CompareContext.displayName = 'compare-widget';

export default CompareContext;
