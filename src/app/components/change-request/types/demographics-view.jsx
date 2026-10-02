import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';

import { ChangeRequestContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const styles = {
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
};

function ChplChangeRequestDemographicsView() {
  const { changeRequest } = useContext(ChangeRequestContext);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Current demographics</Typography>
        <Typography sx={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? styles.highlightOld : undefined}>
          Self-Developer:
          {' '}
          { changeRequest.developer.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <Box sx={styles.detailsSubContainer}>
          <Typography sx={[styles.fullWidthGridRow, changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName && styles.highlightOld]}>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
          </Typography>
          <Typography sx={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? styles.highlightOld : undefined}>
            Email:
            {' '}
            { changeRequest.developer.contact.email }
          </Typography>
          <Typography sx={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? styles.highlightOld : undefined}>
            Phone:
            {' '}
            { changeRequest.developer.contact.phoneNumber }
          </Typography>
        </Box>
        <Typography variant="subtitle2">Address</Typography>
        <Box sx={styles.detailsSubContainer}>
          <Typography sx={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? styles.highlightOld : undefined}>
            Address:
            {' '}
            { changeRequest.developer.address.line1 }
          </Typography>
          <Typography sx={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? styles.highlightOld : undefined}>
            Line 2:
            {' '}
            { changeRequest.developer.address.line2 }
          </Typography>
          <Typography sx={changeRequest.developer.address.city !== changeRequest.details.address.city ? styles.highlightOld : undefined}>
            City:
            {' '}
            { changeRequest.developer.address.city }
          </Typography>
          <Typography sx={changeRequest.developer.address.state !== changeRequest.details.address.state ? styles.highlightOld : undefined}>
            State:
            {' '}
            { changeRequest.developer.address.state }
          </Typography>
          <Typography sx={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? styles.highlightOld : undefined}>
            Zip:
            {' '}
            { changeRequest.developer.address.zipcode }
          </Typography>
          <Typography sx={changeRequest.developer.address.country !== changeRequest.details.address.country ? styles.highlightOld : undefined}>
            Country:
            {' '}
            { changeRequest.developer.address.country }
          </Typography>
        </Box>
        <Typography sx={changeRequest.developer.website !== changeRequest.details.website ? styles.highlightOld : undefined}>
          Website:
          {' '}
          { changeRequest.developer.website }
        </Typography>
      </Box>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Submitted demographics</Typography>
        <Typography sx={changeRequest.developer.selfDeveloper !== changeRequest.details.selfDeveloper ? styles.highlightNew : undefined}>
          Self-Developer:
          {' '}
          { changeRequest.details.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <Box sx={styles.detailsSubContainer}>
          <Typography sx={[styles.fullWidthGridRow, changeRequest.developer.contact.fullName !== changeRequest.details.contact.fullName && styles.highlightNew]}>
            Full Name:
            {' '}
            { changeRequest.details.contact.fullName }
          </Typography>
          <Typography sx={changeRequest.developer.contact.email !== changeRequest.details.contact.email ? styles.highlightNew : undefined}>
            Email:
            {' '}
            { changeRequest.details.contact.email }
          </Typography>
          <Typography sx={changeRequest.developer.contact.phoneNumber !== changeRequest.details.contact.phoneNumber ? styles.highlightNew : undefined}>
            Phone:
            {' '}
            { changeRequest.details.contact.phoneNumber }
          </Typography>
        </Box>
        <Typography variant="subtitle2">Address</Typography>
        <Box sx={styles.detailsSubContainer}>
          <Typography sx={changeRequest.developer.address.line1 !== changeRequest.details.address.line1 ? styles.highlightNew : undefined}>
            Address:
            {' '}
            { changeRequest.details.address.line1 }
          </Typography>
          <Typography sx={changeRequest.developer.address.line2 !== changeRequest.details.address.line2 ? styles.highlightNew : undefined}>
            Line 2:
            {' '}
            { changeRequest.details.address.line2 }
          </Typography>
          <Typography sx={changeRequest.developer.address.city !== changeRequest.details.address.city ? styles.highlightNew : undefined}>
            City:
            {' '}
            { changeRequest.details.address.city }
          </Typography>
          <Typography sx={changeRequest.developer.address.state !== changeRequest.details.address.state ? styles.highlightNew : undefined}>
            State:
            {' '}
            { changeRequest.details.address.state }
          </Typography>
          <Typography sx={changeRequest.developer.address.zipcode !== changeRequest.details.address.zipcode ? styles.highlightNew : undefined}>
            Zip:
            {' '}
            { changeRequest.details.address.zipcode }
          </Typography>
          <Typography sx={changeRequest.developer.address.country !== changeRequest.details.address.country ? styles.highlightNew : undefined}>
            Country:
            {' '}
            { changeRequest.details.address.country }
          </Typography>
        </Box>
        <Typography sx={changeRequest.developer.website !== changeRequest.details.website ? styles.highlightNew : undefined}>
          Website:
          {' '}
          { changeRequest.details.website }
        </Typography>
      </Box>
    </Box>
  );
}

export default ChplChangeRequestDemographicsView;

ChplChangeRequestDemographicsView.propTypes = {
};
