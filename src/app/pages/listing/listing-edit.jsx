import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import { eventTrack } from 'services/analytics.service';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ChplListingEdit({ listing: initialListing }) {
  const { analytics } = useAnalyticsContext();
  const [listing, setListing] = useState(undefined);
  const [isEditing, setIsEditing] = useState(true);
  const classes = useStyles();
  let analyticsData;

  useEffect(() => {
    if (!initialListing) { return; }
    setListing(initialListing);
  }, [initialListing]);

  if (!listing) {
    return <CircularProgress />;
  }

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
    eventTrack({
      ...analyticsData.analytics,
      event: 'Toggle Edit Mode',
    });
  };

  analyticsData = {
    analytics: {
      ...analytics,
      category: 'Edit Listing',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
        >
          {listing.product.name}
        </Typography>
      </Container>
      <Container maxWidth="lg">
        <Box className={classes.container} id="main-content" tabIndex="-1">
          <FormControlLabel
            control={(
              <Switch
                id="is-editing"
                name="isEditing"
                checked={isEditing}
                color="primary"
                onChange={toggleIsEditing}
              />
            )}
            label={isEditing ? 'Edit basic Listing information' : 'Upload detailed Listing information'}
          />
          { isEditing ? (
            <>
              <Typography>Insert edit component here</Typography>
              <ChplListingInformation
                listing={listing}
              />
            </>
          ) : (
            <Typography>Insert upload component here</Typography>
          )}
        </Box>
      </Container>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
  listing: listingPropType.isRequired,
};
