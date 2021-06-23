import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func,
} from 'prop-types';

import theme from '../../../themes/theme';
import { complaint as complaintPropType } from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 5fr',
  },
}));

function ChplComplaintEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaint, setComplaint] = useState({});
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setComplaint(props.complaint);
  }, [props.complaint]);

  const handleAction = (action) => {
    props.dispatch(action);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.container}>
        <Typography>
          Editing here
        </Typography>
        <Typography>
          ONC-ACB:
        </Typography>
        <Typography>
          {complaint.certificationBody?.name}
        </Typography>
        <Typography>
          Received Date:
        </Typography>
        <Typography>
          {complaint.receivedDate}
        </Typography>
        <Typography>
          Closed Date:
        </Typography>
        <Typography>
          {complaint.closedDate}
        </Typography>
        <Typography>
          ONC-ACB Complaint ID:
        </Typography>
        <Typography>
          {complaint.acbComplaintId}
        </Typography>
        <Typography>
          ONC Complaint ID:
        </Typography>
        <Typography>
          {complaint.oncComplaintId}
        </Typography>
        <Typography>
          Complainant Type:
        </Typography>
        <Typography>
          {complaint.complainantType?.name}
        </Typography>
        <Typography>
          Complainant Type (Other):
        </Typography>
        <Typography>
          {complaint.complainantTypeOther}
        </Typography>
        <Typography>
          Complaint Summary:
        </Typography>
        <Typography>
          {complaint.summary}
        </Typography>
        <Typography>
          Associated Criteria:
        </Typography>
        {complaint.criteria?.length > 0
          ? (
            <ul>
              {complaint.criteria.map((criterion) => <li key={criterion.id}>{ criterion.certificationCriterion?.number}</li>)}
            </ul>
)
          : (
            <Typography>
              None
            </Typography>
)}
        <Typography>
          Actions/Responses:
        </Typography>
        <Typography>
          {complaint.actions}
        </Typography>
        <Typography>
          Associated Certified Products:
        </Typography>
        {complaint.listings?.length > 0
          ? (
            <ul>
              {complaint.listings.map((listing) => <li key={listing.id}>{ listing.chplProductNumber }</li>)}
            </ul>
)
          : (
            <Typography>
              None
            </Typography>
)}
        <Typography>
          Associated Surveillance Activities:
        </Typography>
        {complaint.surveillances?.length > 0
          ? (
            <ul>
              {complaint.surveillances.map((surveillance) => <li key={surveillance.id}>{ surveillance.friendlyId }</li>)}
            </ul>
)
          : (
            <Typography>
              None
            </Typography>
)}
        <Typography>
          Complainant Contacted:
        </Typography>
        <Typography>
          {complaint.complainantContacted ? 'Yes' : 'No'}
        </Typography>
        <Typography>
          Developer Contacted:
        </Typography>
        <Typography>
          {complaint.developerContacted ? 'Yes' : 'No'}
        </Typography>
        <Typography>
          ONC-ATL Contacted:
        </Typography>
        <Typography>
          {complaint.oncAtlContacted ? 'Yes' : 'No'}
        </Typography>
        <Typography>
          Informed ONC per &sect;170.523(s):
        </Typography>
        <Typography>
          {complaint.flagForOncReview ? 'Yes' : 'No'}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleAction('close')}
        >
          Close
        </Button>
      </Paper>
    </ThemeProvider>
  );
}

export default ChplComplaintEdit;

ChplComplaintEdit.propTypes = {
  complaint: complaintPropType.isRequired,
  dispatch: func.isRequired,
};
