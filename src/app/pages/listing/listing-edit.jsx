import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
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
import ChplListingEditUpload from 'components/listing/listing-edit-upload';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { AnalyticsContext, ListingContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles, palette } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reasonForChangeText: {
    paddingTop: '16px',
    fontWeight: 'bold',
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
    let request;
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
        request = {
          ...payload,
          reason: reasonForChange,
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
            setErrors(error.response.data.errorMessages ?? []);
            setWarnings(error.response.data.warningMessages ?? []);
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
      <Box bgcolor="white" p={8}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" flexDirection="row">
            <Typography
              variant="h1"
            >
              {listing.product.name}
            </Typography>
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
          </Box>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: palette.background }}>
        <Container maxWidth="lg">
          <Box py={8} className={classes.container} id="main-content" tabIndex="-1">
            {isEditing ? (
              <ChplListingEdit
                dispatch={handleDispatch}
                errors={errors}
                warnings={warnings}
                isProcessing={isProcessing}
              />
            ) : (
              <ChplListingEditUpload
                dispatch={handleDispatch}
                errors={errors}
                warnings={warnings}
                isProcessing={isProcessing}
              />
            )}
            <Card>
              <CardContent>
                <ChplTextField
                  id="reson-for-change"
                  name="reasonForChange"
                  label="Reason For Change"
                  multiline
                  value={reasonForChange}
                  onChange={(event) => setReasonForChange(event.target.value)}
                />
                <Typography variant="body1" className={classes.reasonForChangeText}>If changes are made in any of the following ways, a Reason for Change is required:</Typography>
                <List disablePadding>
                  <ListItem>Clinical Quality Measure Removed</ListItem>
                  <ListItem>Certification Criteria Removed</ListItem>
                  <ListItem>Editing of a non-active Certified Product</ListItem>
                  <ListItem>Certification Status Changed from anything to &quot;Active&quot;</ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingEditPage;

ChplListingEditPage.propTypes = {
};
