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
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';
import { theme } from 'themes';

const useStyles = makeStyles({
});

const validationSchema = yup.object({
  certifyingBody: yup.object()
    .required('ONC-ACB is required'),
  productCode: yup.string()
    .required('Product Code is required'), // add regex
  versionCode: yup.string()
    .required('Version Code is required'), // add regex
  icsCode: yup.string()
    .required('Ics Code is required'), // add regex
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
  /*
  receivedDate: yup.date()
    .required('Received Date is required'),
  closedDate: yup.date()
    .min(yup.ref('receivedDate'), 'Closed Date must be after Received Date')
    .max(new Date(), 'Closed Date must not be in the future'),
  acbComplaintId: yup.string()
    .required('ONC-ACB Complaint ID is required'),
  complainantType: yup.object()
    .required('Complainant Type is required'),
  complainantTypeOther: yup.string()
    .test('conditionallyRequired',
      'Complainant Type - Other Description is required',
      (value, context) => (!!value || context.parent.complainantType?.name !== 'Other')),
  summary: yup.string()
    .required('Complaint Summary is required'),
  actions: yup.string()
    .when('closedDate', {
      is: (closedDate) => closedDate,
      then: yup.string().required('Actions/Response is required.'),
      otherwise: yup.string(),
    }),
    */
});

function ChplListingEdit({ dispatch, errors }) {
  const { listing } = useContext(ListingContext);
  const [acbs, setAcbs] = useState([]);
  const [atls, setAtls] = useState([]);
  const [addingAtl, setAddingAtl] = useState(false);
  const [atlToAdd, setAtlToAdd] = useState('');
  const [selectedAtls, setSelectedAtls] = useState([]);
  const { data: acbsData, isLoading: acbsIsLoading, isSuccess: acbsIsSuccess } = useFetchAcbs(true);
  const { data: atlsData, isLoading: atlsIsLoading, isSuccess: atlsIsSuccess } = useFetchAtls(true);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setSelectedAtls(listing.testingLabs.map((atl) => atl.testingLab));
  }, [listing]);

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
        certifyingBody: formik.values.certifyingBody,
        testingLabs: selectedAtls.map((atl) => ({ testingLab: atl })),
        chplProductNumber: `${listing.chplProductNumber.split('.').slice(0, 4).join('.')}.${formik.values.productCode}.${formik.values.versionCode}.${formik.values.icsCode}.${listing.chplProductNumber.split('.').slice(8).join('.')}`,
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

  if (acbsIsLoading || atlsIsLoading) {
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
      />
    </>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
};

ChplListingEdit.defaultProps = {
  errors: [],
};
