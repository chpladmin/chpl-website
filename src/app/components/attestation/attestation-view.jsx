import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { object } from 'prop-types';

import interpretLink from 'components/attestation/attestation-util';
import { getAngularService } from 'services/angular-react-helper';

function ChplAttestationView(props) {
  const DateUtil = getAngularService('DateUtil');
  const [attestations, setAttestations] = useState({});

  useEffect(() => {
    setAttestations({
      ...props.attestations,
      period: props.attestations.period || props.attestations.attestationPeriod,
      responses: props.attestations.responses || props.attestations.attestationResponses,
    });
  }, [props.attestations]); // eslint-disable-line react/destructuring-assignment

  return (
    <>
      <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
      <Typography gutterBottom>
        { attestations.period && DateUtil.getDisplayDateFormat(attestations.period.periodStart) }
        {' '}
        -
        {' '}
        { attestations.period && DateUtil.getDisplayDateFormat(attestations.period.periodEnd) }
      </Typography>
      <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
      <Typography gutterBottom>{attestations.statusText}</Typography>
      { attestations.responses
        && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attestation</TableCell>
                  <TableCell>Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { attestations.responses
                  .sort((a, b) => a.attestation.sortOrder - b.attestation.sortOrder)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <strong>
                          { item.attestation.condition.name }
                          {': '}
                        </strong>
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
        )}
    </>
  );
}

export default ChplAttestationView;

ChplAttestationView.propTypes = {
  attestations: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
