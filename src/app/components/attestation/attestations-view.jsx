import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import { useFetchPublicAttestations } from 'api/developer';
import interpretLink from 'components/attestation/attestation-util';
import { ChplDialogTitle } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
  },
});

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { developer } = props;
  const { isLoading, data } = useFetchPublicAttestations({ developer });
  const [activeAttestations, setActiveAttestations] = useState({});
  const [attestationsOpen, setAttestationsOpen] = useState(false);
  const classes = useStyles();

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  const canSeeAttestationData = () => hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'])
        || (hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId }));

  const closeAttestations = () => setAttestationsOpen(false);

  const viewAttestations = (attestations) => {
    setActiveAttestations(attestations);
    setAttestationsOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent className={classes.content}>
          <Typography variant="body1">
            Attestations information is displayed here if a health IT developer’s attestation of compliance with the
            {' '}
            <a href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification">Conditions and Maintenance of Certification requirements</a>
            {' '}
            was submitted. For more information, please visit the
            {' '}
            <a href="">Attestations Fact Sheet</a>
            .
          </Typography>
          { (!isLoading && data?.length > 0)
            && (
              <TableContainer component={Paper}>
                <Table size="small">
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
                    { data.map((item) => (
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
                              <Button
                                onClick={() => viewAttestations(item)}
                              >
                                <ZoomInIcon />
                              </Button>
                            </TableCell>
                          )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </CardContent>
        { hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId })
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                name="createAttestationChangeRequestButton"
                variant="contained"
                onClick={createAttestationChangeRequest}
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
              <div>
                <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
                { activeAttestations.attestationPeriod && DateUtil.getDisplayDateFormat(activeAttestations.attestationPeriod.periodStart) }
                {' '}
                -
                {' '}
                { activeAttestations.attestationPeriod && DateUtil.getDisplayDateFormat(activeAttestations.attestationPeriod.periodEnd) }
              </div>
              <div>
                <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
                <Typography>{activeAttestations.statusText}</Typography>
                { activeAttestations.attestationResponses
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
                          { activeAttestations.attestationResponses
                            .sort((a, b) => a.attestation.sortOrder - b.attestation.sortOrder)
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
                  )}
              </div>
            </DialogContent>
          </Dialog>
        )}
    </ThemeProvider>
  );
}

export default ChplAttestationsView;

ChplAttestationsView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
