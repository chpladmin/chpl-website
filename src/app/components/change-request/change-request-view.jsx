import React from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import Moment from 'react-moment';

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';
import { ChplAvatar } from '../util';

import ChplChangeRequestHistory from './change-request-history';
import ChplChangeRequestAttestationView from './types/attestation-view';
import ChplChangeRequestDetailsView from './types/details-view';
import ChplChangeRequestWebsiteView from './types/website-view';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  productCard: {
    paddingBottom: '8px',
  },
  productCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 11fr',
    padding: '16px',
    gap: '16px',
    alignItems: 'center',
  },
  subProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  versionProductCardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gap: '8px',
    alignItems: 'center',
  },
  widgetProductContainer: {
    alignContent: 'space-between',
    display: 'grid',
    gap: '8px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    gap: '8px',
  },
  subContent: {
    display: 'grid',
    gap: '8px',
  },
  developerAvatar: {
    color: '#156dac',
    backgroundColor: '#f5f9fd',
  },
  activeStatus: {
    color: '#66926d',
    marginLeft: '4px',
  },
  cardContentContainer:{
    padding:'16px 32px 32px 70px',
  },
  cardContentChangeRequest:{
    gridTemplateColumns: '1fr auto',
    display: 'grid',
    gap: '8px',
  },
  cardHeader:{
    fontWeight:'600',
  },
});

const getChangeRequestDetails = (cr) => {
  switch (cr.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return (
        <ChplChangeRequestAttestationView
          changeRequest={cr}
        />
      );
    case 'Developer Details Change Request':
      return (
        <ChplChangeRequestDetailsView
          changeRequest={cr}
        />
      );
    case 'Website Change Request':
      return (
        <ChplChangeRequestWebsiteView
          changeRequest={cr}
        />
      );
    default:
      return (
        <>
          No details found
        </>
      );
  }
};

function ChplChangeRequestView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { changeRequest } = props;
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.productCard}>
        <div className={classes.productCardHeaderContainer}>
          <ChplAvatar
            className={classes.developerAvatar}
            text={changeRequest.developer.name}
          />
          <div className={classes.subProductCardHeaderContainer}>
            <Typography gutterBottom className={classes.cardHeader} variant='h4'>{changeRequest.changeRequestType.name}</Typography>
            <div className={classes.versionProductCardHeaderContainer}>
              <Typography gutterBottom variant="subtitle2">Developer:
              <Typography variant="body1">{changeRequest.developer.name}</Typography></Typography>
              <Typography gutterBottom variant="subtitle2">Creation Date:
              <Typography variant="body1">{DateUtil.getDisplayDateFormat(changeRequest.submittedDate)}</Typography></Typography>
              <Typography gutterBottom variant="subtitle2">Request Status:
              <Typography variant="body1">{changeRequest.currentStatus.changeRequestStatusType.name}</Typography></Typography>
              <Typography gutterBottom variant="subtitle2">Time Since Last Status Change:
              <Typography variant="body1"><Moment fromNow>{changeRequest.currentStatus.statusChangeDate}</Moment></Typography>
              </Typography>
            </div>
          </div>
        </div>
        <Divider />
        <CardContent className={classes.cardContentContainer}>
          <div className={classes.cardContentChangeRequest}>
            <div>
            {getChangeRequestDetails(changeRequest)}
            </div>
          <div className={classes.widgetProductContainer}>
            <div>
              {changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
                && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
                && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester'
                && (
                  <Button
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={() => props.dispatch('edit')}
                  >
                    Edit Change Request
                  </Button>
                )}
            </div>
            <div>
              <Button
                fullWidth
                color="default"
                variant="contained"
                onClick={() => props.dispatch('close')}
              >
                Close
              </Button>
            </div>
          </div>
          </div>
          <ChplChangeRequestHistory
            changeRequest={changeRequest}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ChplChangeRequestView;

ChplChangeRequestView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
