import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';

import interpretLink from 'components/attestation/attestation-util';
import { getAngularService } from 'services/angular-react-helper';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attestation</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { changeRequest.details.attestationResponses
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      { interpretLink(item.attestation.description) }
                    </TableCell>
                    <TableCell>
                      { item.response.response }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestationView;

ChplChangeRequestAttestationView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
