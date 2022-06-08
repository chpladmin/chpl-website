import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDemographicsEdit from './types/demographics-edit';

import {
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
} from 'api/change-requests';
import ChplActionBarConfirmation from 'components/action-bar/action-bar-confirmation';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { FlagContext, UserContext } from 'shared/contexts';
import { changeRequest as changeRequestProp } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  actionContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  actionSubContainer: {
    display: 'grid',
    gap: '16px',
    alignContent: 'flex-start',
    gridTemplateColumns: '1fr 1fr',
  },
  actionDivider: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    },
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
});

const validationSchema = yup.object({
  comment: yup.string()
    .test('conditionallyRequired',
      'Reason for Change is required',
      (value, context) => (!!value || (context.parent.changeRequestStatusType?.name !== 'Rejected' && context.parent.changeRequestStatusType?.name !== 'Pending Developer Action'))),
  changeRequestStatusType: yup.object()
    .required('Change Request status is required'),
});

const getChangeRequestDetails = (cr, handleDispatch) => {
  switch (cr.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return (
        <ChplChangeRequestAttestationEdit
          changeRequest={cr}
          dispatch={handleDispatch}
        />
      );
    case 'Developer Demographics Change Request':
      return (
        <ChplChangeRequestDemographicsEdit
          changeRequest={cr}
          dispatch={handleDispatch}
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

function ChplChangeRequestEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    changeRequest,
  } = props;
  const [changeRequestStatusTypes, setChangeRequestStatusTypes] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [details, setDetails] = useState(props.changeRequest.details);
  const [isConfirming, setIsConfirming] = useState(false);
  const crstQuery = useFetchChangeRequestStatusTypes();
  const { mutate } = usePutChangeRequest();
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  useEffect(() => {
    if (crstQuery.isLoading || !crstQuery.isSuccess) {
      return;
    }
    const types = crstQuery.data.data
      .filter((type) => {
        if (hasAnyRole(['ROLE_DEVELOPER'])) {
          return type.name === 'Pending ONC-ACB Action' || type.name === 'Cancelled by Requester';
        }
        return type.name !== 'Pending ONC-ACB Action' && type.name !== 'Cancelled by Requester';
      })
      .sort((a, b) => (a.name < b.name ? -1 : 1));
    setChangeRequestStatusTypes(types);

    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      formik.setFieldValue('changeRequestStatusType', types.find((type) => type.name === 'Pending ONC-ACB Action'));
    }
  }, [crstQuery.data, crstQuery.isLoading, crstQuery.isSuccess, hasAnyRole]);

  useEffect(() => {
    if (changeRequest.certificationBodies.length > 1 && hasAnyRole(['ROLE_ACB'])) {
      setConfirmationMessage('All associated ONC-ACBs must be consulted regarding this change. Will you ensure this happens?');
      setIsConfirming(true);
    }
  }, [changeRequest?.certificationBodies, hasAnyRole]);

  const handleUpdate = (data) => {
    switch (changeRequest.changeRequestType.name) {
      case 'Developer Attestation Change Request':
        setDetails({
          ...details,
          attestation: data.attestation,
        });
        break;
      case 'Developer Demographics Change Request':
        setDetails({
          ...details,
          address: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            country: data.country,
          },
          contact: {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            title: data.title,
          },
          selfDeveloper: data.selfDeveloper,
          website: data.website,
        });
        break;
        // no default
    }
  };

  const handleConfirmation = (response) => {
    switch (response) {
      case 'yes':
        if (confirmationMessage === 'All associated ONC-ACBs have been consulted regarding this change') {
          formik.submitForm();
        }
        break;
      case 'no':
        props.dispatch('close');
        break;
        // no default
    }
    setConfirmationMessage('');
    setIsConfirming(false);
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        props.dispatch('close');
        break;
      case 'delete':
        formik.values.changeRequestStatusType = changeRequestStatusTypes.find((type) => type.name === 'Cancelled by Requester');
        formik.submitForm();
        break;
      case 'update':
        handleUpdate(data);
        break;
      case 'save':
        if (changeRequest.certificationBodies.length > 1 && hasAnyRole(['ROLE_ACB'])) {
          setConfirmationMessage('All associated ONC-ACBs have been consulted regarding this change');
          setIsConfirming(true);
        } else {
          formik.submitForm();
        }
        break;
        // no default
    }
  };

  const isReasonDisabled = () => hasAnyRole(['ROLE_DEVELOPER']) && changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action';

  const isReasonRequired = () => formik.values.changeRequestStatusType?.name === 'Rejected'
        || (formik.values.changeRequestStatusType?.name === 'Pending Developer Action' && !hasAnyRole(['ROLE_DEVELOPER']));

  const save = (request) => {
    mutate(request, {
      onSuccess: () => {
        props.dispatch('close');
      },
      onError: (error) => {
        if (error.response.data.error?.startsWith('Email could not be sent to')) {
          enqueueSnackbar(`${error.response.data.error} However, the changes have been applied`, {
            variant: 'info',
          });
          props.dispatch('close');
        } else {
          const message = error.response.data?.error
                || error.response.data?.errorMessages.join(' ');
          enqueueSnackbar(message, {
            variant: 'error',
          });
          formik.resetForm();
        }
      },
    });
  };

  formik = useFormik({
    initialValues: {
      comment: '',
      changeRequestStatusType: '',
    },
    onSubmit: () => {
      const updated = {
        ...changeRequest,
        details,
        currentStatus: {
          comment: formik.values.comment,
          changeRequestStatusType: formik.values.changeRequestStatusType,
        },
      };
      save(updated);
    },
    validationSchema,
  });

  return (
    <>
      { isConfirming
        && (
          <ChplActionBarConfirmation
            dispatch={handleConfirmation}
            pendingMessage={confirmationMessage}
          />
        )}
      <Card>
        <CardHeader className={classes.cardHeader} title="Edit Change Request" />
        <CardContent>
          <div className={classes.container}>
            <div>
              {getChangeRequestDetails(changeRequest, handleDispatch)}
            </div>
            <div className={classes.actionContainer}>
              <Divider className={classes.actionDivider} orientation="vertical" />
              <div className={classes.actionSubContainer}>
                <Typography variant="subtitle1">Change Request change data</Typography>
                <Typography variant="subtitle2">
                  { changeRequest.certificationBodies.length > 1
                    && (
                      <>
                        This Change Request requires ONC-ACB coordination
                      </>
                    )}
                </Typography>
                <div>
                  <Typography variant="subtitle2">Current status</Typography>
                  <Typography>{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Associated ONC-ACB
                    { changeRequest.certificationBodies.length !== 1 ? 's' : ''}
                  </Typography>
                  { changeRequest.certificationBodies.length > 0
                    ? (
                      <ul>
                        {changeRequest.certificationBodies.map((acb) => (
                          <li key={acb.name}>{acb.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <Typography>
                        None
                      </Typography>
                    )}
                </div>
                {hasAnyRole(['ROLE_DEVELOPER'])
                  ? (
                    <Typography className={classes.fullWidth}>
                      {changeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action'
                      && (
                        <>
                          Status will be set to &quot;Pending ONC-ACB Action&quot;
                        </>
                      )}
                      {changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action'
                      && (
                        <>
                          No status change will occur
                        </>
                      )}
                    </Typography>
                  ) : (
                    <ChplTextField
                      select
                      id="change-request-status-type"
                      name="changeRequestStatusType"
                      label="Select new Status"
                      className={classes.fullWidth}
                      required
                      value={formik.values.changeRequestStatusType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.changeRequestStatusType && !!formik.errors.changeRequestStatusType}
                      helperText={formik.touched.changeRequestStatusType && formik.errors.changeRequestStatusType}
                    >
                      { changeRequestStatusTypes
                        .filter((item) => isOn('attestations-edit')
                                || changeRequest.changeRequestType.name !== 'Developer Attestation Change Request'
                                || item.name !== 'Pending Developer Action')
                        .map((item) => (
                          <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                        ))}
                    </ChplTextField>
                  )}
                <ChplTextField
                  id="comment"
                  name="comment"
                  label="Reason for change"
                  margin="none"
                  className={classes.fullWidth}
                  required={isReasonRequired()}
                  disabled={isReasonDisabled()}
                  multiline
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.comment && !!formik.errors.comment}
                  helperText={formik.touched.comment && formik.errors.comment}
                  rows={4}
                />
              </div>
            </div>
            <ChplActionBar
              dispatch={handleDispatch}
              isDisabled={!formik.isValid || formik.isSubmitting}
              canDelete={hasAnyRole(['ROLE_DEVELOPER'])}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplChangeRequestEdit;

ChplChangeRequestEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
