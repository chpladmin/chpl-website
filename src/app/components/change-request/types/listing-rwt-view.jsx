import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { ChangeRequestContext } from 'shared/contexts';

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
});

function ChplChangeRequestListingRwtView({ title, value }) {
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  const getCurrent = () => changeRequest.details.listing[value];

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Current RWT
          {' '}
          { title }
          {' '}
          URL
        </Typography>
        <Typography>
          { getCurrent() }
        </Typography>
        <Typography>
          { changeRequest.details.listing.chplProductNumber }
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Submitted RWT
          {' '}
          { title }
          {' '}
          URL
        </Typography>
        <Typography>
          { changeRequest.details.url }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtView;

ChplChangeRequestListingRwtView.propTypes = {
  title: string.isRequired,
  value: string.isRequired,
};
