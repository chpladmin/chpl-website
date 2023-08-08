import { createContext } from 'react';

const ListingContext = createContext({
  listing: {},
  setListing: () => {},
});
ListingContext.displayName = 'listing';

export default ListingContext;
