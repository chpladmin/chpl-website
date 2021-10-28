import React from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import { changeRequest as changeRequestProp } from '../../../shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'grid',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

function ChplChangeRequestDetailsView(props) {
  const { changeRequest } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          Self-Developer:
          {' '}
          { changeRequest.developer.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
          </Typography>
          <Typography>
            Title:
            {' '}
            { changeRequest.developer.contact.title }
          </Typography>
          <Typography>
            Email:
            {' '}
            { changeRequest.developer.contact.email }
          </Typography>
          <Typography>
            Phone:
            {' '}
            { changeRequest.developer.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Address:
            {' '}
            { changeRequest.developer.address.line1 }
          </Typography>
          <Typography>
            Line 2:
            {' '}
            { changeRequest.developer.address.line2 }
          </Typography>
          <Typography>
            City:
            {' '}
            { changeRequest.developer.address.city }
          </Typography>
          <Typography>
            State:
            {' '}
            { changeRequest.developer.address.state }
          </Typography>
          <Typography>
            Zip:
            {' '}
            { changeRequest.developer.address.zipcode }
          </Typography>
          <Typography>
            Country:
            {' '}
            { changeRequest.developer.address.country }
          </Typography>
        </div>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        <Typography>
          Self-Developer:
          {' '}
          { changeRequest.details.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Full Name:
            {' '}
            { changeRequest.details.contact.fullName }
          </Typography>
          <Typography>
            Title:
            {' '}
            { changeRequest.details.contact.title }
          </Typography>
          <Typography>
            Email:
            {' '}
            { changeRequest.details.contact.email }
          </Typography>
          <Typography>
            Phone:
            {' '}
            { changeRequest.details.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Address:
            {' '}
            { changeRequest.details.address.line1 }
          </Typography>
          <Typography>
            Line 2:
            {' '}
            { changeRequest.details.address.line2 }
          </Typography>
          <Typography>
            City:
            {' '}
            { changeRequest.details.address.city }
          </Typography>
          <Typography>
            State:
            {' '}
            { changeRequest.details.address.state }
          </Typography>
          <Typography>
            Zip:
            {' '}
            { changeRequest.details.address.zipcode }
          </Typography>
          <Typography>
            Country:
            {' '}
            { changeRequest.details.address.country }
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ChplChangeRequestDetailsView;

ChplChangeRequestDetailsView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
