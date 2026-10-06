import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogContent, Typography,
} from '@mui/material';
import {
  Timeline,
} from '@mui/lab';
import TrackChangesOutlined from '@mui/icons-material/TrackChangesOutlined';
import { func, object, string } from 'prop-types';

import ChplActivityDetails from './activity-details';

import { useFetchOrganizationActivityMetadata } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';

const styles = {
  legendTitle: {
    fontSize: '1.25em',
  },
};

function ChplOrganizationActivity({ organization, type, interpret }) {
  const { analytics } = useAnalyticsContext();
  const [activities, setActivities] = useState([]);
  const [resultSetSize, setResultSetSize] = useState(0);
  const [open, setOpen] = useState(false);

  const { data, isError, isLoading } = useFetchOrganizationActivityMetadata({
    organization,
    isEnabled: open,
    type,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setActivities([]);
      return;
    }
    setActivities(data
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((activity, idx, arr) => (
        <ChplActivityDetails
          key={activity.id}
          activity={activity}
          interpret={interpret}
          last={idx === arr.length - 1}
        />
      )));
    setResultSetSize(data.resultSetSize);
  }, [isError, isLoading, open]);

  const handleClickOpen = () => {
    eventTrack({
      ...analytics,
      event: 'Open Organization History',
      label: organization.name,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title="Organization History">
        <Button
          id="view-history"
          aria-label="Open History"
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<TrackChangesOutlined />}
          size="small"
          style={{ fontSize: 'small' }}
        >
          History
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="view-history"
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id="history-title"
          onClose={handleClose}
          sx={styles.legendTitle}
        >
          Organization History
        </ChplDialogTitle>
        <DialogContent dividers>
          <Timeline>
            { activities.map((activity) => activity) }
          </Timeline>
          { resultSetSize > 50 && (
            <Typography>
              and
              {' '}
              {resultSetSize - 50}
              {' '}
              more...
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplOrganizationActivity;

ChplOrganizationActivity.propTypes = {
  organization: object.isRequired,
  type: string.isRequired,
  interpret: func.isRequired,
};
