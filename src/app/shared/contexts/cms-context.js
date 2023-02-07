import { createContext } from 'react';

const CmsContext = createContext({
  addListing: () => {},
  canDisplayButton: () => false,
  cannotGenerate15EIsOn: false,
  isInWidget: () => false,
  listings: [],
  removeListing: () => {},
});
CmsContext.displayName = 'cms-widget';

export default CmsContext;
