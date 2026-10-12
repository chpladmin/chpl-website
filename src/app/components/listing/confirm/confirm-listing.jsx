import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { ErrorBoundary } from 'react-error-boundary';

import ChplListingView from 'components/listing/listing-view';
import { ListingContext, PendingListingContext } from 'shared/contexts';

const useStyles = makeStyles({
  confirmContainer: {
    padding: '32px 0',
  },
});

function ChplConfirmListing() {
  const { listing } = useContext(PendingListingContext);
  const classes = useStyles();

  if (!listing) { return <CircularProgress />; }

  const listingState = {
    listing,
  };

  return (
    <Container maxWidth="md" className={classes.confirmContainer}>
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
