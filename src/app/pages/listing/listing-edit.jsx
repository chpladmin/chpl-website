import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';

import { useFetchListing } from 'api/listing';
import ChplListingEdit from 'components/listing/listing-edit';
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
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
});

function ChplListingEditPage({ id }) {
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const [listing, setListing] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  const listingState = {
    listing,
    setListing,
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
      <Container maxWidth="lg">
        <div className={classes.container} id="main-content" tabIndex="-1">
          <ListingContext.Provider value={listingState}>
            <ChplListingEdit
              listing={listing}
            />
          </ListingContext.Provider>
        </div>
      </Container>
    </Box>
  );
}

export default ChplListingEditPage;

ChplListingEditPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
