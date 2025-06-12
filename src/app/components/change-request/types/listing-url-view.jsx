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

function ChplChangeRequestListingUrlView({ changeRequest }) {
  const classes = useStyles();

  const getCurrent = () => {
    switch (changeRequest.details.changeRequestListingUrlType.name) {
      case 'Service Base URL List':
        return changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList;
      default:
          return 'Unknown type';
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">
          { `Current ${changeRequest.details.changeRequestListingUrlType.name} `}
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
          { `Submitted ${changeRequest.details.changeRequestListingUrlType.name} `}
        </Typography>
        <Typography>
          { changeRequest.details.url }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestListingUrlView;

ChplChangeRequestListingUrlView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
