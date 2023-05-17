import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { acb as acbPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  organizationChips: {
    margin: '4px',
  },
  organizationHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  table: {
    border: '.5px solid #c2c6ca',
  },
  tableFooterButton: {
    margin: '0 -4px',
    textTransform: 'none',
    fontSize: '1.5em',
  },
  errorColor: {
    color: '#c44f65',
  },
});

const validationSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .max(300, 'Name is too long'),
  isAdding: yup.boolean()
    .required()
    .oneOf([false]),
  status: yup.string()
    .when('isAdding', {
      is: true,
      then: yup.string()
        .required('OncOrganization Status is required'),
    }),
  statusDate: yup.date()
    .when('isAdding', {
      is: true,
      then: yup.date()
        .required('Change Date is required'),
    }),
  reason: yup.string()
    .max(500, 'Reason is too long')
    .when('status', {
      is: 'Under certification ban by ONC',
      then: yup.string()
        .required('Reason is required'),
    }),
  fullName: yup.string()
    .required('Full Name is required')
    .max(500, 'Full Name is too long'),
  title: yup.string()
    .max(250, 'Title is too long'),
  email: yup.string()
    .email('Improper format (sample@example.com)')
    .required('Email is required')
    .max(250, 'Email is too long'),
  phoneNumber: yup.string()
    .required('Phone is required')
    .max(100, 'Phone is too long'),
  line1: yup.string()
    .required('Address is required')
    .max(250, 'Address is too long'),
  line2: yup.string()
    .max(250, 'Line 2 is too long'),
  city: yup.string()
    .required('City is required')
    .max(250, 'City is too long'),
  state: yup.string()
    .required('State is required')
    .max(250, 'State is too long'),
  zipcode: yup.string()
    .required('Zip is required')
    .max(25, 'Zip is too long'),
  country: yup.string()
    .required('Country is required')
    .max(250, 'Country is too long'),
  website: yup.string()
    .url('Improper format (http://www.example.com)')
    .required('Website is required')
    .max(300, 'Website is too long'),
});

const getEditField = ({
  key,
  display,
  formik,
  required = true,
  className,
}) => (
  <div className={className}>
    <ChplTextField
      id={key}
      name={key}
      label={display}
      required={required}
      value={formik.values[key]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched[key] && !!formik.errors[key]}
      helperText={formik.touched[key] && formik.errors[key]}
    />
  </div>
);

function ChplOncOrganizationEdit(props) {
  const {
    organization,
    dispatch,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [errors, setErrors] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [statusEvents, setStatusEvents] = useState([]);
  const classes = useStyles();
  let formik;

  const cancel = () => {
    dispatch('cancel');
  };

  const getEnhancedEditField = (editProps) => getEditField({
    ...editProps,
    formik,
  });

  const save = () => {
    const updatedOncOrganization = {
      ...organization,
      name: formik.values.name,
      selfOncOrganization: formik.values.selfOncOrganization,
      statusEvents,
      contact: {
        ...organization.contact,
        fullName: formik.values.fullName,
        title: formik.values.title,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      },
      address: {
        ...organization.address,
        line1: formik.values.line1,
        line2: formik.values.line2,
        city: formik.values.city,
        state: formik.values.state,
        zipcode: formik.values.zipcode,
        country: formik.values.country,
      },
      website: formik.values.website,
    };
    dispatch('save', updatedOncOrganization);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const cancelAdd = () => {
    formik.setValues({
      ...formik.values,
      isAdding: false,
      status: '',
      statusDate: '',
      reason: '',
    });
  };

  const addStatus = () => {
    setStatusEvents([
      ...statusEvents,
      {
        status: { status: formik.values.status },
        statusDate: (new Date(formik.values.statusDate)).getTime(),
        reason: formik.values.reason,
      },
    ]);
    cancelAdd();
  };

  const isAddDisabled = () => !!formik.errors.status || !!formik.errors.statusDate || !!formik.errors.reason;

  const removeStatus = (status) => {
    setStatusEvents(statusEvents.filter((item) => item.statusDate !== status.statusDate));
  };

  const isActionDisabled = () => isInvalid || errors.length > 0 || !formik.isValid;

  formik = useFormik({
    initialValues: {
      name: organization.name || '',
      selfOncOrganization: !!organization.selfOncOrganization,
      status: '',
      statusDate: '',
      reason: '',
      isAdding: false,
      fullName: organization.contact?.fullName || '',
      title: organization.contact?.title || '',
      email: organization.contact?.email || '',
      phoneNumber: organization.contact?.phoneNumber || '',
      line1: organization.address?.line1 || '',
      line2: organization.address?.line2 || '',
      city: organization.address?.city || '',
      state: organization.address?.state || '',
      zipcode: organization.address?.zipcode || '',
      country: organization.address?.country || '',
      website: organization.website || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <Container maxWidth="md">
        <Card>
          { isSplitting
          && (
            <CardHeader
              title="New OncOrganization"
              component="h2"
              className={classes.organizationHeader}
            />
          )}
          { !isSplitting
          && (
            <CardHeader
              title={organization.name}
              className={classes.organizationHeader}
              component="h2"
            />
          )}
          <CardContent className={classes.content}>
            { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])
            && getEnhancedEditField({ key: 'name', display: 'Name', className: classes.fullWidth }) }
            <Divider className={classes.fullWidth} />
            { getEnhancedEditField({ key: 'fullName', display: 'Full Name' }) }
            { getEnhancedEditField({ key: 'title', display: 'Title', required: false }) }
            { getEnhancedEditField({ key: 'email', display: 'Email' }) }
            { getEnhancedEditField({ key: 'phoneNumber', display: 'Phone' }) }
            <Divider className={classes.fullWidth} />
            { getEnhancedEditField({ key: 'line1', display: 'Address' }) }
            { getEnhancedEditField({ key: 'line2', display: 'Line 2', required: false }) }
            { getEnhancedEditField({ key: 'city', display: 'City' }) }
            { getEnhancedEditField({ key: 'state', display: 'State' }) }
            { getEnhancedEditField({ key: 'zipcode', display: 'Zip' }) }
            { getEnhancedEditField({ key: 'country', display: 'Country' }) }
            <Divider className={classes.fullWidth} />
            { getEnhancedEditField({ key: 'website', display: 'Website', className: classes.fullWidth }) }
          </CardContent>
        </Card>
        <ChplActionBar
          dispatch={handleDispatch}
          isDisabled={isActionDisabled()}
          errors={errorMessages.concat(errors)}
          warnings={warnings}
        />
      </Container>
    </>
  );
}

export default ChplOncOrganizationEdit;

ChplOncOrganizationEdit.propTypes = {
  organization: acbPropType.isRequired,
  dispatch: func.isRequired,
};
