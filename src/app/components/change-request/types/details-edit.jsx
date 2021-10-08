import React, { useState } from 'react';
import {
  Card,
  CardContent,
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

function ChplChangeRequestDetailsEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  return (
    <div className={classes.container}>
      <div>
        Current details
        <Card>
          <CardContent>
            {changeRequest.developer.name}
          </CardContent>
        </Card>
      </div>
      <div>
        Submitted details
        <Card>
          <CardContent>
            {changeRequest.developer.name}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ChplChangeRequestDetailsEdit;

ChplChangeRequestDetailsEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
