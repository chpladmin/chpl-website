import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

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

function ChplChangeRequestListingRwtResultsView() {
  const { changeRequest } = useContext(ChangeRequestContext);
  const classes = useStyles();

  const getCurrent = () => changeRequest.details.listing.rwtResultsUrl;

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          Current RWT Results URL
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
          Submitted RWT Results URL
        </Typography>
        <Typography>
          { changeRequest.details.url }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtResultsView;

ChplChangeRequestListingRwtResultsView.propTypes = {
};
