import { createContext } from 'react';

const CompareContext = createContext({
  addListing: () => {},
  highlightNav: false,
  isInWidget: () => false,
  listings: [],
  removeListing: () => {},
  setIsOpenFromNav: () => {},
});
CompareContext.displayName = 'compare-widget';

export default CompareContext;
