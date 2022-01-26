import React from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

import interpretLink from 'components/attestation/attestation-util';
import { getAngularService } from 'services/angular-react-helper';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gap: '8px',
  },
});

function ChplChangeRequestAttestationView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { changeRequest } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
        { DateUtil.getDisplayDateFormat(changeRequest.details.attestationPeriod.periodStart) }
        {' '}
        -
        {' '}
        { DateUtil.getDisplayDateFormat(changeRequest.details.attestationPeriod.periodEnd) }
      </div>
      <div>
        <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
        <ul>
          { changeRequest.details.attestationResponses.map((response) => (
            <li key={response.id}>
              { interpretLink(response.attestation.description) }
              :
              {' '}
              { response.response.response }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestationView;

ChplChangeRequestAttestationView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
