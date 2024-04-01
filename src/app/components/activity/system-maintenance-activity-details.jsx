import React, { useEffect, useState } from 'react';
import {
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
import { bool, object } from 'prop-types';

import { useFetchActivity } from 'api/activity';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
});

function ChplSystemMaintenanceActivityDetails({ activity, last }) {
  const [details, setDetails] = useState({});
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchActivity({
    id: activity.id,
    isEnabled: true,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setDetails({});
      return;
    }
    console.log(data);
  }, [data, isError, isLoading]);

  if (!activity) {
    return null;
  }

  return (
    <TimelineItem key={activity.id}>
      <TimelineSeparator>
        <TimelineDot />
        { !last
          && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        { `${activity.responsibleUser.fullName}: ${activity.description}` }
        { getDisplayDateFormat(activity.date) }
      </TimelineContent>
    </TimelineItem>
  );
}

export default ChplSystemMaintenanceActivityDetails;

ChplSystemMaintenanceActivityDetails.propTypes = {
  activity: object.isRequired,
  last: bool.isRequired
};
