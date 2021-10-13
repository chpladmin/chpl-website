import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import Moment from 'react-moment';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { getAngularService } from '../../services/angular-react-helper';
import {
  changeRequest as changeRequestProp,
  changeRequestStatusType,
} from '../../shared/prop-types';
import ChplActionBar from '../action-bar';
import { ChplTextField } from '../util';

import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDetailsEdit from './types/details-edit';
import ChplChangeRequestWebsiteEdit from './types/website-edit';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '8px',
  },
});

const validationSchema = yup.object({
  comment: yup.string()
    .test('conditionallyRequired',
          'Reason for Change is required',
          (value, context) => (!!value || (context.parent.changeRequestStatus?.name !== 'Rejected' && context.parent.changeRequestStatus?.name !== 'Pending Developer Action') )),
  changeRequestStatus: yup.object()
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

const getInitials = (name) => name.split(' ').map((c) => c.substring(0, 1).toUpperCase()).join('');

function ChplChangeRequestEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const [details, setDetails] = useState(props.changeRequest.details);
  const { changeRequestStatusTypes } = props;
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

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
  }

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
  }

  formik = useFormik({
    initialValues: {
      comment: '',
      changeRequestStatus: '',
    },
    onSubmit: () => {
      console.log('saving', formik.values, details);
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <div className={classes.container}>
      <div>
        {getChangeRequestDetails(changeRequest, handleDispatch)}
      </div>
      <div>
        <ChplTextField
          id="comment"
          name="comment"
          label="Reason for Change"
          required
          multiline
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comment && !!formik.errors.comment}
          helperText={formik.touched.comment && formik.errors.comment}
        />
        Current status: {changeRequest.currentStatus.changeRequestStatusType.name}
        <ChplTextField
          select
          id="change-request-status"
          name="changeRequestStatus"
          label="Change Status"
          required
          value={formik.values.changeRequestStatus}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.changeRequestStatus && !!formik.errors.changeRequestStatus}
          helperText={formik.touched.changeRequestStatus && formik.errors.changeRequestStatus}
        >
          { changeRequestStatusTypes.map((item) => (
            <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
          ))}
        </ChplTextField>
      </div>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid}
      />
    </div>
  );
}

export default ChplChangeRequestEdit;

ChplChangeRequestEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  changeRequestStatusTypes: arrayOf(changeRequestStatusType).isRequired,
  dispatch: func.isRequired,
};
