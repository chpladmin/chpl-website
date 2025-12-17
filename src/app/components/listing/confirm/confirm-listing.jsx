import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { ErrorBoundary } from 'react-error-boundary';
import { object } from 'prop-types';

import ChplListingView from 'components/listing/listing-view';
import { ListingContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplConfirmListing({ listing }) {
  const classes = useStyles();

  if (!listing) { return <CircularProgress />; }

  const listingState = {
    listing,
  };

  return (
    <Container maxWidth="lg">
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
  listing: object.isRequired,
};
