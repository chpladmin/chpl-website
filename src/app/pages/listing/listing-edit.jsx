import React, { useContext, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { usePutListing } from 'api/listing';
import ChplListingEdit from 'components/listing/listing-edit';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { AnalyticsContext, ListingContext, useAnalyticsContext } from 'shared/contexts';
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

function ChplListingEditPage() {
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { listing } = useContext(ListingContext);
  const { mutate } = usePutListing();
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasonForChange, setReasonForChange] = useState('');
  const classes = useStyles();
  let analyticsData;

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        eventTrack({
          ...analyticsData.analytics,
          event: 'Cancel editing',
        });
        $state.go('^');
        break;
      case 'save':
        eventTrack({
          ...analyticsData.analytics,
          event: 'Save changes',
        });
        setIsProcessing(true);
        setErrors([]);
        setWarnings([]);
        const request = {
          listing: payload,
          reason: reasonForChange,
          acknowledgeWarnings: false,
          acknowledgeBusinessErrors: false,
        };
        mutate(request, {
          onSuccess: (response) => {
            if (!response.status || response.status === 200) {
              $state.go('^');
            } else {
              setIsProcessing(false);
              setErrors([response.error]);
            }
          },
          onError: (error) => {
            setIsProcessing(false);
            setErrors(error.response.data.errorMessages);
            setWarnings(error.response.data.warningMessages);
          },
        });
        break;
        // no default
    }
  };

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
    eventTrack({
      ...analyticsData.analytics,
      event: 'Toggle Edit Mode',
    });
  };

  if (!listing) {
    return <CircularProgress />;
  }

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
          <ChplTextField
            id="reson-for-change"
            name="reasonForChange"
            label="Reason For Change"
            multiline
            value={reasonForChange}
            onChange={(event) => setReasonForChange(event.target.value)}
          />
          <Typography>If changes are made in any of the following ways, a Reason for Change is required:</Typography>
          <List>
            <ListItem>Clinical Quality Measure Removed</ListItem>
            <ListItem>Certification Criteria Removed</ListItem>
            <ListItem>Editing of a non-active Certified Product</ListItem>
            <ListItem>Certification Status Changed from anything to &quot;Active&quot;</ListItem>
          </List>
          { isEditing ? (
            <ChplListingEdit
              dispatch={handleDispatch}
              errors={errors}
              warnings={warnings}
              isProcessing={isProcessing}
            />
          ) : (
            <Typography>Insert upload component here</Typography>
          )}
        </Box>
      </Container>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingEditPage;

ChplListingEditPage.propTypes = {
};
