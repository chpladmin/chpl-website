import React, { useContext } from 'react';
import {
  Card, CardContent, CardHeader, CircularProgress, Container,
} from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

import ChplListingView from 'components/listing/listing-view';
import { ListingContext, PendingListingContext } from 'shared/contexts';

const styles = {
  confirmContainer: {
    padding: '32px 0',
  },
};

function ChplConfirmListing() {
  const { listing } = useContext(PendingListingContext);

  if (!listing) { return <CircularProgress />; }

  const listingState = {
    listing,
  };

  return (
    <Container maxWidth="md" sx={styles.confirmContainer}>
      <Card>
        <CardHeader
          title="Listing"
          subheader={listing.chplProductNumber}
        />
        <CardContent>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <ListingContext.Provider value={listingState}>
              <ChplListingView
                listing={listing}
                isConfirming
              />
            </ListingContext.Provider>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplConfirmListing;

ChplConfirmListing.propTypes = {
};
