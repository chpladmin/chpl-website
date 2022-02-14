import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchAttestations, useFetchPublicAttestations, usePostAttestationException } from 'api/developer';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
  },
});

const validationSchema = yup.object({
  exceptionDate: yup.date()
    .required('Exception Date is required')
    .min(new Date(), 'Exception Date must be in the future'),
});

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { developer } = props;
  const { isLoading, data } = useFetchPublicAttestations({ developer });
  const { mutate } = usePostAttestationException();
  const { enqueueSnackbar } = useSnackbar();
  const attestationData = useFetchAttestations({ developer });
  const [isCreatingException, setIsCreatingException] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();
  let formik;

  const cancelCreatingException = () => {
    setIsCreatingException(false);
    formik.resetForm();
  };

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  const createAttestationException = () => {
    setIsSubmitting(true);
    const payload = {
      exceptionEnd: formik.values.exceptionDate,
      developer,
    };
    mutate(payload, {
      onSuccess: () => {
        setIsCreatingException(false);
        setIsSubmitting(false);
        formik.resetForm();
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

  formik = useFormik({
    initialValues: {
      exceptionDate: '',
    },
    onSubmit: () => {
      createAttestationException();
    },
    validationSchema,
  });

  return (
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
              <ChplTextField
                type="date"
                id="exception-date"
                name="exceptionDate"
                label="Exception Date"
                required
                value={formik.values.exceptionDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.exceptionDate && !!formik.errors.exceptionDate}
                helperText={formik.touched.exceptionDate && formik.errors.exceptionDate}
              />
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
              disabled={!attestationData.data?.canSubmitAttestationChangeRequest}
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
                disabled={attestationData.data?.canSubmitAttestationChangeRequest}
              >
                Create Attestations Submission Exception
              </Button>
              )}
            { isCreatingException
              && (
                <>
                  <Button
                    color="primary"
                    id="create-attestation-exception-button"
                    variant="contained"
                    disabled={!formik.isValid || isSubmitting}
                    onClick={formik.submitForm}
                  >
                    Create
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
  );
}

export default ChplAttestationsView;

ChplAttestationsView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
