import React, { useEffect, useState } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import { bool, object } from 'prop-types';

import compareSystemMaintenance from './services/system-maintenance.service';

import { useFetchActivity } from 'api/activity';
import { getDisplayDateFormat } from 'services/date-util';
import { palette } from 'themes';

const useStyles = makeStyles({
  dateText: {
    color: palette.greyDark,
  },
});

const getDescription = (activity) => {
  let verb;
  switch (activity.categories[0]) {
    case 'CREATE':
      verb = 'created';
      break;
    case 'DELETE':
      verb = 'deleted';
      break;
    case 'UPDATE':
      verb = 'updated';
      break;
      // no default
  }
  const action = (
    <>
      <span style={{ fontWeight: 'bold' }}>
        {activity.object.name}
      </span>
      {` was ${verb}`}
    </>
  );
  return action;
};

function ChplSystemMaintenanceActivityDetails({ activity, last }) {
  const [details, setDetails] = useState([]);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchActivity({
    id: activity.id,
    isEnabled: true,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setDetails([]);
      return;
    }
    setDetails(compareSystemMaintenance(data?.originalData, data?.newData)
      .map((item) => `<li>${item}</li>`)
      .join(''));
  }, [data, isError, isLoading]);

  if (!activity || !activity.id) {
    return null;
  }

  return (
    <TimelineItem key={activity.id}>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        { !last && <TimelineConnector /> }
      </TimelineSeparator>
      <TimelineContent>
        { getDescription(activity) }
        <Typography variant="body2" className={classes.dateText}>
          { getDisplayDateFormat(activity.date) }
          {` (${activity.responsibleUser.fullName})` }
        </Typography>
        { activity.id && details?.length > 0
          && (
            <ul dangerouslySetInnerHTML={{ __html: details }} />
          )}
      </TimelineContent>
    </TimelineItem>
  );
}

export default ChplSystemMaintenanceActivityDetails;

ChplSystemMaintenanceActivityDetails.propTypes = {
  activity: object.isRequired,
  last: bool.isRequired,
};
