import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func,
} from 'prop-types';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';
import { complaint as complaintPropType } from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 5fr',
  },
}));

function ChplComplaintView(props) {
  /* eslint-disable react/destructuring-assignment */
  const [complaint] = useState({
    ...props.complaint,
    criteria: props.complaint.criteria
      .map((item) => (item.certificationCriterion))
      .sort(getAngularService('utilService').sortCertActual),
    listings: props.complaint.listings
      .sort(((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1))),
    surveillances: props.complaint.surveillances
      .map((item) => (item.surveillance))
      .sort((a, b) => {
        if (a.chplProductNumber < b.chplProductNumber) { return -1; }
        if (a.chplProductNumber > b.chplProductNumber) { return 1; }
        return a.friendlyId < b.friendlyId ? -1 : 1;
      }),
  });
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const handleAction = (action) => {
    props.dispatch(action);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardContent className={classes.container}>
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
                {complaint.criteria.map((criterion) => <li key={criterion.id}>{`${criterion.removed ? 'Removed |' : ''} ${criterion.number}: ${criterion.title}`}</li>)}
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
                {complaint.surveillances.map((surveillance) => <li key={surveillance.id}>{`${surveillance.chplProductNumber}: ${surveillance.friendlyId}`}</li>)}
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
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleAction('close')}
          >
            Close
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default ChplComplaintView;

ChplComplaintView.propTypes = {
  complaint: complaintPropType.isRequired,
  dispatch: func.isRequired,
};
