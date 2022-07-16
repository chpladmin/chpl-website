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

const getRows = (section) => section.formItems.map((item) => (
  <TableRow key={section.id}>
    <TableCell>
      <strong>
        { section.name }
        {': '}
      </strong>
      { interpretLink(item.question.question) }
    </TableCell>
    <TableCell>
      { item.question.responseCardinalityType.description === 'Single'
        && (
          <>
            { item.submittedResponses[0].response }
          </>
        )}
      { item.question.responseCardinalityType.description === 'Multiple'
        && (
          <ul>
            { item.submittedResponses.map((response) => (
              <li key={response.id}>{ response }</li>
            ))}
          </ul>
        )}
    </TableCell>
  </TableRow>
));

function ChplAttestationView(props) {
  const DateUtil = getAngularService('DateUtil');
  const [attestations, setAttestations] = useState({});

  useEffect(() => {
    setAttestations({
      ...props.attestations,
      period: props.attestations.period || props.attestations.attestationPeriod,
      sections: props.attestations.form.sectionHeadings.sort((a, b) => a.sortOrder - b.sortOrder),
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
      { attestations.sections
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
                { attestations.sections.flatMap((section) => getRows(section)) }
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
