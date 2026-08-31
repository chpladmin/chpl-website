import { createContext } from 'react';

const CompareContext = createContext({
  addListing: () => {},
  isInWidget: () => false,
  isOpen: false,
  listings: [],
  removeListing: () => {},
  setIsOpen: () => {},
});
CompareContext.displayName = 'compare-widget';

export default CompareContext;
