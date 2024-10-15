import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  IconButton,
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
import { func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';

import ChplAttestationCreateException from './attestation-create-exception';
import ChplAttestationView from './attestation-view';

import { useFetchAttestations } from 'api/developer';
import { ChplDialogTitle } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplAttestationsView({ developer: initialDeveloper, dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const [activeAttestations, setActiveAttestations] = useState({});
  const [attestationsOpen, setAttestationsOpen] = useState(false);
  const [attestations, setAttestations] = useState([]);
  const [developer, setDeveloper] = useState({});
  const { data: { submittablePeriod = {}, canCreateException = false, attestations: developerAttestations = [] } = {} } = useFetchAttestations({ developer, isAuthenticated: hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer']) });
  const [exceptionPeriod, setExceptionPeriod] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    if (initialDeveloper) {
      setAttestations(initialDeveloper.attestations.sort((a, b) => (b.attestationPeriod.periodStart < a.attestationPeriod.periodStart ? -1 : 1)));
      setDeveloper(initialDeveloper);
    }
  }, [initialDeveloper]);

  const createAttestationChangeRequest = () => {
    eventTrack({
      ...analytics,
      category: 'Developer', // todo: when the higher component is React, remove this and use the component from above
      label: developer.name, // todo: when the higher component is React, remove this and use the component from above
      event: 'Submit Attestations',
    });
    dispatch('createAttestation');
  };

  const canSeeAttestationData = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
        || (hasAnyRole(['chpl-developer']) && hasAuthorityOn({ id: developer.id }));

  const canSeeUnsubmittedAttestationData = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']);

  const closeAttestations = () => setAttestationsOpen(false);

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

  const viewAttestations = (selected) => {
    setActiveAttestations(developerAttestations.find((att) => att.id === selected.id));
    setAttestationsOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent className={classes.content}>
          <>
            <Typography variant="body1">
              Attestations information is displayed here if a health IT developer’s attestation of compliance with the
              {' '}
              <a href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification">Conditions and Maintenance of Certification requirements</a>
              {' '}
              was submitted. For more information, please visit the
              {' '}
              <a href="https://www.healthit.gov/sites/default/files/2022-08/Attestations-Condition-Resource-Guide.pdf">Attestations Resource Guide</a>
              .
            </Typography>
            { attestations.filter((att) => att.status === 'ATTESTATIONS_SUBMITTED' || canSeeUnsubmittedAttestationData()).length > 0
              && (
                <TableContainer component={Paper}>
                  <Table
                    aria-label="Developer Attestations information"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Attestation Period</TableCell>
                        <TableCell>Status</TableCell>
                        { canSeeAttestationData()
                          && (
                            <TableCell>
                              <span className="sr-only">View Details</span>
                            </TableCell>
                          )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { attestations
                        .filter((att) => att.status === 'ATTESTATIONS_SUBMITTED' || canSeeUnsubmittedAttestationData())
                        .map((item) => (
                          <TableRow key={item.id ?? item.attestationPeriod.id}>
                            <TableCell>
                              { getDisplayDateFormat(item.attestationPeriod.periodStart) }
                              {' '}
                              to
                              {' '}
                              { getDisplayDateFormat(item.attestationPeriod.periodEnd) }
                            </TableCell>
                            <TableCell>
                              { item.statusText }
                            </TableCell>
                            { canSeeAttestationData()
                              && (
                                <TableCell>
                                  { item.status === 'ATTESTATIONS_SUBMITTED'
                                    ? (
                                      <IconButton
                                        color="primary"
                                        variant="contained"
                                        onClick={() => viewAttestations(item)}
                                        aria-label={`View attestations for period ending ${item.attestationPeriod.periodEnd}`}
                                      >
                                        <VisibilityIcon color="primary" />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        color="primary"
                                        variant="contained"
                                        onClick={() => setExceptionPeriod(item.attestationPeriod)}
                                        aria-label={`Create attestations exception for period ending ${item.attestationPeriod.periodEnd}`}
                                        disabled={!canCreateException}
                                      >
                                        <AddIcon color="primary" />
                                      </IconButton>
                                    )}
                                </TableCell>
                              )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </>
          { exceptionPeriod
            && (
              <ChplAttestationCreateException
                developer={developer}
                dispatch={handleDispatch}
                period={exceptionPeriod}
              />
            )}
        </CardContent>
        { hasAnyRole(['chpl-developer']) && hasAuthorityOn({ id: developer.id })
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                variant="contained"
                onClick={createAttestationChangeRequest}
                disabled={!submittablePeriod}
              >
                Submit Attestations
              </Button>
            </CardActions>
          )}
      </Card>
      { activeAttestations
        && (
          <Dialog
            fullWidth
            maxWidth="md"
            onClose={closeAttestations}
            aria-labelledby="attestations-details"
            open={attestationsOpen}
          >
            <ChplDialogTitle
              id="attestations-details"
              onClose={closeAttestations}
            >
              View Attestations Details
            </ChplDialogTitle>
            <DialogContent
              dividers
            >
              <ChplAttestationView
                attestations={activeAttestations}
                canCreateException={canCreateException}
                developer={developer}
              />
            </DialogContent>
          </Dialog>
        )}
    </>
  );
}

export default ChplAttestationsView;

ChplAttestationsView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
