import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { bool, object } from 'prop-types';

import ChplAttestationCreateException from './attestation-create-exception';

import interpretLink from 'components/attestation/attestation-util';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const getRows = (section) => section.formItems
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((item) => (
    <TableRow key={`${section.id}-${item.id}`}>
      <TableCell>
        <strong>
          { section.name }
          {': '}
        </strong>
        { interpretLink(item.question.question) }
      </TableCell>
      <TableCell>
        { item.submittedResponses[0]?.response }
        { item.childFormItems[0]?.submittedResponses.length > 0
              && (
                <ul>
                  { item.childFormItems[0].submittedResponses
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((response) => (
                      <li key={response.id}>{ response.response }</li>
                    ))}
                </ul>
              )}
      </TableCell>
    </TableRow>
  ));

function ChplAttestationView(props) {
  const { hasAnyRole } = useContext(UserContext);
  const [attestations, setAttestations] = useState({});
  const [canCreateException, setCanCreateException] = useState(false);
  const [developer, setDeveloper] = useState({});
  const [exceptionPeriod, setExceptionPeriod] = useState(undefined);

  useEffect(() => {
    setAttestations({
      ...props.attestations,
      period: props.attestations.period || props.attestations.attestationPeriod,
      sections: props.attestations.form.sectionHeadings.sort((a, b) => a.sortOrder - b.sortOrder),
    });
  }, [props.attestations]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setCanCreateException(props.canCreateException);
  }, [props.canCreateException]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        setExceptionPeriod(undefined);
        break;
      case 'saved':
        setExceptionPeriod(undefined);
        break;
        // no default
    }
  };

  return (
    <>
      <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
      <Typography gutterBottom>
        { attestations.period && getDisplayDateFormat(attestations.period.periodStart) }
        {' '}
        -
        {' '}
        { attestations.period && getDisplayDateFormat(attestations.period.periodEnd) }
      </Typography>
      <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
      <Typography gutterBottom>{attestations.statusText}</Typography>
      { attestations.sections
        && (
          <TableContainer component={Paper}>
            <Table
              aria-label="Developer Attestations details"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Attestation</TableCell>
                  <TableCell>Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { attestations.sections.map((section) => getRows(section)) }
              </TableBody>
            </Table>
          </TableContainer>
        )}
      { canCreateException && hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])
        && (
          <Button
            color="primary"
            id="create-attestation-exception-button"
            variant="contained"
            onClick={() => setExceptionPeriod(attestations.period)}
            fullWidth
          >
            Re-Open Submission
          </Button>
        )}
      { exceptionPeriod
        && (
          <ChplAttestationCreateException
            developer={developer}
            dispatch={handleDispatch}
            period={exceptionPeriod}
          />
        )}
    </>
  );
}

export default ChplAttestationView;

ChplAttestationView.propTypes = {
  attestations: object.isRequired, // eslint-disable-line react/forbid-prop-types
  canCreateException: bool,
  developer: developerPropType,
};

ChplAttestationView.defaultProps = {
  canCreateException: false,
  developer: {},
};
