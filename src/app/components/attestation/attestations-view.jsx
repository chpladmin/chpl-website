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
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSnackbar } from 'notistack';

import { useFetchAttestations, usePostAttestationException } from 'api/developer';
import interpretLink from 'components/attestation/attestation-util';
import { ChplDialogTitle } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const [activeAttestations, setActiveAttestations] = useState({});
  const [attestationsOpen, setAttestationsOpen] = useState(false);
  const [attestations, setAttestations] = useState([]);
  const [developer, setDeveloper] = useState({});
  const { mutate } = usePostAttestationException();
  const { enqueueSnackbar } = useSnackbar();
  const { data: { canSubmitAttestationChangeRequest = false, canCreateException = false, developerAttestations = [] } = {} } = useFetchAttestations({ developer, isAuthenticated: hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_DEVELOPER']) });
  const [isCreatingException, setIsCreatingException] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (props?.developer) {
      setAttestations(props.developer.attestations);
      setDeveloper(props.developer);
    }
  }, [props?.developer]);

  const cancelCreatingException = () => {
    setIsCreatingException(false);
  };

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  const canSeeAttestationData = () => hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'])
        || (hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId }));

  const closeAttestations = () => setAttestationsOpen(false);

  const viewAttestations = (selected) => {
    setActiveAttestations(developerAttestations.find((att) => att.id === selected.id));
    setAttestationsOpen(true);
  };

  const createAttestationException = () => {
    setIsSubmitting(true);
    const payload = {
      developer,
    };
    mutate(payload, {
      onSuccess: ({ data: { exceptionEnd, developer: { name } } }) => {
        setIsCreatingException(false);
        setIsSubmitting(false);
        const message = `You have re-opened the submission feature for ${name} until ${DateUtil.getDisplayDateFormat(exceptionEnd)}.`;
        enqueueSnackbar(message, {
          variant: 'success',
        });
      },
      onError: () => {
        const message = 'Something went wrong. Please try again or contact ONC for support';
        enqueueSnackbar(message, {
          variant: 'error',
        });
        setIsSubmitting(false);
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent className={classes.content}>
          { !isCreatingException
            && (
              <>
                <Typography variant="body1">
                  Attestations information is displayed here if a health IT developer’s attestation of compliance with the
                  {' '}
                  <a href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification">Conditions and Maintenance of Certification requirements</a>
                  {' '}
                  was submitted. For more information, please visit the
                  {' '}
                  <a href="https://www.healthit.gov/sites/default/files/page/2022-02/Attestations_Fact-Sheet.pdf">Attestations Fact Sheet</a>
                  .
                </Typography>
                { attestations.length > 0
                  && (
                    <TableContainer component={Paper}>
                      <Table>
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
                          { attestations.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodStart) }
                                {' '}
                                to
                                {' '}
                                { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodEnd) }
                              </TableCell>
                              <TableCell>
                                Attestations submitted
                              </TableCell>
                              { canSeeAttestationData()
                                && (
                                  <TableCell>
                                    <IconButton
                                      onClick={() => viewAttestations(item)}
                                      aria-label={`View attestations for period ending ${item.attestationPeriod.periodEnd}`}
                                    >
                                      <VisibilityIcon color="primary" />
                                    </IconButton>
                                  </TableCell>
                                )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
              </>
            )}
          { isCreatingException
            && (
              <>
                <Typography>
                  This action will re-open the Attestations submission feature for
                  {' '}
                  { developer.name }
                  . Please confirm you want to continue.
                </Typography>
              </>
            )}
        </CardContent>
        { hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId })
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                variant="contained"
                onClick={createAttestationChangeRequest}
                disabled={!canSubmitAttestationChangeRequest}
              >
                Submit Attestations
              </Button>
            </CardActions>
          )}
        { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])
          && (
            <CardActions>
              { !isCreatingException
                && (
                  <Button
                    color="primary"
                    id="create-attestation-exception-button"
                    variant="contained"
                    onClick={() => setIsCreatingException(true)}
                    disabled={!canCreateException}
                  >
                    Re-Open Submission
                  </Button>
                )}
              { isCreatingException
                && (
                  <>
                    <Button
                      color="primary"
                      id="create-attestation-exception-button"
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={createAttestationException}
                    >
                      Confirm
                    </Button>
                    <Button
                      color="primary"
                      id="cancel-attestation-exception-button"
                      onClick={cancelCreatingException}
                    >
                      Cancel
                    </Button>
                  </>
                )}
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
              <div>
                <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
                <Typography gutterBottom>
                  { activeAttestations.period && DateUtil.getDisplayDateFormat(activeAttestations.period.periodStart) }
                  {' '}
                  -
                  {' '}
                  { activeAttestations.period && DateUtil.getDisplayDateFormat(activeAttestations.period.periodEnd) }
                </Typography>
              </div>
              <div>
                <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
                <Typography gutterBottom>{activeAttestations.statusText}</Typography>
                { activeAttestations.responses
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
                          { activeAttestations.responses
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
              </div>
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
