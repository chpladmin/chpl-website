import React, { useContext } from 'react';
import {
  Box,
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
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  pageBackground: {
    flexGrow: 1,
    backgroundColor: palette.backgroundPage,
    backgroundImage: `radial-gradient(${'#d6d4cf'} 0.5px, transparent 0.25px)`,
    backgroundSize: '18px 18px',
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8),
    },
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
    <Box className={classes.pageBackground}>
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
    </Box>
  );
}

export default ChplConfirmListing;

ChplConfirmListing.propTypes = {
};
