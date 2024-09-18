import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';

import ChplUploadListing from './components/upload-listing';

import { useFetchListing } from 'api/listing';
import ChplListingView from 'components/listing/listing-view';
import { ListingContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    backgroundColor: palette.background,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'start',
    },
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
});

function ChplListingEditUploadPage({ id }) {
  const [fetched, setFetched] = useState(false);
  const [listing, setListing] = useState(undefined);
  const [newListing, setNewListing] = useState(undefined);
  const { data, isLoading, isSuccess } = useFetchListing({ id, fetched });
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setFetched(true);
    setListing(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  const listingState = {
    listing,
  };

  const newListingState = {
    listing: newListing,
    setListing: setNewListing,
  };

  return (
    <Box bgcolor={palette.background}>
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
          >
            Edit
            {' '}
            {listing.product.name}
          </Typography>
        </Container>
      </div>
      <Container maxWidth="lg" id="main-content" tabIndex="-1">
        <div className={classes.container}>
          <div>
            <ListingContext.Provider value={newListingState}>
              <ChplUploadListing
                id={listing.id}
              />
            </ListingContext.Provider>
          </div>
          <Button
            variant="contained"
            color="primary"
            disabled
          >
            Confirm
          </Button>
          <div>
            Current Listing
            <ListingContext.Provider value={listingState}>
              <ChplListingView
                listing={listing}
              />
            </ListingContext.Provider>
          </div>
          <div>
            Updated Listing
            { newListing
              && (
                <ListingContext.Provider value={newListingState}>
                  <ChplListingView
                    listing={newListing}
                  />
                </ListingContext.Provider>
              )}
          </div>
        </div>
      </Container>
    </Box>
  );
}

export default ChplListingEditUploadPage;

ChplListingEditUploadPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
