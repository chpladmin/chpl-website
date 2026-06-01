import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import { ChangeRequestContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

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
  highlightOld: {
    backgroundColor: palette.secondaryDark,
  },
  highlightNew: {
    backgroundColor: palette.progressSuccessTrack,
  },
});

function ChplChangeRequestDemographicsView() {
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current demographics</Typography>
        <Typography className={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? classes.highlightOld : ''}>
          Self-Developer:
          {' '}
          { changeRequest.developer.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={`${classes.fullWidthGridRow} ${changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName ? classes.highlightOld : ''}`}>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
          </Typography>
          <Typography className={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? classes.highlightOld : ''}>
            Email:
            {' '}
            { changeRequest.developer.contact.email }
          </Typography>
          <Typography className={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? classes.highlightOld : ''}>
            Phone:
            {' '}
            { changeRequest.developer.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? classes.highlightOld : ''}>
            Address:
            {' '}
            { changeRequest.developer.address.line1 }
          </Typography>
          <Typography className={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? classes.highlightOld : ''}>
            Line 2:
            {' '}
            { changeRequest.developer.address.line2 }
          </Typography>
          <Typography className={changeRequest.developer.address.city !== changeRequest.details.address.city ? classes.highlightOld : ''}>
            City:
            {' '}
            { changeRequest.developer.address.city }
          </Typography>
          <Typography className={changeRequest.developer.address.state !== changeRequest.details.address.state ? classes.highlightOld : ''}>
            State:
            {' '}
            { changeRequest.developer.address.state }
          </Typography>
          <Typography className={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? classes.highlightOld : ''}>
            Zip:
            {' '}
            { changeRequest.developer.address.zipcode }
          </Typography>
          <Typography className={changeRequest.developer.address.country !== changeRequest.details.address.country ? classes.highlightOld : ''}>
            Country:
            {' '}
            { changeRequest.developer.address.country }
          </Typography>
        </div>
        <Typography className={changeRequest.developer.website !== changeRequest.details.website ? classes.highlightOld : ''}>
          Website:
          {' '}
          { changeRequest.developer.website }
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted demographics</Typography>
        <Typography className={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? classes.highlightNew : ''}>
          Self-Developer:
          {' '}
          { changeRequest.details.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={`${classes.fullWidthGridRow} ${changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName ? classes.highlightNew : ''}`}>
            Full Name:
            {' '}
            { changeRequest.details.contact.fullName }
          </Typography>
          <Typography className={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? classes.highlightNew : ''}>
            Email:
            {' '}
            { changeRequest.details.contact.email }
          </Typography>
          <Typography className={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? classes.highlightNew : ''}>
            Phone:
            {' '}
            { changeRequest.details.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography className={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? classes.highlightNew : ''}>
            Address:
            {' '}
            { changeRequest.details.address.line1 }
          </Typography>
          <Typography className={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? classes.highlightNew : ''}>
            Line 2:
            {' '}
            { changeRequest.details.address.line2 }
          </Typography>
          <Typography className={changeRequest.developer.address.city !== changeRequest.details.address.city ? classes.highlightNew : ''}>
            City:
            {' '}
            { changeRequest.details.address.city }
          </Typography>
          <Typography className={changeRequest.developer.address.state !== changeRequest.details.address.state ? classes.highlightNew : ''}>
            State:
            {' '}
            { changeRequest.details.address.state }
          </Typography>
          <Typography className={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? classes.highlightNew : ''}>
            Zip:
            {' '}
            { changeRequest.details.address.zipcode }
          </Typography>
          <Typography className={changeRequest.developer.address.country !== changeRequest.details.address.country ? classes.highlightNew : ''}>
            Country:
            {' '}
            { changeRequest.details.address.country }
          </Typography>
        </div>
        <Typography className={changeRequest.developer.website !== changeRequest.details.website ? classes.highlightNew : ''}>
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
