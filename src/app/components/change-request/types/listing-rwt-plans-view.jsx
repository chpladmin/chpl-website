import React from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import { changeRequest as changeRequestProp } from 'shared/prop-types';

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

function ChplChangeRequestListingRwtPlansView({ changeRequest }) {
  const classes = useStyles();

  const getCurrent = () => changeRequest.details.listing.rwtPlansUrl;

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Current RWT Plans URL
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
          Submitted RWT Plans URL
        </Typography>
        <Typography>
          { changeRequest.details.url }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtPlansView;

ChplChangeRequestListingRwtPlansView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
