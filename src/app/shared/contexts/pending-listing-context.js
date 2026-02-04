import { createContext } from 'react';

const PendingListingContext = createContext({
  listing: {},
  setListing: () => {},
  uploaded: {},
  setUploaded: () => {},
});
PendingListingContext.displayName = 'pending-listing-information';

export default PendingListingContext;
