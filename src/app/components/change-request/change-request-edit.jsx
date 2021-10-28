import React, { useContext, useState } from 'react';
import {
  MenuItem,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ThemeProvider,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  changeRequest as changeRequestProp,
  changeRequestStatusType,
} from '../../shared/prop-types';
import ChplActionBar from '../action-bar';
import { ChplTextField } from '../util';
import { UserContext } from '../../shared/contexts';

import theme from '../../../app/themes/theme';
import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDetailsEdit from './types/details-edit';
import ChplChangeRequestWebsiteEdit from './types/website-edit';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  crActionContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  crSubActionContainer: {
      display: 'grid',
      gap: '4px',
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
    case 'Developer Details Change Request':
      return (
        <ChplChangeRequestDetailsEdit
          changeRequest={cr}
          dispatch={handleDispatch}
        />
      );
    case 'Website Change Request':
      return (
        <ChplChangeRequestWebsiteEdit
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
  const { hasAnyRole } = useContext(UserContext);
  const [details, setDetails] = useState(props.changeRequest.details);
  const {
    changeRequest,
    changeRequestStatusTypes,
  } = props;
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const getInitialStatusState = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      if (changeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action') {
        return changeRequestStatusTypes.filter((type) => type.name === 'Pending ONC-ACB Action')[0];
      }
      return changeRequestStatusTypes.filter((type) => type.name === 'Pending Developer Action')[0];
    }
    return '';
  };

  const handleUpdate = (data) => {
    switch (changeRequest.changeRequestType.name) {
      case 'Developer Attestation Change Request':
        setDetails({
          ...details,
          attestation: data.attestation,
        });
        break;
      case 'Developer Details Change Request':
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
        });
        break;
      case 'Website Change Request':
        setDetails({
          ...details,
          website: data.website,
        });
        break;
      // no default
    }
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        props.dispatch('close');
        break;
      case 'update':
        handleUpdate(data);
        break;
      case 'save':
        formik.submitForm();
        break;
      // no default
    }
  };

  const isReasonDisabled = () => hasAnyRole(['ROLE_DEVELOPER']) && changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action';

  const isReasonRequired = () => formik.values.changeRequestStatusType?.name === 'Rejected'
    || (formik.values.changeRequestStatusType?.name === 'Pending Developer Action' && !hasAnyRole(['ROLE_DEVELOPER']));

  formik = useFormik({
    initialValues: {
      comment: '',
      changeRequestStatusType: getInitialStatusState(),
    },
    onSubmit: () => {
      const updated = {
        ...changeRequest,
        currentStatus: {
          comment: formik.values.comment,
          changeRequestStatusType: formik.values.changeRequestStatusType,
        },
        details,
      };
      props.dispatch('save', updated);
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <ThemeProvider>
    <Card>
      <CardHeader className={classes.cardHeader} title='Editing Change Request:'>     
      </CardHeader>
      <CardContent>
        <div className={classes.container}>
          <div>
            {getChangeRequestDetails(changeRequest, handleDispatch)}
          </div>
          <div className={classes.crActionContainer}>
            <Divider orientation='vertical' />
            <div className={classes.crSubActionContainer}>
              <Typography gutterBottom variant='subtitle1'>Reason For Change:</Typography>
              <Typography gutterBottom variant='subtitle2'>Current status:</Typography>
              <Typography>{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
              {hasAnyRole(['ROLE_DEVELOPER'])
                ? (
                  <Typography gutterBottom>
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
                )
                : (
                  <ChplTextField
                    select
                    id="change-request-status-type"
                    name="changeRequestStatusType"
                    label="Change Status"
                    required
                    value={formik.values.changeRequestStatusType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.changeRequestStatusType && !!formik.errors.changeRequestStatusType}
                    helperText={formik.touched.changeRequestStatusType && formik.errors.changeRequestStatusType}
                  >
                    {changeRequestStatusTypes.map((item) => (
                      <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                    ))}
                  </ChplTextField>
                )}
              <br />
              <Typography gutterBottom variant='subtitle2'>Reason for change:</Typography>
              <ChplTextField
                id="comment"
                name="comment"
                label="Comment"
                margin="none"
                required
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
            isDisabled={!formik.isValid}
          />
        </div>
      </CardContent>
    </Card>
    </ThemeProvider>
  );
}

export default ChplChangeRequestEdit;

ChplChangeRequestEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  changeRequestStatusTypes: arrayOf(changeRequestStatusType).isRequired,
  dispatch: func.isRequired,
};
