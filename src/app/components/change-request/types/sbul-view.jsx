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

function ChplChangeRequestSBULView({ changeRequest }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current Service Base URL List</Typography>
        <Typography>
          TBD
        </Typography>
        <Typography>
          CHPL Product Number
        </Typography>
      </div>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted Service Base URL List</Typography>
        <Typography>
          { changeRequest.details.url }
        </Typography>
      </div>
    </div>
  );
}

export default ChplChangeRequestSBULView;

ChplChangeRequestSBULView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
