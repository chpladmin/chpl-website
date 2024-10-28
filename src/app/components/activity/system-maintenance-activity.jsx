import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import {
  Timeline,
} from '@material-ui/lab';
import TrackChangesOutlined from '@material-ui/icons/TrackChangesOutlined';
import { func, string } from 'prop-types';

import ChplSystemMaintenanceActivityDetails from './system-maintenance-activity-details';

import { ChplDialogTitle, ChplTooltip } from 'components/util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

function ChplSystemMaintenanceActivity({ fetch, title }) {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = fetch({
    isEnabled: open,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setActivities([]);
      return;
    }
    setActivities(data.activities.map((activity, idx, arr) => (
      <ChplSystemMaintenanceActivityDetails
        key={activity.id}
        activity={activity}
        last={idx === arr.length - 1}
      />
    )));
  }, [isError, isLoading]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title={`${title} Activity`}>
        <Button
          id="view-system-maintenance-activity"
          aria-label={`Open ${title} Activity dialog`}
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<TrackChangesOutlined />}
          style={{ marginRight: '8px' }}
        >
          History
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="view-system-maintenance-activity"
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id="system-maintenance-activity-title"
          onClose={handleClose}
          className={classes.legendTitle}
        >
          { title }
          {' '}
          Activity
        </ChplDialogTitle>
        <DialogContent dividers>
          <Timeline>
            { activities.map((activity) => activity) }
          </Timeline>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplSystemMaintenanceActivity;

ChplSystemMaintenanceActivity.propTypes = {
  fetch: func.isRequired,
  title: string.isRequired,
};
