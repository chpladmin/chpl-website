import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import InfoIcon from '@material-ui/icons/Info';

import { useFetchSvapsActivity } from 'api/activity';
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

function ChplSvapsActivity() {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchSvapsActivity({
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
      <ChplTooltip title="Svaps Activity">
        <Button
          id="view-svaps-activity"
          aria-label="Open Svaps Activity dialog"
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
        aria-labelledby="view-svaps-activity"
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id="svaps-activity-title"
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Svaps Activity
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

export default ChplSvapsActivity;

ChplSvapsActivity.propTypes = {
};
