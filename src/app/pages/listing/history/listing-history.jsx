import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
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
import { bool, object } from 'prop-types';

import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { toTimestamp } from 'services/date-util';
import theme from 'themes/theme';

import {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretPIHistory,
  interpretDeveloper,
  interpretProduct,
  interpretVersion,
} from './history.service';

const useStyles = makeStyles(() => ({
  noWrap: {
    whiteSpace: 'nowrap',
  },
}));

function ChplListingHistory(props) {
  /* eslint-disable react/destructuring-assignment */
  const [activity, setActivity] = useState([]);
  const [canSeeHistory] = useState(props.canSeeHistory);
  const [listing] = useState(props.listing);
  const [open, setOpen] = React.useState(false);
  const $analytics = getAngularService('$analytics');
  const $state = getAngularService('$state');
  const DateUtil = getAngularService('DateUtil');
  const ReportService = getAngularService('ReportService');
  const networkService = getAngularService('networkService');
  const utilService = getAngularService('utilService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const evaluateListingActivity = () => {
    networkService.getSingleListingActivityMetadata(listing.id).then((metadata) => {
      metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
        const interpreted = interpretActivity(response, utilService, ReportService);
        if (interpreted.change.length > 0) {
          setActivity((activity) => [
            ...activity,
            interpreted,
          ]);
        }
      }));
    });
  };

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
          const { interpreted, merged, ownerChanges, split } = interpretProduct(response);
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
    evaluateListingActivity();
    evaluateDeveloperActivity(listing.developer.id);
    evaluateProductActivity(listing.product.id);
    evaluateVersionActivity(listing.version.id);
  }, [listing]);

  const goToApi = () => {
    $analytics.eventTrack('Go To API Page', { category: 'Listing Details', label: listing.chplProductNumber });
    setOpen(false);
    $state.go('resources.api');
  };

  const goToHistory = () => {
    setOpen(false);
    $state.go('reports.listings', {
      listingId: listing.id,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <ChplTooltip title="View Listing History">
        <Button
          id="view-listing-history"
          aria-label="Open Listing History dialog"
          color="primary"
          variant="outlined"
          onClick={handleClickOpen}
        >
          <i className="fa fa-eye" />
        </Button>
      </ChplTooltip>
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
                            { DateUtil.timestampToString(item.activityDate) }
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
          <Typography>
            This module gives a basic overview of modifications made to the listing. For a more detailed history, please use the
            <code>
              /activity/metadata/listings/
              { listing.id }
            </code>
            {' '}
            API call described on the CHPL API page.
          </Typography>
          <ButtonGroup
            className={classes.noWrap}
            color="primary"
            variant="outlined"
          >
            <Button
              id="go-to-api"
              onClick={goToApi}
            >
              Go to API
            </Button>
            { canSeeHistory
              && (
                <Button
                  id="see-full-history"
                  onClick={goToHistory}
                >
                  Go to Full History
                </Button>
              )}
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ChplListingHistory;

ChplListingHistory.propTypes = {
  canSeeHistory: bool,
  listing: object.isRequired,
};

ChplListingHistory.defaultProps = {
  canSeeHistory: false,
};
