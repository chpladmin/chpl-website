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

import {
  interpretActivity,
  interpretCertificationStatusChanges,
  interpretPIHistory,
  interpretDeveloper,
  interpretProduct,
  interpretVersion,
} from './history.service';
import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper.jsx';
import { ChplDialogTitle } from '../../../components/util';

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
  const flags = {
    promotingInteroperabilityIsOn: props.promotingInteroperabilityIsOn,
  };
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
  const evaluateDeveloperActivity = (developerId, end = Date.now()) => {
    if (!interpretedDevelopers.has(developerId)) {
      networkService.getSingleDeveloperActivityMetadata(developerId, { end }).then((metadata) => {
        interpretedDevelopers.add(developerId);
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
  const evaluateProductActivity = (productId, end = Date.now()) => {
    if (!interpretedProducts.has(productId)) {
      networkService.getSingleProductActivityMetadata(productId, { end }).then((metadata) => {
        interpretedProducts.add(productId);
        metadata.forEach((item) => networkService.getActivityById(item.id).then((response) => {
          const { interpreted, merged, split } = interpretProduct(response);
          if (interpreted.change.length > 0) {
            setActivity((activity) => [
              ...activity,
              interpreted,
            ]);
          }
          merged.forEach((next) => evaluateProductActivity(next));
          if (split?.id) {
            evaluateProductActivity(split.id, split.end);
          }
        }));
      });
    }
  };

  const interpretedVersions = new Set();
  const evaluateVersionActivity = (versionId, end = Date.now()) => {
    if (!interpretedVersions.has(versionId)) {
      networkService.getSingleVersionActivityMetadata(versionId, { end }).then((metadata) => {
        interpretedVersions.add(versionId);
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
      ...interpretPIHistory(listing, DateUtil, flags.promotingInteroperabilityIsOn),
    ]);
    evaluateListingActivity();
    evaluateDeveloperActivity(listing.developer.developerId);
    evaluateProductActivity(listing.product.productId);
    evaluateVersionActivity(listing.version.versionId);
  }, [listing]);

  const goToApi = () => {
    $analytics.eventTrack('Go To API Page', { category: 'Listing Details', label: listing.chplProductNumber });
    setOpen(false);
    $state.go('resources.chpl-api');
  };

  const goToHistory = () => {
    setOpen(false);
    $state.go('reports.listings', {
      productId: listing.id,
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
      <Button
        id="view-listing-history"
        aria-label="Open Listing History dialog"
        color="primary"
        variant="outlined"
        onClick={handleClickOpen}
      >
        <i className="fa fa-eye" />
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
              /activity/certified_products/
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
  promotingInteroperabilityIsOn: bool,
};

ChplListingHistory.defaultProps = {
  canSeeHistory: false,
  promotingInteroperabilityIsOn: false,
};
