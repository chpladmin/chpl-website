import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Add, Close, Save,
} from '@material-ui/icons';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { useFetchCertificationStatuses } from 'api/data';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext, UserContext } from 'shared/contexts';

const validationSchema = yup.object({
  certifyingBody: yup.string()
    .required('ONC-ACB is required'),
  productCode: yup.string()
    .required('Product Code is required')
    .matches(/^[A-Za-z0-9_]{4}$/, 'Product Code must consist of letters, numbers and/or "_", and be 4 characters long'),
  versionCode: yup.string()
    .required('Version Code is required')
    .matches(/^[A-Za-z0-9_]{2}$/, 'Version Code must consist of letters, numbers and/or "_", and be 2 characters long'),
  icsCode: yup.string()
    .required('Ics Code is required')
    .matches(/^[0-9]{2}$/, 'ICS Code must be a two digit single number from 00 to 99'),
  rwtPlansCheckDate: yup.date()
    .when('rwtPlansUrl', {
      is: (rwtPlansUrl) => !!rwtPlansUrl,
      then: yup.date().required('Real-World Testing Plans Check Date is required'),
      otherwise: yup.date(),
    }),
  rwtPlansUrl: yup.string()
    .url('Improper format (http://www.example.com)'),
  rwtResultsCheckDate: yup.date()
    .when('rwtResultsUrl', {
      is: (rwtResultsUrl) => !!rwtResultsUrl,
      then: yup.date().required('Real-World Testing Results Check Date is required'),
      otherwise: yup.date(),
    }),
  rwtResultsUrl: yup.string()
    .url('Improper format (http://www.example.com)'),
});

const useStyles = makeStyles({
  deleteButton: {
    border: '1px solid #c44f65',
    backgroundColor: '#FFFFFF',
    color: '#c44f65',
    '&:hover': {
      border: '1px solid #853544',
      color: '#853544',
    },
  },
  tooltipText: {
    fontSize: '1.5em!important',
  },
});

function ChplListingEdit({
  dispatch,
  errors,
  warnings,
  isProcessing,
}) {
  const { listing } = useContext(ListingContext);
  const { hasAnyRole } = useContext(UserContext);
  const [statuses, setStatuses] = useState([]);
  const [addingStatus, setAddingStatus] = useState(false);
  const [statusToAdd, setStatusToAdd] = useState('');
  const [eventDayToAdd, setEventDayToAdd] = useState('');
  const [reasonToAdd, setReasonToAdd] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [acbs, setAcbs] = useState([]);
  const [atls, setAtls] = useState([]);
  const [addingAtl, setAddingAtl] = useState(false);
  const [atlToAdd, setAtlToAdd] = useState('');
  const [selectedAtls, setSelectedAtls] = useState([]);
  const [acknowledgeWarnings, setAcknowledgeWarnings] = useState(false);
  const [acknowledgeBusinessErrors, setAcknowledgeBusinessErrors] = useState(false);
  const { data: statusesData, isLoading: statusesIsLoading, isSuccess: statusesIsSuccess } = useFetchCertificationStatuses();
  const { data: acbsData, isLoading: acbsIsLoading, isSuccess: acbsIsSuccess } = useFetchAcbs();
  const { data: atlsData, isLoading: atlsIsLoading, isSuccess: atlsIsSuccess } = useFetchAtls();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setSelectedAtls(listing.testingLabs.map((atl) => atl.testingLab));
    setSelectedStatuses(listing.certificationEvents);
  }, [listing]);

  useEffect(() => {
    if (statusesIsLoading || !statusesIsSuccess) { return; }
    setStatuses(statusesData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [statusesData, statusesIsLoading, statusesIsSuccess]);

  useEffect(() => {
    if (acbsIsLoading || !acbsIsSuccess) { return; }
    setAcbs(acbsData.acbs.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [acbsData, acbsIsLoading, acbsIsSuccess]);

  useEffect(() => {
    if (atlsIsLoading || !atlsIsSuccess) { return; }
    setAtls(atlsData.atls.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [atlsData, atlsIsLoading, atlsIsSuccess]);

  const handleDispatch = (action) => {
    switch (action) {
      case 'toggleErrorAcknowledgement':
        setAcknowledgeBusinessErrors((prev) => !prev);
        break;
      case 'toggleWarningAcknowledgement':
        setAcknowledgeWarnings((prev) => !prev);
        break;
      case 'cancel':
        dispatch({ action: 'cancel' });
        break;
      case 'save':
        formik.submitForm();
        break;
      // no default
    }
  };

  const addStatus = () => {
    setSelectedStatuses((prev) => prev.concat({
      status: statusToAdd,
      eventDay: eventDayToAdd,
      reason: reasonToAdd,
    }));
    setStatusToAdd('');
    setEventDayToAdd('');
    setReasonToAdd('');
    setAddingStatus(false);
  };

  const removeStatus = ({ status, eventDay }) => {
    setSelectedStatuses((prev) => prev.filter((s) => !(s.status.name === status.name && s.eventDay === eventDay)));
  };

  const addAtl = () => {
    setSelectedAtls((prev) => prev.concat(atlToAdd));
    setAtlToAdd('');
    setAddingAtl(false);
  };

  const removeAtl = (atl) => {
    setSelectedAtls((prev) => prev.filter((a) => a.id !== atl.id));
  };

  const save = () => {
    dispatch({
      action: 'save',
      payload: {
        listing: {
          ...listing,
          certificationEvents: selectedStatuses,
          certifyingBody: acbs.find((acb) => acb.name === formik.values.certifyingBody),
          testingLabs: selectedAtls.map((atl) => ({ testingLab: atl })),
          chplProductNumber: `${listing.chplProductNumber.split('.').slice(0, 4).join('.')}.${formik.values.productCode}.${formik.values.versionCode}.${formik.values.icsCode}.${listing.chplProductNumber.split('.').slice(7).join('.')}`,
          rwtPlansCheckDate: formik.values.rwtPlansCheckDate,
          rwtPlansUrl: formik.values.rwtPlansUrl,
          rwtResultsCheckDate: formik.values.rwtResultsCheckDate,
          rwtResultsUrl: formik.values.rwtResultsUrl,
        },
        acknowledgeWarnings,
        acknowledgeBusinessErrors,
      },
    });
  };

  formik = useFormik({
    initialValues: {
      certifyingBody: listing.certifyingBody.name ?? '',
      productCode: listing.chplProductNumber.split('.')[4],
      versionCode: listing.chplProductNumber.split('.')[5],
      icsCode: listing.chplProductNumber.split('.')[6],
      rwtPlansCheckDate: listing.rwtPlansCheckDate ?? '',
      rwtPlansUrl: listing.rwtPlansUrl ?? '',
      rwtResultsCheckDate: listing.rwtResultsCheckDate ?? '',
      rwtResultsUrl: listing.rwtResultsUrl ?? '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  if (statusesIsLoading || acbsIsLoading || atlsIsLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Edit Listing"
        />
        <CardContent>
          <Box display="flex" padding={4} justifyContent="space-around" gridGap={16} flexDirection="column">
            { /* CHPL Product Number */}
            <Typography variant="h6">
              CHPL Product Number
            </Typography>
            <Box display="flex" justifyContent="space-around" alignItems="baseline" gridGap={8} flexDirection="row">
              <Typography>
                { listing.chplProductNumber.split('.').slice(0, 4).join('.') }
              </Typography>
              <ChplTextField
                id="product-code"
                name="productCode"
                label="Product Code"
                required
                value={formik.values.productCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.productCode && !!formik.errors.productCode}
                helperText={formik.touched.productCode && formik.errors.productCode}
              />
              <ChplTextField
                id="version-code"
                name="versionCode"
                label="Version Code"
                required
                value={formik.values.versionCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.versionCode && !!formik.errors.versionCode}
                helperText={formik.touched.versionCode && formik.errors.versionCode}
              />
              <ChplTextField
                id="ics-code"
                name="icsCode"
                label="ICS Code"
                required
                value={formik.values.icsCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.icsCode && !!formik.errors.icsCode}
                helperText={formik.touched.icsCode && formik.errors.icsCode}
              />
              <Typography>
                { listing.chplProductNumber.split('.').slice(7).join('.') }
              </Typography>
            </Box>
            <Divider />

            { /* Certification Events */}
            <Box display="flex" gridGap={8} flexDirection="column">
              <Typography variant="h6">
                Certification Status
              </Typography>
              <List>
                { selectedStatuses
                  .sort((a, b) => (a.eventDay < b.eventDay ? 1 : -1))
                  .map((status, idx, arr) => (
                    <ListItem
                      style={{
                        marginBottom: '8px', border: '1px solid #c2c6ca', borderRadius: '4px', paddingBottom: '4px',
                      }}
                      key={status.eventDay}
                    >
                      <Box pb={2} flexGrow={1}>
                        {status.status.name}
                        {` on ${getDisplayDateFormat(status.eventDay)}`}
                        {status.reason && ` for ${status.reason}`}
                      </Box>
                      { idx !== arr.length - 1 && status.status.name === arr[idx + 1].status.name && <Typography>Certification Status must differ from previous Status</Typography> }
                      { idx === 0 && (status.status.name === 'Withdrawn by ONC-ACB' || status.status.name === 'Withdrawn by Developer Under Surveillance/Review') && <Typography>Setting this product to this status may trigger a ban by ONC</Typography> }
                      { idx === 0 && status.status.name === 'Terminated by ONC' && <Typography>Setting this product to this status will cause the developer to be marked as &quot;Under Certification Ban&quot;</Typography> }
                      { idx === 0 && status.status.name === 'Suspended by ONC' && <Typography>Setting this product to this status will cause the developer to be marked as &quot;Suspended by ONC&quot;</Typography> }
                      { idx === 0 && status.status.name === 'Withdrawn by Developer' && <Typography>Be sure this product is not under surveillance or soon to be under surveillance, otherwise use the status &quot;Withdrawn by Developer Under Surveillance/Review&quot;</Typography> }
                      <Tooltip className={classes.tooltipText} arrow title="Delete">
                        <IconButton
                          onClick={() => removeStatus(status)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  ))}
              </List>
              { !addingStatus
                && (
                  <div>
                    <Button
                      onClick={() => setAddingStatus(true)}
                      endIcon={<Add />}
                      color="primary"
                      variant="outlined"
                    >
                      Add Certification Status
                    </Button>
                  </div>
                )}
            </Box>
            { addingStatus
              && (
                <>
                  <Box display="flex" justifyContent="space-around" gridGap={8} flexDirection="column">
                    <ChplTextField
                      select
                      id="status"
                      name="status"
                      label="Certification Status"
                      required
                      value={statusToAdd}
                      onChange={(event) => setStatusToAdd(event.target.value)}
                    >
                      {statuses
                        .map((item) => (
                          <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                        ))}
                    </ChplTextField>
                    <ChplTextField
                      id="event-day-to-add"
                      name="eventDayToAdd"
                      label="Effective Date"
                      type="date"
                      required
                      value={eventDayToAdd}
                      onChange={(event) => setEventDayToAdd(event.target.value)}
                    />
                    <ChplTextField
                      id="reson-to-add"
                      name="reasonToAdd"
                      label="Reason"
                      value={reasonToAdd}
                      onChange={(event) => setReasonToAdd(event.target.value)}
                    />
                  </Box>
                  <Box py={2} display="flex" justifyContent="flex-start" gridGap={8} flexDirection="row">
                    <Button
                      onClick={() => addStatus()}
                      disabled={statusToAdd === '' || eventDayToAdd === ''}
                      endIcon={<Save />}
                      color="primary"
                      variant="contained"
                    >
                      Save Certification Status
                    </Button>
                    <Button
                      onClick={() => setAddingStatus(false)}
                      endIcon={<Close />}
                      className={classes.deleteButton}
                      variant="contained"
                    >
                      Cancel adding Certification Status
                    </Button>
                  </Box>
                </>
              )}
            <Divider />

            { /* ACB & ATL */}
            <Box display="flex" gridGap={12} flexDirection="column">
              <Typography variant="h6">
                ONC-ACB
              </Typography>
              { hasAnyRole(['chpl-admin', 'chpl-onc'])
                && (
                  <ChplTextField
                    select
                    id="certifying-body"
                    name="certifyingBody"
                    label="ONC-ACB"
                    required
                    value={formik.values.certifyingBody}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.certifyingBody && !!formik.errors.certifyingBody}
                    helperText={formik.touched.certifyingBody && formik.errors.certifyingBody}
                  >
                    { acbs.map((item) => (
                      <MenuItem
                        value={item.name}
                        key={item.id}
                      >
                        {`${item.name}${item.retired ? ' (Retired)' : ''}`}
                      </MenuItem>
                    ))}
                  </ChplTextField>
                )}
              { hasAnyRole(['chpl-onc-acb'])
                && (
                  <Typography>{listing.certifyingBody.name}</Typography>
                )}
            </Box>
            <Divider />
            <Box pt={4} display="flex" gridGap={8} flexDirection="column">
              <Typography variant="h6">
                ONC-ATL
                { selectedAtls.length !== 1 ? 's' : '' }
              </Typography>
              <List>
                { selectedAtls.map((atl) => (
                  <ListItem
                    style={{
                      marginBottom: '8px', border: '1px solid #c2c6ca', borderRadius: '4px', paddingBottom: '4px',
                    }}
                    key={atl.id}
                  >
                    <Box pb={2} flexGrow={1}>
                      {atl.name}
                    </Box>
                    <Tooltip className={classes.tooltipText} arrow title="Delete">
                      <IconButton
                        onClick={() => removeAtl(atl)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
              { !addingAtl
                && (
                  <div>
                    <Button
                      onClick={() => setAddingAtl(true)}
                      endIcon={<Add />}
                      color="primary"
                      variant="outlined"
                    >
                      Add ONC-ATL
                    </Button>
                  </div>
                )}
              { addingAtl
                && (
                  <>
                    <ChplTextField
                      select
                      id="atl"
                      name="atl"
                      label="ONC-ATL"
                      required
                      value={atlToAdd}
                      onChange={(event) => setAtlToAdd(event.target.value)}
                    >
                      {atls
                        .filter((atl) => !selectedAtls.find((a) => a.id === atl.id))
                        .map((item) => (
                          <MenuItem value={item} key={item.id}>{`${item.name}${item.retired ? ' (Retired)' : ''}`}</MenuItem>
                        ))}
                    </ChplTextField>
                    <Box py={2} display="flex" justifyContent="flex-start" gridGap={8} flexDirection="row">
                      <Button
                        onClick={() => addAtl()}
                        disabled={atlToAdd === ''}
                        endIcon={<Save />}
                        color="primary"
                        variant="contained"
                      >
                        Save ONC-ATL
                      </Button>
                      <Button
                        onClick={() => setAddingAtl(false)}
                        className={classes.deleteButton}
                        endIcon={<Close />}
                      >
                        Cancel adding ONC-ATL
                      </Button>
                    </Box>
                  </>
                )}
            </Box>
            <Divider />

            { /* Real-World Testing */}
            <Box display="flex" pt={4} gridGap={8} flexDirection="column">
              <Typography variant="h6">
                Real World Testing
              </Typography>
              <Box display="flex" pt={2} justifyContent="space-around" gridGap={32} flexDirection="row">
                <ChplTextField
                  id="rwt-plans-url"
                  name="rwtPlansUrl"
                  label="Real-World Testing Plans URL"
                  value={formik.values.rwtPlansUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtPlansUrl && !!formik.errors.rwtPlansUrl}
                  helperText={formik.touched.rwtPlansUrl && formik.errors.rwtPlansUrl}
                />
                <ChplTextField
                  id="rwt-results-url"
                  name="rwtResultsUrl"
                  label="Real-World Testing Results URL"
                  value={formik.values.rwtResultsUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtResultsUrl && !!formik.errors.rwtResultsUrl}
                  helperText={formik.touched.rwtResultsUrl && formik.errors.rwtResultsUrl}
                />
              </Box>
              <Box display="flex" pt={4} justifyContent="space-around" gridGap={32} flexDirection="row">
                <ChplTextField
                  id="rwt-plans-check-date"
                  name="rwtPlansCheckDate"
                  label="Real-World Testing Plans Check Date"
                  type="date"
                  required={formik.values.rwtPlansUrl !== ''}
                  value={formik.values.rwtPlansCheckDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtPlansCheckDate && !!formik.errors.rwtPlansCheckDate}
                  helperText={formik.touched.rwtPlansCheckDate && formik.errors.rwtPlansCheckDate}
                />
                <ChplTextField
                  id="rwt-results-check-date"
                  name="rwtResultsCheckDate"
                  label="Real-World Testing Results Check Date"
                  type="date"
                  required={formik.values.rwtResultsUrl !== ''}
                  value={formik.values.rwtResultsCheckDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtResultsCheckDate && !!formik.errors.rwtResultsCheckDate}
                  helperText={formik.touched.rwtResultsCheckDate && formik.errors.rwtResultsCheckDate}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        errors={errors}
        warnings={warnings}
        isProcessing={isProcessing}
        showErrorAcknowledgement={errors.length > 0}
        showWarningAcknowledgement={warnings.length > 0}
      />
    </>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
  isProcessing: bool,
};

ChplListingEdit.defaultProps = {
  errors: [],
  warnings: [],
  isProcessing: false,
};
