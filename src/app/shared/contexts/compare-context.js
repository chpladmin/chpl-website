import { createContext } from 'react';

const CompareContext = createContext({
  addListing: () => {},
  highlightNav: false,
  isInWidget: () => false,
  isOpen: false,
  listings: [],
  removeListing: () => {},
  setIsOpen: () => {},
  setIsOpenFromNav: () => {},
});
CompareContext.displayName = 'compare-widget';

export default CompareContext;
