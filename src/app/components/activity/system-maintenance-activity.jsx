import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import InfoIcon from '@material-ui/icons/Info';
import { func, string } from 'prop-types';

import { useFetchActivity } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

const getDisplay = ({
  date, description, id, responsibleUser,
}, last = false) => {
  if (!description) { return null; }
  return (
    <TimelineItem key={id}>
      <TimelineSeparator>
        <TimelineDot />
        { !last
          && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        { `${responsibleUser.fullName}: ${description}` }
        { getDisplayDateFormat(date) }
      </TimelineContent>
    </TimelineItem>
  );
};

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
    setActivities(data.activities.map((activity, idx, arr) => getDisplay(activity, idx === arr.length - 1)));
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
          endIcon={<InfoIcon />}
        >
          Details
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
  title: string.isRequired
};
