import { createContext } from 'react';

const CmsContext = createContext({
  addListing: () => {},
  canDisplayButton: () => false,
  isInWidget: () => false,
  isOpen: false,
  listings: [],
  removeListing: () => {},
  setIsOpen: () => {},
});
CmsContext.displayName = 'cms-widget';

export default CmsContext;
