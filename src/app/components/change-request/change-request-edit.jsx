import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import Moment from 'react-moment';

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';

import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDetailsEdit from './types/details-edit';
import ChplChangeRequestWebsiteEdit from './types/website-edit';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '8px',
  },
});

const getChangeRequestDetails = (cr) => {
  switch (cr.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return (
        <ChplChangeRequestAttestationEdit
          changeRequest={cr}
        />
      );
    case 'Developer Details Change Request':
      return (
        <ChplChangeRequestDetailsEdit
          changeRequest={cr}
        />
      );
    case 'Website Change Request':
      return (
        <ChplChangeRequestWebsiteEdit
          changeRequest={cr}
        />
      );
    default:
      return (
        <>
          No details found
        </>
      );
  }
};

const getInitials = (name) => name.split(' ').map((c) => c.substring(0, 1).toUpperCase()).join('');

function ChplChangeRequestEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  return (
    <div className={classes.container}>
      <div>
        {getChangeRequestDetails(changeRequest)}
      </div>
      <div>
        Edit form
      </div>
    </div>
  );
}

export default ChplChangeRequestEdit;

ChplChangeRequestEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
