import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSnackbar } from 'notistack';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchAcbs } from 'api/acbs';
import { useDeleteComplaint, usePostComplaint, usePutComplaint } from 'api/complaints';
import { useFetchComplainantTypes, useFetchCriteria } from 'api/data';
import { ChplTextField } from 'components/util';
import { ChplActionBar } from 'components/action-bar';
import { getAngularService } from 'services/angular-react-helper';
import { complaint as complaintPropType, listing as listingPropType } from 'shared/prop-types';
import { theme } from 'themes';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 2fr',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '3fr 4fr 4fr 2fr',
    },
  },
  dataEntry: {
    display: 'grid',
    gap: '16px 8px',
    marginTop: '16px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const validationSchema = yup.object({
  certificationBody: yup.object()
    .required('ONC-ACB is required'),
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
      (value, context) => (!!value || context.parent.complainantType?.name !== 'Other - [Please Describe]')),
  summary: yup.string()
    .required('Complaint Summary is required'),
  actions: yup.string()
    .when('closedDate', {
      is: (closedDate) => closedDate,
      then: yup.string().required('Actions/Response is required.'),
      otherwise: yup.string(),
    }),
});

function ChplComplaintEdit(props) {
  const { mutate: post } = usePostComplaint();
  const { mutate: put } = usePutComplaint();
  const { mutate: remove } = useDeleteComplaint();
  const { data: certificationBodiesData, isLoading: certificationBodiesIsLoading, isSuccess: certificationBodiesIsSuccess } = useFetchAcbs(true);
  const { data: complainantTypesData, isLoading: complainantTypesIsLoading, isSuccess: complainantTypesIsSuccess } = useFetchComplainantTypes();
  const { data: criteriaData, isLoading: criteriaIsLoading, isSuccess: criteriaIsSuccess } = useFetchCriteria();
  const { enqueueSnackbar } = useSnackbar();
  const [complaint, setComplaint] = useState(() => {
    const c = {
      ...props.complaint,
    };
    if (!c.criteria) { c.criteria = []; }
    if (!c.listings) { c.listings = []; }
    if (!c.surveillances) { c.surveillances = []; }
    return c;
  });
  const [certificationBodies, setCertificationBodies] = useState([]);
  const [complainantTypes, setComplainantTypes] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [criterionEdition, setCriterionEdition] = useState('2015');
  const [criterionToAdd, setCriterionToAdd] = useState('');
  const [listings] = useState(
    props.listings // eslint-disable-line react/destructuring-assignment
      .filter((listing) => (!complaint.certificationBody || listing.acb === complaint.certificationBody.name))
      .sort(((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1))),
  );
  const [listingToAdd, setListingToAdd] = useState(null);
  const [listingValueToAdd, setListingValueToAdd] = useState('');
  const [surveillances, setSurveillances] = useState([]);
  const [surveillanceToAdd, setSurveillanceToAdd] = useState('');
  const [errors, setErrors] = useState([]);
  const networkService = getAngularService('networkService');
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (certificationBodiesIsLoading || !certificationBodiesIsSuccess) { return; }
    setCertificationBodies(certificationBodiesData.acbs.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [certificationBodiesData, certificationBodiesIsLoading, certificationBodiesIsSuccess]);

  useEffect(() => {
    if (complainantTypesIsLoading || !complainantTypesIsSuccess) { return; }
    setComplainantTypes(complainantTypesData.data.sort((a, b) => (a.name < b.name ? -1 : 1)));
    formik.setFieldValue('complainantType', complainantTypesData.data.find((type) => type.id === props.complaint?.complainantType?.id) || '');
  }, [complainantTypesData, complainantTypesIsLoading, complainantTypesIsSuccess, props.complaint]);

  useEffect(() => {
    if (criteriaIsLoading || !criteriaIsSuccess) { return; }
    setCriteria(criteriaData.criteria.sort(getAngularService('utilService').sortCertActual));
  }, [criteriaData, criteriaIsLoading, criteriaIsSuccess]);

  useEffect(() => {
    setSurveillances([]);
    complaint.listings.forEach((listing) => {
      networkService.getListingBasic(listing.listingId, true).then((response) => {
        const newSurveillances = response.surveillance.map((surv) => ({
          id: surv.id,
          friendlyId: surv.friendlyId,
          listingId: response.id,
          certifiedProductId: response.id,
          chplProductNumber: response.chplProductNumber,
        }));
        setSurveillances((original) => [
          ...original,
          ...newSurveillances,
        ].sort((a, b) => {
          if (a.chplProductNumber < b.chplProductNumber) { return -1; }
          if (a.chplProductNumber > b.chplProductNumber) { return 1; }
          return a.friendlyId < b.friendlyId ? -1 : 1;
        }));
      });
    });
  }, [complaint.listings]);

  useEffect(() => {
    setErrors(props.errors
      .map((s) => (s))
      .sort((a, b) => (a < b ? -1 : 1)));
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const handleAction = (action, payload) => {
    props.dispatch(action, payload);
  };

  const addAssociatedCriterion = (event) => {
    if (complaint.criteria?.find((item) => item.certificationCriterion.id === event.target.value.id)) { return; }
    const updated = {
      ...complaint,
      criteria: [
        ...complaint.criteria,
        { certificationCriterion: event.target.value },
      ],
    };
    setComplaint(updated);
    setCriterionToAdd('');
  };

  const removeAssociatedCriterion = (criterion) => {
    const updated = {
      ...complaint,
      criteria: complaint.criteria.filter((item) => item.certificationCriterion.id !== criterion.certificationCriterion.id),
    };
    setComplaint(updated);
  };

  const addAssociatedListing = (event, newValue) => {
    if (!newValue || !newValue.id) { return; }
    if (complaint.listings?.find((item) => item.id === newValue.id)) {
      setListingToAdd(null);
      setListingValueToAdd('');
      return;
    }
    const updated = {
      ...complaint,
      listings: [
        ...complaint.listings,
        {
          ...newValue,
          listingId: newValue.id,
        },
      ],
    };
    setComplaint(updated);
    setListingToAdd(null);
    setListingValueToAdd('');
  };

  const removeAssociatedListing = (listing) => {
    const updated = {
      ...complaint,
      listings: complaint.listings.filter((item) => item.id !== listing.id),
    };
    setComplaint(updated);
  };

  const addAssociatedSurveillance = (event) => {
    if (complaint.surveillances?.find((item) => item.surveillance.id === event.target.value.id)) { return; }
    const updated = {
      ...complaint,
      surveillances: [
        ...complaint.surveillances,
        { surveillance: event.target.value },
      ],
    };
    setComplaint(updated);
    setSurveillanceToAdd('');
  };

  const deleteComplaint = (payload) => {
    remove(payload, {
      onSuccess: () => {
        handleAction('refresh');
      },
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  const removeAssociatedSurveillance = (surveillance) => {
    const updated = {
      ...complaint,
      surveillances: complaint.surveillances.filter((item) => item.surveillance.id !== surveillance.surveillance.id),
    };
    setComplaint(updated);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        if (complaint.id) {
          handleAction('cancel');
        } else {
          handleAction('close');
        }
        break;
      case 'delete':
        deleteComplaint(complaint);
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const handleEditionFilterChange = (event) => {
    setCriterionEdition(event.target.value);
  };

  const save = () => {
    const mutate = complaint.id ? put : post;
    mutate({
      ...complaint,
      certificationBody: formik.values.certificationBody,
      receivedDate: formik.values.receivedDate,
      closedDate: formik.values.closedDate,
      acbComplaintId: formik.values.acbComplaintId,
      oncComplaintId: formik.values.oncComplaintId,
      complainantType: formik.values.complainantType,
      complainantTypeOther: formik.values.complainantTypeOther,
      summary: formik.values.summary,
      actions: formik.values.actions,
      complainantContacted: formik.values.complainantContacted,
      developerContacted: formik.values.developerContacted,
      oncAtlContacted: formik.values.oncAtlContacted,
      flagForOncReview: formik.values.flagForOncReview,
    }, {
      onSuccess: () => {
        handleAction('refresh');
      },
      onError: (error) => {
        const message = error.response.data?.error
              || error.response.data?.errorMessages.join(' ');
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  formik = useFormik({
    initialValues: {
      certificationBody: complaint.certificationBody || '',
      receivedDate: complaint.receivedDate || '',
      closedDate: complaint.closedDate || '',
      acbComplaintId: complaint.acbComplaintId || '',
      oncComplaintId: complaint.oncComplaintId || '',
      complainantType: complaint.complainantType || '',
      complainantTypeOther: complaint.complainantTypeOther || '',
      summary: complaint.summary || '',
      actions: complaint.actions || '',
      complainantContacted: !!complaint.complainantContacted,
      developerContacted: !!complaint.developerContacted,
      oncAtlContacted: !!complaint.oncAtlContacted,
      flagForOncReview: !!complaint.flagForOncReview,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <>
      <Card>
        <CardHeader
          title={complaint.id ? 'Edit Complaint' : 'Create Complaint'}
          subheader={complaint.acbComplaintId}
        />
        <CardContent>
          { complaint.id
            ? (
              <Typography variant="h5">
                ONC-ACB:
                {' '}
                {complaint.certificationBody.name}
              </Typography>
            )
            : (
              <ChplTextField
                select
                id="certification-body"
                name="certificationBody"
                label="ONC-ACB"
                required
                value={formik.values.certificationBody}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.certificationBody && !!formik.errors.certificationBody}
                helperText={formik.touched.certificationBody && formik.errors.certificationBody}
              >
                { certificationBodies.map((item) => (
                  <MenuItem value={item} key={item.id}>{`${item.name}${item.retired ? ' (Retired)' : ''}`}</MenuItem>
                ))}
              </ChplTextField>
            )}
          <div className={classes.content}>
            <div className={classes.dataEntry}>
              <Typography variant="subtitle1">General Info</Typography>
              <ChplTextField
                type="date"
                id="received-date"
                name="receivedDate"
                label="Received Date"
                required
                value={formik.values.receivedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.receivedDate && !!formik.errors.receivedDate}
                helperText={formik.touched.receivedDate && formik.errors.receivedDate}
              />
              <ChplTextField
                type="date"
                id="closed-date"
                name="closedDate"
                label="Closed Date"
                value={formik.values.closedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.closedDate && !!formik.errors.closedDate}
                helperText={formik.touched.closedDate && formik.errors.closedDate}
              />
              <ChplTextField
                id="acb-complaint-id"
                name="acbComplaintId"
                label="ONC-ACB Complaint ID"
                required
                value={formik.values.acbComplaintId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.acbComplaintId && !!formik.errors.acbComplaintId}
                helperText={formik.touched.acbComplaintId && formik.errors.acbComplaintId}
              />
              <ChplTextField
                id="onc-complaint-id"
                name="oncComplaintId"
                label="ONC Complaint ID"
                value={formik.values.oncComplaintId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.oncComplaintId && !!formik.errors.oncComplaintId}
                helperText={formik.touched.oncComplaintId && formik.errors.oncComplaintId}
              />
              <ChplTextField
                select
                id="complainant-type"
                name="complainantType"
                label="Complainant Type"
                required
                value={formik.values.complainantType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.complainantType && !!formik.errors.complainantType}
                helperText={formik.touched.complainantType && formik.errors.complainantType}
              >
                { complainantTypes.map((item) => (
                  <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                ))}
              </ChplTextField>
              { formik.values.complainantType?.name === 'Other - [Please Describe]'
                && (
                  <ChplTextField
                    id="complainant-type-other"
                    name="complainantTypeOther"
                    label="Complainant Type - Other Description"
                    required
                    value={formik.values.complainantTypeOther}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.complainantTypeOther && !!formik.errors.complainantTypeOther}
                    helperText={formik.touched.complainantTypeOther && formik.errors.complainantTypeOther}
                  />
                )}
            </div>
            <div className={classes.dataEntry}>
              <Typography variant="subtitle1">Summary and Actions</Typography>
              <ChplTextField
                id="summary"
                name="summary"
                label="Complaint Summary"
                required
                multiline
                value={formik.values.summary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.summary && !!formik.errors.summary}
                helperText={formik.touched.summary && formik.errors.summary}
              />
              <ChplTextField
                id="actions"
                name="actions"
                label="Actions/Response"
                required={!!formik.values.closedDate}
                multiline
                value={formik.values.actions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.actions && !!formik.errors.actions}
                helperText={formik.touched.actions && formik.errors.actions}
              />
            </div>
            <div className={classes.dataEntry}>
              <Typography variant="subtitle1">Review Info</Typography>
              {complaint.criteria?.length > 0
               && (
                 <>
                   <Typography>Associated Criteria</Typography>
                   <ul className={classes.chips}>
                     {complaint.criteria
                       .map((criterion) => (
                         <li key={criterion.certificationCriterion.id}>
                           <Chip
                             label={`${(criterion.certificationCriterion.removed ? 'Removed | ' : '') + criterion.certificationCriterion.number}: ${criterion.certificationCriterion.title}`}
                             onDelete={() => removeAssociatedCriterion(criterion)}
                             className={classes.chip}
                             color="primary"
                             variant="outlined"
                           />
                         </li>
                       ))}
                   </ul>
                 </>
               )}
              <ChplTextField
                select
                id="criteria"
                name="criteria"
                label="Add Associated Criterion"
                value={criterionToAdd}
                onChange={addAssociatedCriterion}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        aria-label="Select Edition of Certification Criteria"
                        value={criterionEdition}
                        onChange={handleEditionFilterChange}
                      >
                        <MenuItem value="2015">2015</MenuItem>
                        <MenuItem value="2014">2014</MenuItem>
                        <MenuItem value="2011">2011</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
              >
                {criteria
                  .filter((criterion) => (criterion.certificationEdition === criterionEdition))
                  .map((item) => (
                    <MenuItem value={item} key={item.id}>{`${(item.removed ? 'Removed | ' : '') + item.number}: ${item.title}`}</MenuItem>
                  ))}
              </ChplTextField>

              {complaint.listings?.length > 0
               && (
                 <>
                   <Typography>Associated Listings</Typography>
                   <ul className={classes.chips}>
                     {complaint.listings
                       .map((listing) => (
                         <li key={listing.id}>
                           <Chip
                             label={listing.chplProductNumber}
                             onDelete={() => removeAssociatedListing(listing)}
                             className={classes.chip}
                             color="primary"
                             variant="outlined"
                           />
                         </li>
                       ))}
                   </ul>
                 </>
               )}
              { /* eslint-disable react/jsx-props-no-spreading */ }
              <Autocomplete
                id="listings"
                name="listings"
                options={listings}
                value={listingToAdd}
                onChange={addAssociatedListing}
                inputValue={listingValueToAdd}
                onInputChange={(event, newValue) => {
                  setListingValueToAdd(newValue);
                }}
                getOptionLabel={(item) => (`${item.chplProductNumber} (${item.developer} - ${item.product})`)}
                renderInput={(params) => <ChplTextField {...params} label="Add Associated Listing" />}
              />
              { /* eslint-enable react/jsx-props-no-spreading */ }
              {complaint.surveillances?.length > 0
               && (
                 <>
                   <Typography>Associated Surveillance Activities</Typography>
                   <ul className={classes.chips}>
                     {complaint.surveillances
                       .map((surveillance) => (
                         <li key={surveillance.id}>
                           <Chip
                             label={`${surveillance.surveillance.chplProductNumber}: ${surveillance.surveillance.friendlyId}`}
                             onDelete={() => removeAssociatedSurveillance(surveillance)}
                             className={classes.chip}
                             color="primary"
                             variant="outlined"
                           />
                         </li>
                       ))}
                   </ul>
                 </>
               )}
              {surveillances.length > 0
               && (
                 <ChplTextField
                   select
                   id="surveillances"
                   name="surveillances"
                   label="Add Associated Surveillance Activity"
                   value={surveillanceToAdd}
                   onChange={addAssociatedSurveillance}
                 >
                   {surveillances
                     .map((item) => (
                       <MenuItem value={item} key={item.id}>{`${item.chplProductNumber}: ${item.friendlyId}`}</MenuItem>
                     ))}
                 </ChplTextField>
               )}
            </div>
            <div className={classes.dataEntry}>
              <Typography variant="subtitle1">Parties Contacted</Typography>
              <FormControlLabel
                control={(
                  <Switch
                    id="complainant-contacted"
                    name="complainantContacted"
                    color="primary"
                    checked={formik.values.complainantContacted}
                    onChange={formik.handleChange}
                  />
                )}
                label="Complainant Contacted"
              />
              <FormControlLabel
                control={(
                  <Switch
                    id="developer-contacted"
                    name="developerContacted"
                    color="primary"
                    checked={formik.values.developerContacted}
                    onChange={formik.handleChange}
                  />
                )}
                label="Developer Contacted"
              />
              <FormControlLabel
                control={(
                  <Switch
                    id="onc-atl-contacted"
                    name="oncAtlContacted"
                    color="primary"
                    checked={formik.values.oncAtlContacted}
                    onChange={formik.handleChange}
                  />
                )}
                label="ONC-Atl Contacted"
              />
              <FormControlLabel
                control={(
                  <Switch
                    id="flag-for-onc-review"
                    name="flagForOncReview"
                    color="primary"
                    checked={formik.values.flagForOncReview}
                    onChange={formik.handleChange}
                  />
                )}
                label="Informed ONC per &sect;170.523(s)"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <ChplActionBar
        errors={errors}
        dispatch={handleDispatch}
        canDelete={!!complaint.id}
      />
    </>
  );
}

export default ChplComplaintEdit;

ChplComplaintEdit.propTypes = {
  complaint: complaintPropType.isRequired,
  listings: arrayOf(listingPropType).isRequired,
  errors: arrayOf(string).isRequired,
  dispatch: func.isRequired,
};
