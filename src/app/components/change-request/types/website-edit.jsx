import React, { useState } from 'react';
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

function ChplChangeRequestWebsiteEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

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

export default ChplChangeRequestWebsiteEdit;

ChplChangeRequestWebsiteEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
