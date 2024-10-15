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
import { compareOrganization } from './services/organizations.service';

import { useFetchOrganizationActivityMetadata } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
});

function ChplOrganizationActivity({ organization }) {
  const [activities, setActivities] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchOrganizationActivityMetadata({
    organization,
    isEnabled: open,
    type: 'acbs',
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
          interpret={compareOrganization}
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
          className={classes.legendTitle}
        >
          Organization History
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

export default ChplOrganizationActivity;

ChplOrganizationActivity.propTypes = {
  organization: object.isRequired,
};
