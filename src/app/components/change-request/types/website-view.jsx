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

function ChplChangeRequestWebsiteView(props) {
  const { changeRequest } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant="subtitle2">Current website</Typography>
        {changeRequest.developer.website}
      </div>
      <div>
        <Typography gutterBottom variant="subtitle2">Submitted website</Typography>
        {changeRequest.details.website}
      </div>
    </div>
  );
}

export default ChplChangeRequestWebsiteView;

ChplChangeRequestWebsiteView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
