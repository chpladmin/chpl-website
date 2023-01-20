import { createContext } from 'react';

const CmsContext = createContext({
  addListing: () => {},
  isInWidget: () => false,
  listings: [],
  removeListing: () => {},
});
CmsContext.displayName = 'cms-widget';

export default CmsContext;
