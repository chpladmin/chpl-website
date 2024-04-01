import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { bool, object } from 'prop-types';

import { useFetchActivity } from 'api/activity';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
});

import compareFunctionalityTested from './services/functionality-tested.service';

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
    console.log('switch');
    let details;
    switch (activity.concept) {
      case 'FUNCTIONALITY_TESTED':
        /*
        setDetails(compareFunctionalityTested(data?.originalData, data?.newData)
          .map((item) => `<li>${item}</li>`)
          .join(''));
          */
        details = compareFunctionalityTested(data?.originalData, data?.newData);
        //console.log(details);
        details = details.map((item) => `<li>${item}</li>`);
        //console.log(details);
        details = details.join('');
        console.log(details);
        setDetails(details);
        break;
      default:
          console.info(data);
    }
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
        { activity.id && details?.length > 0
          && (
            <Accordion variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="subtitle2"
                >
                  Activity Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul dangerouslySetInnerHTML={{ __html: details }} />
              </AccordionDetails>
            </Accordion>
          )}
      </TimelineContent>
    </TimelineItem>
  );
}

export default ChplSystemMaintenanceActivityDetails;

ChplSystemMaintenanceActivityDetails.propTypes = {
  activity: object.isRequired,
  last: bool.isRequired
};
