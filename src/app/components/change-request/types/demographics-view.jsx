import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChangeRequestContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  highlight: {
    backgroundColor: 'yellow',
  },
});

function ChplChangeRequestDemographicsView() {
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current demographics</Typography>
        <Typography className={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? classes.highlight : ''}>
          Self-Developer:
          {' '}
          { changeRequest.developer.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={`${classes.fullWidthGridRow} ${changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName ? classes.highlight : ''}`}>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
          </Typography>
          <Typography className={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? classes.highlight : ''}>
            Email:
            {' '}
            { changeRequest.developer.contact.email }
          </Typography>
          <Typography className={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? classes.highlight : ''}>
            Phone:
            {' '}
            { changeRequest.developer.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? classes.highlight : ''}>
            Address:
            {' '}
            { changeRequest.developer.address.line1 }
          </Typography>
          <Typography className={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? classes.highlight : ''}>
            Line 2:
            {' '}
            { changeRequest.developer.address.line2 }
          </Typography>
          <Typography className={changeRequest.developer.address.city !== changeRequest.details.address.city ? classes.highlight : ''}>
            City:
            {' '}
            { changeRequest.developer.address.city }
          </Typography>
          <Typography className={changeRequest.developer.address.state !== changeRequest.details.address.state ? classes.highlight : ''}>
            State:
            {' '}
            { changeRequest.developer.address.state }
          </Typography>
          <Typography className={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? classes.highlight : ''}>
            Zip:
            {' '}
            { changeRequest.developer.address.zipcode }
          </Typography>
          <Typography className={changeRequest.developer.address.country !== changeRequest.details.address.country ? classes.highlight : ''}>
            Country:
            {' '}
            { changeRequest.developer.address.country }
          </Typography>
        </div>
        <Typography className={changeRequest.developer.website !== changeRequest.details.website ? classes.highlight : ''}>
          Website:
          {' '}
          { changeRequest.developer.website }
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted demographics</Typography>
        <Typography className={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? classes.highlight : ''}>
          Self-Developer:
          {' '}
          { changeRequest.details.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={`${classes.fullWidthGridRow} ${changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName ? classes.highlight : ''}`}>
            Full Name:
            {' '}
            { changeRequest.details.contact.fullName }
          </Typography>
          <Typography className={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? classes.highlight : ''}>
            Email:
            {' '}
            { changeRequest.details.contact.email }
          </Typography>
          <Typography className={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? classes.highlight : ''}>
            Phone:
            {' '}
            { changeRequest.details.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? classes.highlight : ''}>
            Address:
            {' '}
            { changeRequest.details.address.line1 }
          </Typography>
          <Typography className={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? classes.highlight : ''}>
            Line 2:
            {' '}
            { changeRequest.details.address.line2 }
          </Typography>
          <Typography className={changeRequest.developer.address.city !== changeRequest.details.address.city ? classes.highlight : ''}>
            City:
            {' '}
            { changeRequest.details.address.city }
          </Typography>
          <Typography className={changeRequest.developer.address.state !== changeRequest.details.address.state ? classes.highlight : ''}>
            State:
            {' '}
            { changeRequest.details.address.state }
          </Typography>
          <Typography className={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? classes.highlight : ''}>
            Zip:
            {' '}
            { changeRequest.details.address.zipcode }
          </Typography>
          <Typography className={changeRequest.developer.address.country !== changeRequest.details.address.country ? classes.highlight : ''}>
            Country:
            {' '}
            { changeRequest.details.address.country }
          </Typography>
        </div>
        <Typography className={changeRequest.developer.website !== changeRequest.details.website ? classes.highlight : ''}>
          Website:
          {' '}
          { changeRequest.details.website }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestDemographicsView;

ChplChangeRequestDemographicsView.propTypes = {
};
