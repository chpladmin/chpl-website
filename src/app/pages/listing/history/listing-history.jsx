import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
  useFetchDeveloperActivitiesMetadata,
  useFetchListingActivityMetadata,
} from 'api/activity';
import { ChplDialogTitle } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat, toTimestamp } from 'services/date-util';
import { UserContext } from 'shared/contexts';

function ChplListingHistory(props) {
  const DateUtil = getAngularService('DateUtil');
  const networkService = getAngularService('networkService');
  const { hasAnyRole } = useContext(UserContext);
  const [activity, setActivity] = useState([]);
  const [evaluated, setEvaluated] = useState([]);
  const [listing] = useState(props.listing); // eslint-disable-line  react/destructuring-assignment -- can't read directly from props otherwise the activity is refreshed repeatedly
  const [open, setOpen] = useState(false);

  /* listing activity */
  const [listingActivityIds, setListingActivityIds] = useState([]);
  const fetchListingActivities = useFetchActivities({
    ids: listingActivityIds,
    enabled: open,
  });
  const fetchListingActivityMetadata = useFetchListingActivityMetadata({
    id: listing.id,
    enabled: open,
  });

  useEffect(() => {
    fetchListingActivities.forEach((f) => {
      if (f.isLoading || f.isError || !f.data || evaluated.includes(f.data.id)) { return; }
      const interpreted = interpretActivity(f.data, hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']));
      if (interpreted.change.length > 0) {
        setActivity((prev) => [
          ...prev,
          interpreted,
        ]);
      }
      setEvaluated((prev) => [...prev, f.data.id]);
    });
  }, [fetchListingActivities]);

  useEffect(() => {
    if (fetchListingActivityMetadata.isLoading) { return; }
    if (fetchListingActivityMetadata.isError || !fetchListingActivityMetadata.data) { return; }
    setListingActivityIds(fetchListingActivityMetadata.data.map((a) => a.id));
  }, [fetchListingActivityMetadata.data, fetchListingActivityMetadata.isError, fetchListingActivityMetadata.isLoading]);

  /* developer activity */
  const [developers, setDevelopers] = useState([{ id: listing.developer.id, end: Date.now()}]);
  const [developerActivityIds, setDeveloperActivityIds] = useState([]);
  const [evaluatedDevelopers, setEvaluatedDevelopers] = useState([]);
  const fetchDeveloperActivities = useFetchActivities({
    ids: developerActivityIds,
    enabled: open,
  });
  const fetchDeveloperActivitiesMetadata = useFetchDeveloperActivitiesMetadata({
    developers: developers,
    enabled: open,
  });

  useEffect(() => {
    fetchDeveloperActivities.forEach((f) => {
      if (f.isLoading || f.isError || !f.data || evaluated.includes(f.data.id)) { return; }
      const { interpreted, merged, split } = interpretDeveloper(f.data);
      if (interpreted.change.length > 0) {
        setActivity((prev) => [
          ...prev,
          interpreted,
        ]);
      }
      setDevelopers((prev) => [
        ...prev,
        merged.map((d) => ({ id: d, end: Date.now })),
      ]);
      if (split?.id) {
        setDevelopers((prev) => [
          ...prev,
          { id: split.id, end: split.end },
        ]);
      }
      setEvaluated((prev) => [...prev, f.data.id]);
    });
  }, [fetchDeveloperActivities]);

  useEffect(() => {
    fetchDeveloperActivitiesMetadata.forEach((f) => {
      if (f.isLoading || f.isError || !f.data || evaluatedDevelopers.includes(f.data.id)) { return; }
      setDeveloperActivityIds((prev) => [
        ...prev,
        ...f.data.map((d) => d.id),
      ]);
      setEvaluatedDevelopers((prev) => [...prev, f.data.id]);
    });
  }, [fetchDeveloperActivitiesMetadata]);

  /* product activity */
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
            setActivity((prev) => [
              ...prev,
              interpreted,
            ]);
          }
          merged.forEach((next) => evaluateProductActivity(next));
          // TODO ownerChanges.forEach((owner) => evaluateDeveloperActivity(owner.developer.id, toTimestamp(owner.transferDay)));
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
            setActivity((prev) => [
              ...prev,
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
    setActivity((prev) => [
      ...prev,
      ...interpretCertificationStatusChanges(listing),
      ...interpretPIHistory(listing, DateUtil),
    ]);
    evaluateProductActivity(listing.product.id);
    evaluateVersionActivity(listing.version.id);
  }, [listing]);

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
      </Dialog>
    </>
  );
}

export default ChplListingHistory;

ChplListingHistory.propTypes = {
  listing: object.isRequired,
};
