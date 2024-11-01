import React, { useContext, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  makeStyles,
  CardHeader,
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

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
  optionMenu: {
    alignItems: 'center',
    borderRadius: '0 0 8px 8px',
    border: `1px solid ${palette.grey}`,
    boxShadow: 'rgb(149 157 165 / 40%) 0px 6px 16px 6px',
    backgroundColor: '#fff',
  },
  reasonForChange: {
    marginTop: '32px',
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
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const anchorRef = useRef(null);
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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setIsEditing(index === 0);
    setOpen(false);
    eventTrack({
      ...analyticsData.analytics,
      event: 'Toggle Edit Mode',
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
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

  const options = ['Edit Minimal Listing Information', 'Upload Detailed Listing Information'];

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Box bgcolor="white" py={8}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" flexDirection="row">
            <Typography variant="h1">
              {listing.product.name}
            </Typography>
            <Button
              aria-controls={open ? 'menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="Select edit strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
              variant="outlined"
              color="primary"
              ref={anchorRef}
              endIcon={<ArrowDropDown />}
            >
              {options[selectedIndex]}
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'ricenterop' : 'ricenterottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList className={classes.optionMenu} id="menu" autoFocusItem>
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: palette.background }}>
        <Box py={8} className={classes.container} id="main-content" tabIndex="-1">
          {isEditing ? (
            <Container maxWidth="md">
              <ChplListingEdit
                dispatch={handleDispatch}
                errors={errors}
                warnings={warnings}
                isProcessing={isProcessing}
              />
              <Card className={classes.reasonForChange}>
                <CardHeader title="Reason For Change" />
                <CardContent>
                  <ChplTextField
                    id="reson-for-change"
                    name="reasonForChange"
                    label="Reason"
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
            </Container>
          ) : (
            <Container maxWidth="xl">
              <ChplListingEditUpload
                dispatch={handleDispatch}
                errors={errors}
                warnings={warnings}
                isProcessing={isProcessing}
              />
              <Card className={classes.reasonForChange}>
                <CardHeader title="Reason For Change" />
                <CardContent>
                  <ChplTextField
                    id="reson-for-change"
                    name="reasonForChange"
                    label="Reason"
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
            </Container>
          )}
        </Box>
      </Box>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingEditPage;

ChplListingEditPage.propTypes = {
};
