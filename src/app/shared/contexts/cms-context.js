import { createContext } from 'react';

const CmsContext = createContext({
  addListing: () => {},
  canDisplayButton: () => false,
  highlightNav: false,
  isInWidget: () => false,
  listings: [],
  removeListing: () => {},
  setIsOpenFromNav: () => {},
});
CmsContext.displayName = 'cms-widget';

export default CmsContext;
