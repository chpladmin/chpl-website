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
import { object } from 'prop-types';

import ChplActivityDetails from './activity-details';
import { compareDeveloper } from './services/developers.service';

import { useFetchDeveloperActivity } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

function ChplDeveloperActivity({ developer }) {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchDeveloperActivity({
    developer,
    isEnabled: open,
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
          interpret={compareDeveloper}
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
      <ChplTooltip title="Developer Activity">
        <Button
          id="view-developer-activity"
          aria-label="Open Developer Activity dialog"
          color="secondary"
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<TrackChangesOutlined />}
          style={{ marginRight: '8px' }}
        >
          Details
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="view-developer-activity"
        open={open}
        maxWidth="sm"
      >
        <ChplDialogTitle
          id="developer-title"
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Developer Activity
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

export default ChplDeveloperActivity;

ChplDeveloperActivity.propTypes = {
  developer: object.isRequired,
};
