import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { object } from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretPIHistory,
  interpretDeveloper,
  interpretProduct,
  interpretVersion,
} from './history.service';

import {
  useFetchActivities,
  useFetchListingActivityMetadata,
} from 'api/activity';
import { ChplDialogTitle } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat, toTimestamp } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  listingHistoryActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    [theme.breakpoints.up('md')]: {
      flexFlow: 'row',
    },
  },
});

function ChplListingHistory(props) {
  const $analytics = getAngularService('$analytics');
  const $state = getAngularService('$state');
  const DateUtil = getAngularService('DateUtil');
  const networkService = getAngularService('networkService');
  const [activity, setActivity] = useState([])
  const [evaluated, setEvaluated] = useState([]);
  const [listing] = useState(props.listing); // eslint-disable-line  react/destructuring-assignment -- can't read directly from props otherwise the activity is refreshed repeatedly
  const [listingActivityIds, setListingActivityIds] = useState([]);
  const [open, setOpen] = useState(false);
  const fetchListingActivities = useFetchActivities({
    ids: listingActivityIds,
    enabled: open,
  });
  const fetchListingActivityMetadata = useFetchListingActivityMetadata({
    id: listing.id,
    enabled: open,
  });
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    fetchListingActivities.forEach((f) => {
      if (f.isLoading || f.isError || !f.data || evaluated.includes(f.data.id)) { return; }
      const interpreted = interpretActivity(f.data, hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']));
      if (interpreted.change.length > 0) {
        setActivity((activity) => [
          ...activity,
          interpreted,
        ]);
      }
      setEvaluated((prev) => [...prev, f.data.id]);
    });
  }, [fetchListingActivities]);

  useEffect(() => {
    if (fetchListingActivityMetadata.isLoading) { return; }
    if (fetchListingActivityMetadata.isError || !fetchListingActivityMetadata.data) { return; }
    setListingActivityIds(fetchListingActivityMetadata.data.map((activity) => activity.id));
  }, [fetchListingActivityMetadata.data, fetchListingActivityMetadata.isError, fetchListingActivityMetadata.isLoading]);

  /*
  const evaluateListingActivity = () => {
    networkService.getSingleListingActivityMetadata(listing.id).then((metadata) => {
      metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
        const interpreted = interpretActivity(response, hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']));
        if (interpreted.change.length > 0) {
          setActivity((activity) => [
            ...activity,
            interpreted,
          ]);
        }
      }));
    });
  };
*/
  const interpretedDevelopers = new Set();
  const evaluateDeveloperActivity = (id, end = Date.now()) => {
    if (!interpretedDevelopers.has(id)) {
      networkService.getSingleDeveloperActivityMetadata(id, { end }).then((metadata) => {
        interpretedDevelopers.add(id);
        metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
          const { interpreted, merged, split } = interpretDeveloper(response);
          if (interpreted.change.length > 0) {
            setActivity((activity) => [
              ...activity,
              interpreted,
            ]);
          }
          merged.forEach((next) => evaluateDeveloperActivity(next));
          if (split?.id) {
            evaluateDeveloperActivity(split.id, split.end);
          }
        }));
      });
    }
  };

  const interpretedProducts = new Set();
  const evaluateProductActivity = (id, end = Date.now()) => {
    if (!interpretedProducts.has(id)) {
      networkService.getSingleProductActivityMetadata(id, { end }).then((metadata) => {
        interpretedProducts.add(id);
        metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
          const {
            interpreted, merged, ownerChanges, split,
          } = interpretProduct(response);
          if (interpreted.change.length > 0) {
            setActivity((activity) => [
              ...activity,
              interpreted,
            ]);
          }
          merged.forEach((next) => evaluateProductActivity(next));
          ownerChanges.forEach((owner) => evaluateDeveloperActivity(owner.developer.id, toTimestamp(owner.transferDay)));
          if (split?.id) {
            evaluateProductActivity(split.id, split.end);
          }
        }));
      });
    }
  };

  const interpretedVersions = new Set();
  const evaluateVersionActivity = (id, end = Date.now()) => {
    if (!interpretedVersions.has(id)) {
      networkService.getSingleVersionActivityMetadata(id, { end }).then((metadata) => {
        interpretedVersions.add(id);
        metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
          const { interpreted, merged, split } = interpretVersion(response);
          if (interpreted.change.length > 0) {
            setActivity((activity) => [
              ...activity,
              interpreted,
            ]);
          }
          merged.forEach((next) => evaluateVersionActivity(next));
          if (split?.id) {
            evaluateVersionActivity(split.id, split.end);
          }
        }));
      });
    }
  };

  useEffect(() => {
    setActivity((activity) => [
      ...activity,
      ...interpretCertificationStatusChanges(listing),
      ...interpretPIHistory(listing, DateUtil),
    ]);
    //evaluateListingActivity();
    //evaluateDeveloperActivity(listing.developer.id);
    //evaluateProductActivity(listing.product.id);
    //evaluateVersionActivity(listing.version.id);
  }, [listing]);

  const goToApi = () => {
    $analytics.eventTrack('Go To API Page', { category: 'Listing Details', label: listing.chplProductNumber });
    setOpen(false);
    $state.go('resources.api');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        id="view-listing-history"
        aria-label="Open Listing History dialog"
        color="secondary"
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<VisibilityIcon />}
        size="small"
      >
        View Listing History
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="listing-history-title"
        open={open}
        fullWidth
        maxWidth="lg"
      >
        <ChplDialogTitle
          id="listing-history-title"
          onClose={handleClose}
        >
          Listing History
        </ChplDialogTitle>
        <DialogContent dividers>
          { activity.length > 0
            ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { activity
                      .sort((a, b) => b.activityDate - a.activityDate)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            { item.eventDay ? getDisplayDateFormat(item.eventDay) : DateUtil.timestampToString(item.activityDate) }
                          </TableCell>
                          <TableCell>
                            <ul className="list-unstyled">
                              { item.change.map((change, idx) => (
                                <li key={idx} dangerouslySetInnerHTML={{ __html: `${change}` }} />
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No changes have been made to this Listing</Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Box className={classes.listingHistoryActions}>
            <Typography gutterBottom>
              This module gives a basic overview of modifications made to the listing. For a more detailed history, please use the
              <code>
                /activity/metadata/listings/
                { listing.id }
              </code>
              {' '}
              API call described on the CHPL API page.
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              id="go-to-api"
              onClick={goToApi}
            >
              Go to API
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChplListingHistory;

ChplListingHistory.propTypes = {
  listing: object.isRequired,
};
