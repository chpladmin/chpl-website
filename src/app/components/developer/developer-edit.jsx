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
import { getDisplayDateFormat } from 'services/date-util';
import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  developerChips: {
    margin: '4px',
  },
  developerHeader: {
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
        .required('Developer Status is required'),
    }),
  startDate: yup.date()
    .when('isAdding', {
      is: true,
      then: yup.date()
        .max(new Date(), 'Start Date must not be in the future')
        .required('Start Date is required'),
    }),
  endDate: yup.date()
    .when('isAdding', {
      is: true,
      then: yup.date()
        .max(new Date(), 'End Date must not be in the future')
        .min(yup.ref('startDate'), 'End Date cannot be before the Start Date'),
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

function ChplDeveloperEdit(props) {
  const {
    developer,
    dispatch,
    errorMessages: initialErrorMessages,
    isInvalid: initialIsInvalid,
    isProcessing,
    isSplitting,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [errorMessages, setErrorMessages] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setStatuses(developer.statuses);
  }, [developer]);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  useEffect(() => {
    setErrorMessages(initialErrorMessages);
  }, [initialErrorMessages]);

  useEffect(() => {
    if (!statuses || statuses.length === 0) { return; }
    const warns = [];
    statuses
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
      .forEach((status, idx) => {
        if (idx === 0) {
          if (status.endDate) {
            warns.push('To comply with the EOA rule, please remember to change the certification status of any listings that have had their suspension or termination rescinded.');
          }
        }
      });
    setWarnings(warns);
  }, [statuses]);

  const cancel = () => {
    dispatch('cancel');
  };

  const getEnhancedEditField = (editProps) => getEditField({
    ...editProps,
    formik,
  });

  const save = () => {
    const updatedDeveloper = {
      ...developer,
      name: formik.values.name,
      selfDeveloper: formik.values.selfDeveloper,
      statuses,
      contact: {
        ...developer.contact,
        fullName: formik.values.fullName,
        title: formik.values.title,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      },
      address: {
        ...developer.address,
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

  const cancelAdd = () => {
    formik.setValues({
      ...formik.values,
      isAdding: false,
      status: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const addStatus = () => {
    setStatuses([
      ...statuses,
      {
        status: { name: formik.values.status },
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        reason: formik.values.reason,
      },
    ]);
    cancelAdd();
  };

  const isAddDisabled = () => !!formik.errors.status || !!formik.errors.startDate || !!formik.errors.reason;

  const removeStatus = (status) => {
    setStatuses(statuses.filter((item) => item.startDate !== status.startDate
        || item.endDate !== status.endDate
        || item.reason !== status.reason
        || item.status.name !== status.status.name));
  };

  const isActionDisabled = () => isInvalid || !formik.isValid;

  formik = useFormik({
    initialValues: {
      name: developer.name || '',
      selfDeveloper: !!developer.selfDeveloper,
      status: '',
      startDate: '',
      endDate: '',
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
      <Container maxWidth="md">
        <Card>
          { isSplitting
          && (
            <CardHeader
              title="New Developer"
              component="h2"
              className={classes.developerHeader}
            />
          )}
          { !isSplitting
          && (
            <CardHeader
              title={developer.name}
              className={classes.developerHeader}
              component="h2"
            />
          )}
          <CardContent className={classes.content}>
            { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
            && getEnhancedEditField({ key: 'name', display: 'Name', className: classes.fullWidth }) }
            <FormControlLabel
              control={(
                <Switch
                  id="self-developer"
                  name="selfDeveloper"
                  color="primary"
                  checked={formik.values.selfDeveloper}
                  onChange={formik.handleChange}
                  className={classes.fullWidth}
                />
            )}
              label="Self-Developer"
            />
            { hasAnyRole(['chpl-admin', 'chpl-onc'])
            && (
              <>
                <TableContainer className={classes.fullWidth}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="body2">Developer Status</Typography></TableCell>
                        <TableCell><Typography variant="body2">Start Date</Typography></TableCell>
                        <TableCell><Typography variant="body2">End Date</Typography></TableCell>
                        <TableCell><Typography variant="body2">Reason</Typography></TableCell>
                        <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { statuses
                        ?.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
                        .map((status) => (
                          <TableRow key={status.id || status.startDate}>
                            <TableCell>
                              <Typography variant="body2">{ status.status.name }</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{ getDisplayDateFormat(status.startDate) }</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{ getDisplayDateFormat(status.endDate) }</Typography>
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
                                  color="error"
                                  size="small"
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    { !formik.values.isAdding
                      && (
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={4} align="right">
                              <Button
                                className={classes.tableFooterButton}
                                color="secondary"
                                variant="contained"
                                onClick={() => formik.setFieldValue('isAdding', true)}
                                id="certification-status-add-item"
                              >
                                Add item
                                {' '}
                                <AddIcon className={classes.iconSpacing} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      )}
                  </Table>
                </TableContainer>
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
                        <MenuItem key="Suspended by ONC" value="Suspended by ONC">Suspended by ONC</MenuItem>
                        <MenuItem key="Under certification ban by ONC" value="Under certification ban by ONC">Under certification ban by ONC</MenuItem>
                      </ChplTextField>
                      <ChplTextField
                        type="date"
                        id="start-day"
                        name="startDate"
                        label="Start Date"
                        required
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.startDate && !!formik.errors.startDate}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                      />
                      <ChplTextField
                        type="date"
                        id="end-day"
                        name="endDate"
                        label="End Date"
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.endDate && !!formik.errors.endDate}
                        helperText={formik.touched.endDate && formik.errors.endDate}
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
                        className={classes.fullWidth}
                        variant="outlined"
                      >
                        <Button
                          onClick={addStatus}
                          color="primary"
                          variant="contained"
                          aria-label="Confirm adding item"
                          id="certification-status-add-item"
                          disabled={isAddDisabled()}
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          className={classes.errorColor}
                          onClick={cancelAdd}
                          aria-label="Cancel adding item"
                          id="certification-status-close-item"
                        >
                          <CloseIcon />
                        </Button>
                      </ButtonGroup>
                      <Divider className={classes.fullWidth} />
                    </>
                  )}
              </>
            )}
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
          isProcessing={isProcessing}
          errors={errorMessages}
          warnings={warnings}
        />
      </Container>
    </>
  );
}

export default ChplDeveloperEdit;

ChplDeveloperEdit.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  errorMessages: arrayOf(string).isRequired,
  isInvalid: bool.isRequired,
  isProcessing: bool,
  isSplitting: bool.isRequired,
};

ChplDeveloperEdit.defaultProps = {
  isProcessing: false,
};
