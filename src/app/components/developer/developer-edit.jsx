import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { bool, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    rowGap: '8px',
    columnGap: '16px',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'start',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
}));

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
        .required('Developer Status is required'),
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

function ChplDeveloperEdit(props) {
  const DateUtil = getAngularService('DateUtil');
  const {
    developer,
    dispatch,
    isSplitting,
  } = props;
  const [errors, setErrors] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [statusEvents, setStatusEvents] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setStatusEvents(props.developer.statusEvents);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setIsInvalid(props.isInvalid);
  }, [props.isInvalid]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    if (!statusEvents || statusEvents.length === 0) {
      setErrors(['Developer must have at least one Status']);
      return;
    }
    const msgs = [];
    statusEvents
      .sort((a, b) => a.statusDate - b.statusDate)
      .forEach((status, idx, arr) => {
        if (idx === 0) {
          if (status.status.status !== 'Active') {
            msgs.push('The first Developer Status must be "Active"');
          }
        } else {
          if (status.status.status === arr[idx - 1].status.status) {
            msgs.push('Developer Status may not repeat');
          }
          if (DateUtil.getDisplayDateFormat(status.statusDate) === DateUtil.getDisplayDateFormat(arr[idx - 1].statusDate)) {
            msgs.push('Only one change of status allowed per day');
          }
        }
      });
    setErrors(msgs);
  }, [DateUtil, statusEvents]);

  const cancel = () => {
    dispatch('cancel');
  };

  const save = () => {
    const updatedDeveloper = {
      ...developer,
      name: formik.values.name,
      selfDeveloper: formik.values.selfDeveloper,
      statusEvents,
      contact: {
        fullName: formik.values.fullName,
        title: formik.values.title,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      },
      address: {
        line1: formik.values.line1,
        line2: formik.values.line2,
        city: formik.values.city,
        state: formik.values.state,
        zipcode: formik.values.zipcode,
        country: formik.values.country,
      },
      website: formik.values.website,
    };
    dispatch('save', updatedDeveloper);
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

  const addStatus = () => {
    setStatusEvents([
      ...statusEvents,
      {
        status: { status: formik.values.status },
        statusDate: (new Date(formik.values.statusDate)).getTime(),
        reason: formik.values.reason,
      },
    ]);
    formik.setFieldValue('isAdding', false);
    formik.setFieldValue('status', '');
    formik.setFieldValue('statusDate', '');
    formik.setFieldValue('reason', '');
  };

  const isAddDisabled = () => !!formik.errors.status || !!formik.errors.statusDate || !!formik.errors.reason;

  const cancelAdd = () => {
    formik.setFieldValue('isAdding', false);
    formik.setFieldValue('status', '');
    formik.setFieldValue('statusDate', '');
    formik.setFieldValue('reason', '');
  };

  const removeStatus = (status) => {
    setStatusEvents(statusEvents.filter((item) => item.statusDate !== status.statusDate));
  };

  const isActionDisabled = () => isInvalid || errors.length > 0 || !formik.isValid;

  formik = useFormik({
    initialValues: {
      name: developer.name || '',
      selfDeveloper: !!developer.selfDeveloper,
      status: '',
      statusDate: '',
      reason: '',
      isAdding: false,
      fullName: developer.contact?.fullName || '',
      title: developer.contact?.title || '',
      email: developer.contact?.email || '',
      phoneNumber: developer.contact?.phoneNumber || '',
      line1: developer.address?.line1 || '',
      line2: developer.address?.line2 || '',
      city: developer.address?.city || '',
      state: developer.address?.state || '',
      zipcode: developer.address?.zipcode || '',
      country: developer.address?.country || '',
      website: developer.website || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader
          title={isSplitting ? 'New Developer' : `Edit ${developer.name}`}
        />
        <CardContent className={classes.content}>
          <ChplTextField
            id="name"
            name="name"
            label="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <FormControlLabel
            control={(
              <Switch
                id="self-developer"
                name="selfDeveloper"
                color="primary"
                checked={formik.values.selfDeveloper}
                onChange={formik.handleChange}
              />
            )}
            label="Self-Developer"
          />
          <TableContainer className={classes.fullWidth} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="body2">Developer Status</Typography></TableCell>
                  <TableCell><Typography variant="body2">Change Date</Typography></TableCell>
                  <TableCell><Typography variant="body2">Reason</Typography></TableCell>
                  <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { statusEvents
                  ?.sort((a, b) => b.statusDate - a.statusDate)
                  .map((status) => (
                    <TableRow key={status.id || status.statusDate}>
                      <TableCell>
                        <Typography variant="body2">{ status.status.status }</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{ DateUtil.getDisplayDateFormat(status.statusDate) }</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{ status.reason }</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => removeStatus(status)}
                          aria-label="Remove status"
                          disabled={formik.values.isAdding}
                        >
                          <CloseIcon
                            color="primary"
                            size="small"
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          { !formik.values.isAdding
            && (
              <Button
                className={classes.fullWidth}
                color="primary"
                variant="outlined"
                onClick={() => formik.setFieldValue('isAdding', true)}
                id="certification-status-add-item"
              >
                Add item
                {' '}
                <AddIcon />
              </Button>
            )}
          { formik.values.isAdding
            && (
              <>
                <ChplTextField
                  select
                  id="status"
                  name="status"
                  label="Developer Status"
                  required
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && !!formik.errors.status}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem key="Active" value="Active">Active</MenuItem>
                  <MenuItem key="Suspended by ONC" value="Suspended by ONC">Suspended by ONC</MenuItem>
                  <MenuItem key="Under certification ban by ONC" value="Under certification ban by ONC">Under certification ban by ONC</MenuItem>
                </ChplTextField>
                <ChplTextField
                  type="date"
                  id="change-date"
                  name="statusDate"
                  label="Change Date"
                  required
                  value={formik.values.statusDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.statusDate && !!formik.errors.statusDate}
                  helperText={formik.touched.statusDate && formik.errors.statusDate}
                />
                <ChplTextField
                  className={classes.fullWidth}
                  id="reason"
                  name="reason"
                  label="Reason"
                  required={formik.values.status === 'Under certification ban by ONC'}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.reason && !!formik.errors.reason}
                  helperText={formik.touched.reason && formik.errors.reason}
                />
                <ButtonGroup
                  color="primary"
                  className={classes.fullWidth}
                >
                  <Button
                    onClick={addStatus}
                    aria-label="Confirm adding item"
                    id="certification-status-add-item"
                    disabled={isAddDisabled()}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    onClick={cancelAdd}
                    aria-label="Cancel adding item"
                    id="certification-status-close-item"
                  >
                    <CloseIcon />
                  </Button>
                </ButtonGroup>
              </>
            )}
          <ChplTextField
            id="full-name"
            name="fullName"
            label="Full Name"
            required
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && !!formik.errors.fullName}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <ChplTextField
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.touched.title && formik.errors.title}
          />
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <ChplTextField
            id="phone-number"
            name="phoneNumber"
            label="Phone"
            required
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <ChplTextField
            id="line1"
            name="line1"
            label="Address"
            required
            value={formik.values.line1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.line1 && !!formik.errors.line1}
            helperText={formik.touched.line1 && formik.errors.line1}
          />
          <ChplTextField
            id="line2"
            name="line2"
            label="Line 2"
            value={formik.values.line2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.line2 && !!formik.errors.line2}
            helperText={formik.touched.line2 && formik.errors.line2}
          />
          <ChplTextField
            id="city"
            name="city"
            label="City"
            required
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && !!formik.errors.city}
            helperText={formik.touched.city && formik.errors.city}
          />
          <ChplTextField
            id="state"
            name="state"
            label="State"
            required
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.state && !!formik.errors.state}
            helperText={formik.touched.state && formik.errors.state}
          />
          <ChplTextField
            id="zipcode"
            name="zipcode"
            label="Zip"
            required
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zipcode && !!formik.errors.zipcode}
            helperText={formik.touched.zipcode && formik.errors.zipcode}
          />
          <ChplTextField
            id="country"
            name="country"
            label="Country"
            required
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && !!formik.errors.country}
            helperText={formik.touched.country && formik.errors.country}
          />
          <ChplTextField
            id="website"
            name="website"
            label="Website"
            required
            className={classes.fullWidth}
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.website && !!formik.errors.website}
            helperText={formik.touched.website && formik.errors.website}
          />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={isActionDisabled()}
        errors={errors}
      />
    </>
  );
}

export default ChplDeveloperEdit;

ChplDeveloperEdit.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  isInvalid: bool.isRequired,
  isSplitting: bool.isRequired,
};
