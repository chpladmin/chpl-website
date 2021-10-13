import React from 'react';
import {
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
        Current website
        <br />
        {changeRequest.developer.website}
      </div>
      <div>
        Submitted website
        <br />
        {changeRequest.details.website}
      </div>
    </div>
  );
}

export default ChplChangeRequestWebsiteView;

ChplChangeRequestWebsiteView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
