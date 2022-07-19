import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import Moment from 'react-moment';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import ChplChangeRequestHistory from './change-request-history';
import ChplChangeRequestAttestationView from './types/attestation-view';
import ChplChangeRequestDemographicsView from './types/demographics-view';
import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDemographicsEdit from './types/demographics-edit';

import {
  useFetchChangeRequest,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
} from 'api/change-requests';
import ChplActionBarConfirmation from 'components/action-bar/action-bar-confirmation';
import { ChplActionBar } from 'components/action-bar';
import { ChplAvatar, ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { FlagContext, UserContext } from 'shared/contexts';
import { changeRequest as changeRequestProp } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  productCard: {
    paddingBottom: '8px',
  },
  cardHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 11fr',
    padding: '16px',
    gap: '16px',
    alignItems: 'end',
    backgroundColor: '#f5f9fd',
  },
  cardSubHeaderContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    alignItems: 'start',
    padding: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(256px, 1fr))',
    },
  },
  actionsContainer: {
    alignContent: 'flex-start',
    display: 'grid',
    gap: '8px',
  },
  actionSubContainer: {
    display: 'grid',
    gap: '16px',
    alignContent: 'flex-start',
    gridTemplateColumns: '1fr 1fr',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
  },
  subContent: {
    display: 'grid',
    gap: '8px',
  },
  activeStatus: {
    color: '#66926d',
    marginLeft: '4px',
  },
  cardContentContainer: {
    padding: '16px',
  },
  cardContentChangeRequest: {
    gridTemplateColumns: '1fr',
    display: 'grid',
    gap: '8px',
    paddingBottom: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  cardHeader: {
    fontWeight: '600',
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

const getChangeRequestViewDetails = (cr) => {
  switch (cr.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return (
        <ChplChangeRequestAttestationView
          changeRequest={cr}
        />
      );
    case 'Developer Demographics Change Request':
      return (
        <ChplChangeRequestDemographicsView
          changeRequest={cr}
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

const getChangeRequestEditDetails = (cr, handleDispatch) => {
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

function ChplChangeRequest(props) {
  const $state = getAngularService('$state');
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { changeRequest: { id } } = props;
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequestStatusTypes, setChangeRequestStatusTypes] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [details, setDetails] = useState();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isSuccess } = useFetchChangeRequest({ id });
  const crstQuery = useFetchChangeRequestStatusTypes();
  const { mutate } = usePutChangeRequest();
  const classes = useStyles();

  let formik;
  let save;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setChangeRequest({
      ...data,
    });
    setDetails(data.details);
    if (data.certificationBodies.length > 1 && hasAnyRole(['ROLE_ACB'])) {
      setConfirmationMessage('All associated ONC-ACBs must be consulted regarding this change. Will you ensure this happens?');
      setIsConfirming(true);
    }
  }, [data, isLoading, isSuccess, hasAnyRole]);

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

  const canEdit = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester';
    }
    return changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester'
      && changeRequest.currentStatus.changeRequestStatusType.name !== 'Pending Developer Action';
  };

  const canWithdraw = () => hasAnyRole(['ROLE_DEVELOPER'])
        && isOn('attestations-edit')
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Rejected'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Accepted'
        && changeRequest.currentStatus.changeRequestStatusType.name !== 'Cancelled by Requester'
        && changeRequest.changeRequestType.name === 'Developer Attestation Change Request';

  const editCr = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])
        && changeRequest.changeRequestType.name === 'Developer Attestation Change Request'
        && isOn('attestations-edit')) {
      $state.go('organizations.developers.developer.attestation.edit', { changeRequest });
    } else {
      setIsEditing(true);
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

  const handleWithdrawal = () => {
    if (canWithdraw()) {
      const payload = {
        ...changeRequest,
        currentStatus: {
          changeRequestStatusType: { id: 5, name: 'Cancelled by Requester' },
          comment: '',
        },
      };
      save(payload);
    } else {
      formik.values.changeRequestStatusType = changeRequestStatusTypes.find((type) => type.name === 'Cancelled by Requester');
      formik.submitForm();
    }
  };

  const handleUpdate = (payload) => {
    switch (changeRequest.changeRequestType.name) {
      case 'Developer Attestation Change Request':
        setDetails({
          ...details,
          attestation: payload.attestation,
        });
        break;
      case 'Developer Demographics Change Request':
        setDetails({
          ...details,
          address: {
            line1: payload.line1,
            line2: payload.line2,
            city: payload.city,
            state: payload.state,
            zipcode: payload.zipcode,
            country: payload.country,
          },
          contact: {
            fullName: payload.fullName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            title: payload.title,
          },
          selfDeveloper: payload.selfDeveloper,
          website: payload.website,
        });
        break;
        // no default
    }
  };

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        props.dispatch('close');
        break;
      case 'edit':
        editCr();
        break;
      case 'update':
        handleUpdate(payload);
        break;
      case 'save':
        if (changeRequest.certificationBodies.length > 1 && hasAnyRole(['ROLE_ACB'])) {
          setConfirmationMessage('All associated ONC-ACBs have been consulted regarding this change');
          setIsConfirming(true);
        } else {
          formik.submitForm();
        }
        break;
      case 'withdraw':
        handleWithdrawal();
        break;
        // no default
    }
  };

  const isReasonDisabled = () => hasAnyRole(['ROLE_DEVELOPER']) && changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action';

  const isReasonRequired = () => formik.values.changeRequestStatusType?.name === 'Rejected'
        || (formik.values.changeRequestStatusType?.name === 'Pending Developer Action' && !hasAnyRole(['ROLE_DEVELOPER']));

  save = (request) => {
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

  if (!changeRequest) {
    return <CircularProgress />;
  }

  return (
    <>
      { isConfirming
        && (
          <ChplActionBarConfirmation
            dispatch={handleConfirmation}
            pendingMessage={confirmationMessage}
          />
        )}
      <Card className={classes.productCard}>
        <CardContent className={classes.cardContentContainer}>
          <div className={classes.cardHeaderContainer}>
            <ChplAvatar
              text={changeRequest.developer.name}
            />
            <Typography gutterBottom className={classes.cardHeader} variant="h4">
              { isEditing ? 'Edit ' : '' }
              {changeRequest.changeRequestType.name}
            </Typography>
          </div>
          <div className={classes.cardSubHeaderContainer}>
            <div>
              <Typography gutterBottom variant="subtitle2">Developer:</Typography>
              <Typography variant="body1">{changeRequest.developer.name}</Typography>
            </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Creation Date:</Typography>
              <Typography variant="body1">{getDisplayDateFormat(changeRequest.submittedDate)}</Typography>
            </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Request Status:</Typography>
              <Typography variant="body1">{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
            </div>
            <div>
              <Typography gutterBottom variant="subtitle2">Time Since Last Status Change:</Typography>
              <Typography variant="body1">
                <Moment
                  withTitle
                  titleFormat="DD MMM yyyy"
                  fromNow
                >
                  {changeRequest.currentStatus.statusChangeDate}
                </Moment>
              </Typography>
            </div>
            <div>
              <Typography gutterBottom variant="subtitle2">
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
                  <Typography variant="body1">
                    None
                  </Typography>
                )}
            </div>
          </div>
          <Divider />
          { !isEditing
            && (
              <div>
                { getChangeRequestViewDetails(changeRequest) }
              </div>
            )}
          { isEditing
            && (
              <div className={classes.cardContentChangeRequest}>
                <div>
                  { getChangeRequestEditDetails(changeRequest, handleDispatch) }
                </div>
                <div className={classes.actionsContainer}>
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
              </div>
            )}
          <ChplChangeRequestHistory
            changeRequest={changeRequest}
          />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        canEdit={!isEditing && canEdit()}
        canWithdraw={(!isEditing && canWithdraw()) || (isEditing && hasAnyRole(['ROLE_DEVELOPER']))}
        canClose={!isEditing}
        canCancel={isEditing}
        canSave={isEditing}
      />
    </>
  );
}

export default ChplChangeRequest;

ChplChangeRequest.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
