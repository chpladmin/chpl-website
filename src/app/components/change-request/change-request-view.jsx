import React, { useContext } from 'react';
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
import { UserContext } from '../../shared/contexts';

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
    gridTemplateColumns: 'auto auto auto auto 1fr',
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
  subcontent: {
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
  const { hasAnyRole } = useContext(UserContext);
  const { changeRequest } = props;
  const classes = useStyles();

  const canEdit = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester';
    }
    return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
    && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
    && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester'
    && changeRequest.currentStatus.changeRequestStatusType.name !== 'Pending Developer Action';
  };

  return (
    <div>
      <Card className={classes.productCard}>
        <div className={classes.productCardHeaderContainer}>
          <ChplAvatar
            className={classes.developerAvatar}
            text={changeRequest.developer.name}
          />
          <div className={classes.subProductCardHeaderContainer}>
            <Typography variant="h5">{changeRequest.changeRequestType.name}</Typography>
            <div className={classes.versionProductCardHeaderContainer}>
              <Typography variant="subtitle2">Developer:</Typography>
              <Typography variant="body1">{changeRequest.developer.name}</Typography>
              <Typography variant="subtitle2">Creation Date:</Typography>
              <Typography variant="body1">{DateUtil.getDisplayDateFormat(changeRequest.submittedDate)}</Typography>
              |
              <Typography variant="subtitle2">Request Status:</Typography>
              <Typography variant="body1">{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
              |
              <Typography variant="subtitle2">Time Since Last Status Change:</Typography>
              <Typography variant="body1"><Moment fromNow>{changeRequest.currentStatus.statusChangeDate}</Moment></Typography>
              |
            </div>
          </div>
        </div>
        <Divider />
        <CardContent>
          { getChangeRequestDetails(changeRequest) }
          <div className={classes.widgetProductContainer}>
            <div>
              { canEdit()
                && (
                <Button
                  color="secondary"
                  variant="contained"
                  fullWidth
                  onClick={() => props.dispatch('edit')}
                >
                  Edit Change Request
                </Button>
                )}
            </div>
            <div>
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => props.dispatch('close')}
              >
                Close
              </Button>
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
