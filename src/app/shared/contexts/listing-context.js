import { createContext } from 'react';

const ListingContext = createContext({
  listing: {},
  setListing: () => {},
});
ListingContext.displayName = 'listing-information';

export default ListingContext;
