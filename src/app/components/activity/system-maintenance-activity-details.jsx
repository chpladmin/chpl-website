import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  makeStyles,
} from '@material-ui/core';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { bool, object } from 'prop-types';

import compareSystemMaintenance from './services/system-maintenance.service';

import { useFetchActivity } from 'api/activity';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
  buttonActivity: {
    marginTop: '8px',
  },
});

function ChplSystemMaintenanceActivityDetails({ activity, last }) {
  const [details, setDetails] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Define isDetailsOpen state
  const classes = useStyles();

  const handleButtonClick = () => {
    setIsDetailsOpen(!isDetailsOpen); // Toggle details visibility
  };

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
        { !last && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <span style={{ fontWeight: 'bold' }}>{activity.responsibleUser.fullName}</span>
        :
        {activity.description}
        <br />
        <Typography variant="body2">{ getDisplayDateFormat(activity.date) }</Typography>
        { activity.id && details?.length > 0
          && (
          <div>
            <Button
              className={classes.buttonActivity}
              variant="text"
              onClick={handleButtonClick}
              color="primary"
              endIcon={<ExpandMoreIcon color="primary" />}
            >
              <strong>Activity Details</strong>
            </Button>
            {isDetailsOpen && (
              <Box>
                <ul dangerouslySetInnerHTML={{ __html: details }} />
              </Box>
            )}
          </div>
          )}
      </TimelineContent>
    </TimelineItem>
  );
}

ChplSystemMaintenanceActivityDetails.propTypes = {
  activity: object.isRequired,
  last: bool.isRequired,
};

export default ChplSystemMaintenanceActivityDetails;
