import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Container,
  Divider,
  MenuItem,
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
  object,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchDevelopers } from 'api/developer';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
  header: {
    margin: '0',
    fontSize: '1.25em',
  },
  owners: {
    display: 'flex',
    flexDirection: 'column',
    padding: ' 8px',
    gap: '8px',
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
  owner: yup.string()
    .when('isAdding', {
      is: true,
      then: yup.string()
        .required('Developer is required'),
    }),
  transferDay: yup.date()
    .when('isAdding', {
      is: true,
      then: yup.date()
        .required('Transfer Date is required'),
    }),
  fullName: yup.string()
    .max(500, 'Full Name is too long'),
  email: yup.string()
    .email('Improper format (sample@example.com)')
    .max(250, 'Email is too long'),
  phoneNumber: yup.string()
    .max(100, 'Phone is too long'),
  code: yup.string()
    .length(4, 'Product Code must be exactly four characters')
    .matches(/^[A-Za-z0-9_]*$/, 'Product Code must contain only the characters A-Z, a-z, 0-9, and _'),
});

const getEditField = ({
  key,
  display,
  formik,
  required = false,
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

function ChplProductEdit(props) {
  const {
    product,
    dispatch,
    errorMessages: initialErrorMessages,
    isInvalid: initialIsInvalid,
    isProcessing,
    isSplitting,
  } = props;
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { data, isLoading } = useFetchDevelopers();
  const [developers, setDevelopers] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [owners, setOwners] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading) { return; }
    setDevelopers(data);
  }, [data, isLoading]);

  useEffect(() => {
    setOwners(product.ownerHistory);
  }, [product]);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  useEffect(() => {
    setErrorMessages(initialErrorMessages);
  }, [initialErrorMessages]);

  const cancel = () => {
    eventTrack({
      ...analytics,
      event: 'Cancel Product Edit',
    });
    dispatch('cancel');
  };

  const getEnhancedEditField = (editProps) => getEditField({
    ...editProps,
    formik,
  });

  const save = () => {
    const updatedProduct = {
      ...product,
      name: formik.values.name,
      code: formik.values.code,
      ownerHistory: owners,
      contact: {
        ...product.contact,
        fullName: formik.values.fullName,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      },
    };
    dispatch('save', updatedProduct);
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
      owner: '',
      transferDay: '',
    });
  };

  const addOwner = () => {
    setOwners([
      ...owners,
      {
        developer: developers.find((d) => d.id === formik.values.owner),
        transferDay: formik.values.transferDay,
      },
    ]);
    cancelAdd();
  };

  const getKey = (owner) => `${owner.id}-${owner.transferDay}`;

  const isActionDisabled = () => isInvalid || !formik.isValid;

  const isAddDisabled = () => !!formik.errors.owner || !!formik.errors.transferDay;

  const removeOwner = (owner) => {
    setOwners(owners.filter((item) => item.transferDay !== owner.transferDay
      || item.developer.name !== owner.developer.name));
  };

  formik = useFormik({
    initialValues: {
      name: product.name || '',
      owner: '',
      transferDay: '',
      code: '',
      isAdding: false,
      fullName: product.contact?.fullName || '',
      email: product.contact?.email || '',
      phoneNumber: product.contact?.phoneNumber || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <Container disableGutters maxWidth="lg">
      <Card>
        { isSplitting
          && (
            <CardHeader
              title="New Product"
              component="h5"
              className={classes.header}
            />
          )}
        { !isSplitting
          && (
            <CardHeader
              title={product.name}
              className={classes.header}
              component="h2"
            />
          )}
        <CardContent className={classes.content}>
          { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
            && getEnhancedEditField({
              key: 'name', display: 'Name', className: isSplitting ? '' : classes.fullWidthGridRow, required: true,
            })}
          { isSplitting
            && getEnhancedEditField({
              key: 'code', display: 'Product Code', required: true,
            })}
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && !isSplitting
            && (
              <Box className={classes.fullWidthGridRow}>
                <TableContainer className={classes.fullWidthGridRow}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant="body2">Developer</Typography></TableCell>
                        <TableCell><Typography variant="body2">Transfer Date</Typography></TableCell>
                        <TableCell><Typography variant="srOnly">Actions</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {owners
                          ?.sort((a, b) => (a.transferDay < b.transferDay ? 1 : -1))
                          .map((item) => (
                            <TableRow key={getKey(item)}>
                              <TableCell>
                                <Typography variant="body2">{item.developer.name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{getDisplayDateFormat(item.transferDay)}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => removeOwner(item)}
                                  aria-label="Remove owner"
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
                                  id="owner-add-item"
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
                      <Card className={classes.owners}>
                        <ChplTextField
                          select
                          id="owner"
                          name="owner"
                          label="Developer"
                          required
                          value={formik.values.owner}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.owner && !!formik.errors.owner}
                          helperText={formik.touched.owner && formik.errors.owner}
                        >
                          { developers
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((d) => (
                              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                        </ChplTextField>
                        <ChplTextField
                          type="date"
                          id="transfer-day"
                          name="transferDay"
                          label="Transfer Date"
                          required
                          value={formik.values.transferDay}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.transferDay && !!formik.errors.transferDay}
                          helperText={formik.touched.transferDay && formik.errors.transferDay}
                        />
                        <ButtonGroup
                          className={classes.fullWidthGridRow}
                          variant="outlined"
                        >
                          <Button
                            onClick={addOwner}
                            color="primary"
                            variant="contained"
                            aria-label="Confirm adding item"
                            id="owner-add-item"
                            disabled={isAddDisabled()}
                          >
                            <CheckIcon />
                          </Button>
                          <Button
                            className={classes.deleteButtonOutlined}
                            onClick={cancelAdd}
                            aria-label="Cancel adding item"
                            id="owner-close-item"
                          >
                            <CloseIcon />
                          </Button>
                        </ButtonGroup>
                      </Card>
                    )}
              </Box>
            )}
          { !isSplitting && (
            <>
              <Divider className={classes.fullWidthGridRow} />
              { getEnhancedEditField({ key: 'fullName', display: 'Full Name', className: classes.fullWidthGridRow }) }
              { getEnhancedEditField({ key: 'email', display: 'Email' }) }
              { getEnhancedEditField({ key: 'phoneNumber', display: 'Phone' }) }
            </>
          )}
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={isActionDisabled()}
        isProcessing={isProcessing}
        errors={errorMessages}
      />
    </Container>
  );
}

export default ChplProductEdit;

ChplProductEdit.propTypes = {
  product: object.isRequired,
  dispatch: func.isRequired,
  errorMessages: arrayOf(string).isRequired,
  isInvalid: bool.isRequired,
  isProcessing: bool,
  isSplitting: bool.isRequired,
};

ChplProductEdit.defaultProps = {
  isProcessing: false,
};
