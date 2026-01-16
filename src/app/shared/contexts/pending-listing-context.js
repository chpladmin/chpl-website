import { createContext } from 'react';

const PendingListingContext = createContext({
  pending: {},
  setPending: () => {},
  staged: {},
  setStaged: () => {},
});
PendingListingContext.displayName = 'pending-listing-information';

export default PendingListingContext;
