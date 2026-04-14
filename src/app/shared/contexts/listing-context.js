import { createContext } from 'react';

const ListingContext = createContext({
  listing: {},
  setListing: () => {},
  setRwtPlansChange: () => {},
  setRwtResultsChange: () => {},
});
ListingContext.displayName = 'listing-information';

export default ListingContext;
