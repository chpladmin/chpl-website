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
    gap: '8px',
  },
});

function ChplChangeRequestDetailsView(props) {
  const { changeRequest } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant="subtitle2">Current details</Typography>
        {changeRequest.developer.name}
      </div>
      <div>
        <Typography gutterBottom variant="subtitle2">Submitted details</Typography>
        {changeRequest.developer.name}
      </div>
    </div>
  );
}

export default ChplChangeRequestDetailsView;

ChplChangeRequestDetailsView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
