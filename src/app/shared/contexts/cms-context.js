import { createContext } from 'react';

const CmsContext = createContext({
  addListing: () => {},
  canDisplayButton: () => false,
  highlightNav: false,
  isInWidget: () => false,
  isOpen: false,
  listings: [],
  removeListing: () => {},
  setIsOpen: () => {},
  setIsOpenFromNav: () => {},
});
CmsContext.displayName = 'cms-widget';

export default CmsContext;
