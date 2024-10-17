import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { arrayOf, bool, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { useFetchCertificationStatuses } from 'api/data';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext, UserContext } from 'shared/contexts';

const validationSchema = yup.object({
  certifyingBody: yup.object()
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

function ChplListingEdit({ dispatch, errors, warnings, isProcessing }) {
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
  const { data: statusesData, isLoading: statusesIsLoading, isSuccess: statusesIsSuccess } = useFetchCertificationStatuses();
  const { data: acbsData, isLoading: acbsIsLoading, isSuccess: acbsIsSuccess } = useFetchAcbs();
  const { data: atlsData, isLoading: atlsIsLoading, isSuccess: atlsIsSuccess } = useFetchAtls();
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
    formik.setFieldValue('certifyingBody', acbsData.acbs.find((acb) => acb.id === listing?.certifyingBody?.id));
  }, [acbsData, acbsIsLoading, acbsIsSuccess, listing]);

  useEffect(() => {
    if (atlsIsLoading || !atlsIsSuccess) { return; }
    setAtls(atlsData.atls.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [atlsData, atlsIsLoading, atlsIsSuccess]);

  const handleDispatch = (action) => {
    switch (action) {
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
        ...listing,
        certificationEvents: selectedStatuses,
        certifyingBody: formik.values.certifyingBody,
        testingLabs: selectedAtls.map((atl) => ({ testingLab: atl })),
        chplProductNumber: `${listing.chplProductNumber.split('.').slice(0, 4).join('.')}.${formik.values.productCode}.${formik.values.versionCode}.${formik.values.icsCode}.${listing.chplProductNumber.split('.').slice(7).join('.')}`,
        rwtPlansCheckDate: formik.values.rwtPlansCheckDate,
        rwtPlansUrl: formik.values.rwtPlansUrl,
        rwtResultsCheckDate: formik.values.rwtResultsCheckDate,
        rwtResultsUrl: formik.values.rwtResultsUrl,
      },
    });
  };

  formik = useFormik({
    initialValues: {
      certifyingBody: '',
      productCode: listing.chplProductNumber.split('.')[4],
      versionCode: listing.chplProductNumber.split('.')[5],
      icsCode: listing.chplProductNumber.split('.')[6],
      rwtPlansCheckDate: listing.rwtPlansCheckDate || '',
      rwtPlansUrl: listing.rwtPlansUrl || '',
      rwtResultsCheckDate: listing.rwtResultsCheckDate || '',
      rwtResultsUrl: listing.rwtResultsUrl || '',
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

          { /* CHPL Product Number */ }
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

          { /* Certification Events */ }
          <Typography>
            Certification Status
          </Typography>
          <List>
            { selectedStatuses
              .sort((a, b) => (a.eventDay < b.eventDay ? 1 : -1))
              .map((status, idx, arr) => (
                <ListItem key={status.eventDay}>
                  { status.status.name }
                  { ` on ${getDisplayDateFormat(status.eventDay)}` }
                  { status.reason && ` for ${status.reason}` }
                  <Button
                    onClick={() => removeStatus(status)}
                  >
                    Remove Certification Status
                  </Button>
                  { idx !== arr.length - 1 && status.status.name === arr[idx + 1].status.name && <Typography>Certification Status must differ from previous Status</Typography> }
                  { idx === 0 && (status.status.name === 'Withdrawn by ONC-ACB' || status.status.name === 'Withdrawn by Developer Under Surveillance/Review') && <Typography>Setting this product to this status may trigger a ban by ONC</Typography> }
                  { idx === 0 && status.status.name === 'Terminated by ONC' && <Typography>Setting this product to this status will cause the developer to be marked as &quot;Under Certification Ban&quot;</Typography> }
                  { idx === 0 && status.status.name === 'Suspended by ONC' && <Typography>Setting this product to this status will cause the developer to be marked as &quot;Suspended by ONC&quot;</Typography> }
                  { idx === 0 && status.status.name === 'Withdrawn by Developer' && <Typography>Be sure this product is not under surveillance or soon to be under surveillance, otherwise use the status &quot;Withdrawn by Developer Under Surveillance/Review&quot;</Typography> }
                </ListItem>
              ))}
          </List>
          { !addingStatus
            && (
              <Button
                onClick={() => setAddingStatus(true)}
              >
                Add Certification Status
              </Button>
            )}
          { addingStatus
            && (
              <>
                <ChplTextField
                  select
                  id="status"
                  name="status"
                  label="Certification Status"
                  required
                  value={statusToAdd}
                  onChange={(event) => setStatusToAdd(event.target.value)}
                >
                  { statuses
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
                <Button
                  onClick={() => addStatus()}
                  disabled={statusToAdd === '' || eventDayToAdd === ''}
                >
                  Add Certification Status
                </Button>
                <Button
                  onClick={() => setAddingStatus(false)}
                >
                  Cancel adding Certification Status
                </Button>
              </>
            )}

          { /* ACB & ATL */ }
          <Typography>
            ONC-ACB
          </Typography>
          { hasAnyRole(['chpl-admin', 'chpl-onc'])
            && (
              <ChplTextField
                select
                id="acb"
                name="acb"
                label="ONC-ACB"
                required
                value={formik.values.certifyingBody}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.certifyingBody && !!formik.errors.certifyingBody}
                helperText={formik.touched.certifyingBody && formik.errors.certifyingBody}
              >
                { acbs.map((item) => (
                  <MenuItem value={item} key={item.id}>{`${item.name}${item.retired ? ' (Retired)' : ''}`}</MenuItem>
                ))}
              </ChplTextField>
            )}
          { hasAnyRole(['chpl-onc-acb'])
            && (
              <Typography>{ listing.certifyingBody.name }</Typography>
            )}
          <Typography>
            ONC-ATL
            { selectedAtls.length !== 1 ? 's' : '' }
          </Typography>
          <List>
            { selectedAtls.map((atl) => (
              <ListItem key={atl.id}>
                { atl.name }
                <Button
                  onClick={() => removeAtl(atl)}
                >
                  Remove ONC-ATL
                </Button>
              </ListItem>
            ))}
          </List>
          { !addingAtl
            && (
              <Button
                onClick={() => setAddingAtl(true)}
              >
                Add ONC-ATL
              </Button>
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
                  { atls
                    .filter((atl) => !selectedAtls.find((a) => a.id === atl.id))
                    .map((item) => (
                      <MenuItem value={item} key={item.id}>{`${item.name}${item.retired ? ' (Retired)' : ''}`}</MenuItem>
                    ))}
                </ChplTextField>
                <Button
                  onClick={() => addAtl()}
                  disabled={atlToAdd === ''}
                >
                  Add ONC-ATL
                </Button>
                <Button
                  onClick={() => setAddingAtl(false)}
                >
                  Cancel adding ONC-ATL
                </Button>
              </>
            )}

          { /* Real-World Testing Plans */ }
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
