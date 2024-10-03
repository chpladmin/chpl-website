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
import { bool, func, object } from 'prop-types';

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
  if (activity.categories.includes('CREATE')) {
    verb = 'created';
  } else if (activity.categories.includes('DELETE')) {
    verb = 'deleted';
  } else if (activity.categories.includes('UPDATE')) {
    verb = 'updated';
  } else {
    verb = 'unknown';
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

function ChplActivityDetails({ activity, interpret, last }) {
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
    if (data.originalData && data.newData) {
      setDetails(interpret(data?.originalData, data?.newData)
        .map((item) => `<li>${item}</li>`)
        .join(''));
    }
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

export default ChplActivityDetails;

ChplActivityDetails.propTypes = {
  activity: object.isRequired,
  interpret: func.isRequired,
  last: bool.isRequired,
};
