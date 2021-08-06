import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func,
} from 'prop-types';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';
import { complaint as complaintPropType } from '../../../shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 2fr',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1.5fr 2fr 2fr 1fr',
    },
  },
  dataContent: {
    display: 'grid',
    gap: '4px',
    marginTop: '16px',
  },
  iconSpacing: {
    marginLeft: '4px',
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
  const { hasAnyRole } = getAngularService('authService');
  const DateUtil = getAngularService('DateUtil');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const handleAction = (action) => {
    props.dispatch(action);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader
          title="Complaint"
          subheader={complaint.acbComplaintId}
        />
        <CardContent>
          <Typography variant="h5">
            ONC-ACB:
            {' '}
            {complaint.certificationBody.name}
          </Typography>
          <div className={classes.content}>
            <div className={classes.dataContent}>
              <Typography variant="subtitle1">General Info</Typography>
              <Typography variant="subtitle2">
                Received Date:
              </Typography>
              <Typography>
                {DateUtil.getDisplayDateFormat(complaint.receivedDate)}
              </Typography>
              <Typography variant="subtitle2">
                Closed Date:
              </Typography>
              <Typography>
                {DateUtil.getDisplayDateFormat(complaint.closedDate)}
              </Typography>
              <Typography variant="subtitle2">
                ONC-ACB Complaint ID:
              </Typography>
              <Typography>
                {complaint.acbComplaintId}
              </Typography>
              <Typography variant="subtitle2">
                ONC Complaint ID:
              </Typography>
              <Typography>
                {complaint.oncComplaintId}
              </Typography>
              <Typography variant="subtitle2">
                Complainant Type:
              </Typography>
              <Typography>
                {complaint.complainantType?.name}
              </Typography>
              {complaint.complainantType?.name === 'Other - [Please Describe]'
               && (
                 <>
                   <Typography variant="subtitle2">
                     Complainant Type (Other):
                   </Typography>
                   <Typography>
                     {complaint.complainantTypeOther}
                   </Typography>
                 </>
               )}
            </div>
            <div className={classes.dataContent}>
              <Typography variant="subtitle1">Summary and Actions</Typography>
              <Typography variant="subtitle2">
                Complaint Summary:
              </Typography>
              <Typography>
                {complaint.summary}
              </Typography>
              <Typography variant="subtitle2">
                Actions/Responses:
              </Typography>
              <Typography>
                {complaint.actions}
              </Typography>
            </div>
            <div className={classes.dataContent}>
              <Typography variant="subtitle1">Review Info</Typography>
              <Typography variant="subtitle2">
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
              <Typography variant="subtitle2">
                Associated Listings:
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
              <Typography variant="subtitle2">
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
            </div>
            <div className={classes.dataContent}>
              <Typography variant="subtitle1">Parties Contacted</Typography>
              <Typography variant="subtitle2">
                Complainant Contacted:
              </Typography>
              <Typography>
                {complaint.complainantContacted ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="subtitle2">
                Developer Contacted:
              </Typography>
              <Typography>
                {complaint.developerContacted ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="subtitle2">
                ONC-ATL Contacted:
              </Typography>
              <Typography>
                {complaint.oncAtlContacted ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="subtitle2">
                Informed ONC per &sect;170.523(s):
              </Typography>
              <Typography>
                {complaint.flagForOncReview ? 'Yes' : 'No'}
              </Typography>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleAction('close')}
          >
            Back to Complaints
            {' '}
            <ArrowBackIcon className={classes.iconSpacing} />
          </Button>
          { hasAnyRole(['ROLE_ADMIN', 'ROLE_ACB'])
            && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => handleAction('edit')}
              >
                Edit
                {' '}
                <EditOutlinedIcon className={classes.iconSpacing} />
              </Button>
            )}
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
