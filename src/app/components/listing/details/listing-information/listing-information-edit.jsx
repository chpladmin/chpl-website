import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Delete, Add, Save, Clear,
} from '@material-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import { useFetchCertificationStatuses, useFetchClassificationTypes, useFetchPracticeTypes } from 'api/data';
import { ChplTextField } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { ListingContext, UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fullWidth: {
    width: '100%',
  },
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
  twoColumnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    alignItems: 'flex-start',
    width: '100%',
  },
  statusDateContainer: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '8px',
    alignItems: 'flex-start',
    width: '66%',
  },
  productVersionIcsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    alignItems: 'baseline',
  },
});

const validationSchema = yup.object({
  productCode: yup.string()
    .required('Field is required')
    .matches(/^[A-Za-z0-9_]{4}$/, 'Product Code must consist of letters, numbers and/or "_", and be 4 characters long'),
  versionCode: yup.string()
    .required('Field is required')
    .matches(/^[A-Za-z0-9_]{2}$/, 'Version Code must consist of letters, numbers and/or "_", and be 2 characters long'),
  icsCode: yup.string()
    .required('Field is required')
    .matches(/^[0-9]{2}$/, 'ICS Code must be a two digit single number from 00 to 99'),
  acbCertificationId: yup.string()
    .max(250, 'Field is too long'),
  newStatusType: yup.object()
    .required('Field is missing'),
  newStatusDay: yup.date()
    .required('Field is missing'),
  newStatusReason: yup.string()
    .max(500, 'Field is too long'),
  classificationType: yup.string()
    .required('Field is missing'),
  practiceType: yup.string()
    .required('Field is missing'),
  certifyingBody: yup.string()
    .required('Field is missing'),
  testingLab: yup.string(),
  productAdditionalSoftware: yup.string(),
  svapNoticeUrl: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(1024, 'Field is too long'),
  mandatoryDisclosures: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(1024, 'Field is too long'),
  rwtPlansUrl: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(1024, 'Field is too long'),
  rwtPlansCheckDate: yup.date(),
  rwtResultsUrl: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(1024, 'Field is too long'),
  rwtResultsCheckDate: yup.date(),
});

function ChplListingInformationEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const { hasAnyRole } = useContext(UserContext);
  const [addingAtl, setAddingAtl] = useState(false);
  const [addingStatus, setAddingStatus] = useState(false);
  const [acbs, setAcbs] = useState([]);
  const [atls, setAtls] = useState([]);
  const [acbOptions, setAcbOptions] = useState([]);
  const [atlOptions, setAtlOptions] = useState([]);
  const [certificationStatuses, setCertificationStatuses] = useState([]);
  const [classificationTypes, setClassificationTypes] = useState([]);
  const [classificationTypeOptions, setClassificationTypeOptions] = useState([]);
  const [practiceTypes, setPracticeTypes] = useState([]);
  const [practiceTypeOptions, setPracticeTypeOptions] = useState([]);
  const acbsQuery = useFetchAcbs();
  const atlsQuery = useFetchAtls();
  const certificationStatusesQuery = useFetchCertificationStatuses();
  const classificationTypesQuery = useFetchClassificationTypes();
  const practiceTypesQuery = useFetchPracticeTypes();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (acbsQuery.isLoading || !acbsQuery.isSuccess) {
      return;
    }
    setAcbs(acbsQuery.data.acbs);
    setAcbOptions(acbsQuery.data.acbs
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((acb) => acb.name));
  }, [acbsQuery.data, acbsQuery.isLoading, acbsQuery.isSuccess]);

  useEffect(() => {
    if (atlsQuery.isLoading || !atlsQuery.isSuccess) {
      return;
    }
    setAtls(atlsQuery.data.atls);
    setAtlOptions(atlsQuery.data.atls
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((atl) => `${atl.retired ? 'Retired | ' : ''}${atl.name}`));
  }, [atlsQuery.data, atlsQuery.isLoading, atlsQuery.isSuccess]);

  useEffect(() => {
    if (certificationStatusesQuery.isLoading || !certificationStatusesQuery.isSuccess) {
      return;
    }
    setCertificationStatuses(certificationStatusesQuery.data.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [certificationStatusesQuery.data, certificationStatusesQuery.isLoading, certificationStatusesQuery.isSuccess]);

  useEffect(() => {
    if (classificationTypesQuery.isLoading || !classificationTypesQuery.isSuccess) {
      return;
    }
    setClassificationTypes(classificationTypesQuery.data);
    setClassificationTypeOptions(classificationTypesQuery.data
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((type) => type.name));
  }, [classificationTypesQuery.data, classificationTypesQuery.isLoading, classificationTypesQuery.isSuccess]);

  useEffect(() => {
    if (practiceTypesQuery.isLoading || !practiceTypesQuery.isSuccess) {
      return;
    }
    setPracticeTypes(practiceTypesQuery.data);
    setPracticeTypeOptions(practiceTypesQuery.data
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((type) => type.name));
  }, [practiceTypesQuery.data, practiceTypesQuery.isLoading, practiceTypesQuery.isSuccess]);

  const handleBasicChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleItemAddition = (type) => {
    switch (type) {
      case 'certificationEvents':
        setListing((prev) => ({
          ...prev,
          certificationEvents: prev.certificationEvents.concat({
            status: formik.values.newStatusType,
            eventDay: formik.values.newStatusDay,
            reason: formik.values.newStatusReason,
          }),
        }));
        formik.setFieldValue('newStatusType', '');
        formik.setFieldValue('newStatusDay', '');
        formik.setFieldValue('newStatusReason', '');
        setAddingStatus(false);
        break;
      case 'oncAtls':
        setListing((prev) => ({
          ...prev,
          testingLabs: prev.testingLabs.concat({
            testingLab: atls.find((atl) => formik.values.testingLab.endsWith(atl.name)),
          }),
        }));
        formik.setFieldValue('testingLab', '');
        setAddingAtl(false);
        break;
        // no default
    }
  };

  const handleItemRemoval = (type, item) => {
    switch (type) {
      case 'certificationEvents':
        setListing((prev) => ({
          ...prev,
          certificationEvents: prev.certificationEvents.filter((event) => event.eventDay !== item.eventDay),
        }));
        break;
      case 'oncAtls':
        setListing((prev) => ({
          ...prev,
          testingLabs: prev.testingLabs.filter((atl) => atl.testingLab.id !== item.testingLab.id),
        }));
        break;
        // no default
    }
  };

  const handleProductNumberChange = (event) => {
    const parts = listing.chplProductNumber?.split('.');
    switch (event.target.name) {
      case 'productCode':
        parts[4] = event.target.value;
        break;
      case 'versionCode':
        parts[5] = event.target.value;
        break;
      case 'icsCode':
        parts[6] = event.target.value;
        break;
        // no default
    }
    setListing((prev) => ({
      ...prev,
      chplProductNumber: parts.join('.'),
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleSelectChange = (event) => {
    switch (event.target.name) {
      case 'certifyingBody':
        setListing((prev) => ({
          ...prev,
          certifyingBody: acbs.find((acb) => acb.name === event.target.value),
        }));
        break;
      case 'classificationType':
        setListing((prev) => ({
          ...prev,
          classificationType: classificationTypes.find((type) => type.name === event.target.value),
        }));
        break;
      case 'practiceType':
        setListing((prev) => ({
          ...prev,
          practiceType: practiceTypes.find((type) => type.name === event.target.value),
        }));
        break;
        // no default
    }
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const getPrefix = () => {
    const parts = listing.chplProductNumber?.split('.') ?? [];
    return `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}`;
  };

  const getSuffix = () => {
    const parts = listing.chplProductNumber?.split('.') ?? [];
    return `${parts[7]}.${parts[8]}`;
  };

  const mayCauseSuspension = (status) => {
    switch (status) {
      case ('Active'):
      case ('Retired'):
      case ('Suspended by ONC-ACB'):
      case ('Suspended by ONC'):
      case ('Withdrawn by Developer'):
      case ('Terminated by ONC'):
        return false;
      case ('Withdrawn by ONC-ACB'):
      case ('Withdrawn by Developer Under Surveillance/Review'):
        return true;
      default: return false;
    }
  };

  formik = useFormik({
    initialValues: {
      acbCertificationId: listing.acbCertificationId ?? '',
      productCode: listing.chplProductNumber?.split('.')[4] ?? '',
      versionCode: listing.chplProductNumber?.split('.')[5] ?? '',
      icsCode: listing.chplProductNumber?.split('.')[6] ?? '',
      newStatusType: '',
      newStatusDay: '',
      newStatusReason: '',
      classificationType: listing.classificationType?.name ?? '',
      practiceType: listing.practiceType?.name ?? '',
      certifyingBody: listing.certifyingBody?.name ?? '',
      testingLab: '',
      productAdditionalSoftware: listing.productAdditionalSoftware ?? '',
      svapNoticeUrl: listing.svapNoticeUrl ?? '',
      mandatoryDisclosures: listing.mandatoryDisclosures ?? '',
      rwtPlansUrl: listing.rwtPlansUrl ?? '',
      rwtPlansCheckDate: listing.rwtPlansCheckDate ?? '',
      rwtResultsUrl: listing.rwtResultsUrl ?? '',
      rwtResultsCheckDate: listing.rwtResultsCheckDate ?? '',
    },
    validationSchema,
  });

  if (!listing || acbs.length === 0 || certificationStatuses.length === 0) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box className={classes.column}>
      { !listing.chplProductNumber?.startsWith('CHP-')
        && (
          <>
            <Typography variant="subtitle1">CHPL Product Number & Certification ID:</Typography>
            <Box className={classes.productVersionIcsContainer}>
              { getPrefix() }
              <ChplTextField
                id="product-code"
                name="productCode"
                label="Product Code"
                required
                value={formik.values.productCode}
                onChange={handleProductNumberChange}
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
                onChange={handleProductNumberChange}
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
                onChange={handleProductNumberChange}
                onBlur={formik.handleBlur}
                error={formik.touched.icsCode && !!formik.errors.icsCode}
                helperText={formik.touched.icsCode && formik.errors.icsCode}
              />
              { getSuffix() }
            </Box>
          </>
        )}
      <ChplTextField
        id="acb-certification-id"
        name="acbCertificationId"
        label="ONC-ACB Certification ID"
        value={formik.values.acbCertificationId}
        onChange={handleBasicChange}
        onBlur={formik.handleBlur}
        error={formik.touched.acbCertificationId && !!formik.errors.acbCertificationId}
        helperText={formik.touched.acbCertificationId && formik.errors.acbCertificationId}
      />
      <Typography variant="subtitle1">Status:</Typography>
      { listing.certificationEvents?.length > 0
        && (
          <>
            <Card className={classes.fullWidth}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.oneThirdWidth}>Certification Status</TableCell>
                    <TableCell className={classes.oneThirdWidth}>Effective Date</TableCell>
                    <TableCell className={classes.oneThirdWidth}>Reason for Status Change</TableCell>
                    <TableCell className="sr-only">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listing.certificationEvents
                    .sort((a, b) => (a.eventDay < b.eventDay ? 1 : -1))
                    .map((ce, idx, vals) => (
                      <TableRow key={ce.eventDay}>
                        <TableCell>
                          { ce.status.name }
                          { idx !== listing.certificationEvents.length - 1 && ce.status.name === vals[idx + 1].status.name
                           && (
                             <>
                               <br />
                               <Typography color="error" variant="body2">Certification Status must differ from previous Status</Typography>
                             </>
                           )}
                          { idx === 0 && mayCauseSuspension(ce.status.name)
                           && (
                             <>
                               <br />
                               <Typography color="error" variant="body2">Setting this product to this status may trigger a ban by ONC</Typography>
                             </>
                           )}
                          { idx === 0 && ce.status.name === 'Terminated by ONC'
                           && (
                             <>
                               <br />
                               <Typography color="error" variant="body2">Setting this product to this status will cause the developer to be marked as &quot;Under Certification Ban&quot;</Typography>
                             </>
                           )}
                          { idx === 0 && ce.status.name === 'Suspended by ONC'
                           && (
                             <>
                               <br />
                               <Typography color="error" variant="body2">Setting this product to this status will cause the developer to be marked as &quot;Suspended by ONC&quot;</Typography>
                             </>
                           )}
                          {idx === 0 && ce.status.name === 'Withdrawn by Developer'
                          && (
                            <>
                              <br />
                              <Typography color="error" variant="body2">Be sure this product is not under surveillance or soon to be under surveillance, otherwise use the status &quot;Withdrawn by Developer Under Surveillance/Review&quot;</Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          { getDisplayDateFormat(ce.eventDay) }
                        </TableCell>
                        <TableCell>
                          { ce.reason }
                        </TableCell>
                        <TableCell>
                          <IconButton variant="outlined" onClick={() => handleItemRemoval('certificationEvents', ce)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      { !addingStatus
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => setAddingStatus(true)}
            endIcon={<Add fontSize="medium" />}
          >
            Add Certification Status
          </Button>
        )}
      { addingStatus
        && (
          <>
            <Typography variant="subtitle2">Adding New Status:</Typography>
            <Box className={classes.twoColumnContainer}>
              <Box className={classes.statusDateContainer}>
                <ChplTextField
                  select
                  id="new-status-type"
                  name="newStatusType"
                  label="New Status"
                  required
                  value={formik.values.newStatusType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newStatusType && !!formik.errors.newStatusType}
                  helperText={formik.touched.newStatusType && formik.errors.newStatusType}
                >
                  { certificationStatuses.map((item) => (
                    <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                  ))}
                </ChplTextField>
                <ChplTextField
                  id="new-status-day"
                  name="newStatusDay"
                  label="Effective Date"
                  type="date"
                  required
                  value={formik.values.newStatusDay}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newStatusDay && !!formik.errors.newStatusDay}
                  helperText={formik.touched.newStatusDay && formik.errors.newStatusDay}
                />
              </Box>
              <Box className={classes.oneThirdWidth}>
                <ChplTextField
                  id="new-status-reason"
                  name="newStatusReason"
                  label="Reason for Change"
                  value={formik.values.newStatusReason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.newStatusReason && !!formik.errors.newStatusReason}
                  helperText={formik.touched.newStatusReason && formik.errors.newStatusReason}
                  multiline
                />
              </Box>
            </Box>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                onClick={() => setAddingStatus(false)}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                size="medium"
                endIcon={<Save fontSize="small" />}
                variant="contained"
                color="primary"
                onClick={() => handleItemAddition('certificationEvents')}
                disabled={formik.values.newStatusType === '' || formik.values.newStatusDay === ''}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      { listing.edition?.name === '2014'
        && (
          <>
            <ChplTextField
              select
              id="classification-type"
              name="classificationType"
              label="Classification Type"
              required
              value={formik.values.classificationType}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              error={formik.touched.classificationType && !!formik.errors.classificationType}
              helperText={formik.touched.classificationType && formik.errors.classificationType}
            >
              { classificationTypeOptions.map((item) => (
                <MenuItem value={item} key={item}>{item}</MenuItem>
              ))}
            </ChplTextField>
            <ChplTextField
              select
              id="practice-type"
              name="practiceType"
              label="Practice Type"
              required
              value={formik.values.practiceType}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              error={formik.touched.practiceType && !!formik.errors.practiceType}
              helperText={formik.touched.practiceType && formik.errors.practiceType}
            >
              { practiceTypeOptions.map((item) => (
                <MenuItem value={item} key={item}>{item}</MenuItem>
              ))}
            </ChplTextField>
          </>
        )}
      <Typography variant="subtitle1">ONC-ACB & ONC-ATL:</Typography>
      { hasAnyRole(['ROLE_ADMIN', 'chpl-onc'])
        && (
          <ChplTextField
            select
            id="certifying-body"
            name="certifyingBody"
            label="ONC-ACB"
            required
            value={formik.values.certifyingBody}
            onChange={handleSelectChange}
            onBlur={formik.handleBlur}
            error={formik.touched.certifyingBody && !!formik.errors.certifyingBody}
            helperText={formik.touched.certifyingBody && formik.errors.certifyingBody}
          >
            { acbOptions.map((item) => (
              <MenuItem value={item} key={item}>{item}</MenuItem>
            ))}
          </ChplTextField>
        )}
      { hasAnyRole(['chpl-onc-acb'])
        && (
          <Typography>
            { listing.certifyingBody?.name }
          </Typography>
        )}
      { listing.testingLabs?.length > 0
        && (
          <Card className={classes.fullWidth}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.fullWidth}>Testing Lab</TableCell>
                  <TableCell className="sr-only">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { listing.testingLabs
                  .sort((a, b) => (a.testingLab.name < b.testingLab.name ? -1 : 1))
                  .map((atl) => (
                    <TableRow key={atl.testingLab.id}>
                      <TableCell>
                        { atl.testingLab.name }
                      </TableCell>
                      <TableCell>
                        <IconButton
                          variant="outlined"
                          onClick={() => handleItemRemoval('oncAtls', atl)}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        )}
      { !addingAtl
        && (
          <Button
            size="medium"
            color="primary"
            variant="outlined"
            endIcon={<Add fontSize="medium" />}
            onClick={() => setAddingAtl(true)}
          >
            Add ONC-ATL
          </Button>
        )}
      { addingAtl
        && (
          <>
            <Typography variant="subtitle2">Adding New Testing Lab:</Typography>
            <ChplTextField
              select
              id="testing-lab"
              name="testingLab"
              label="New ONC-ATL"
              value={formik.values.testingLab}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.testingLab && !!formik.errors.testingLab}
              helperText={formik.touched.testingLab && formik.errors.testingLab}
            >
              { atlOptions
                .filter((atl) => !listing.testingLabs.some((a) => atl.endsWith(a.testingLab.name)))
                .map((item) => (
                  <MenuItem value={item} key={item}>{item}</MenuItem>
                ))}
            </ChplTextField>
            <Box className={classes.cancelAndSaveButton}>
              <Button
                size="medium"
                endIcon={<Clear fontSize="small" />}
                variant="contained"
                color="secondary"
                onClick={() => setAddingAtl(false)}
              >
                Cancel
              </Button>
              <Button
                size="medium"
                endIcon={<Save fontSize="small" />}
                variant="contained"
                color="primary"
                onClick={() => handleItemAddition('oncAtls')}
                disabled={formik.values.testingLab === ''}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      { listing.chplProductNumber?.startsWith('CHP-')
        && (
          <ChplTextField
            id="product-additional-software"
            name="productAdditionalSoftware"
            label="Product wide Relied Upon Software"
            value={formik.values.productAdditionalSoftware}
            onChange={handleBasicChange}
            onBlur={formik.handleBlur}
            error={formik.touched.productAdditionalSoftware && !!formik.errors.productAdditionalSoftware}
            helperText={formik.touched.productAdditionalSoftware && formik.errors.productAdditionalSoftware}
          />
        )}
      <Typography variant="subtitle1">Standards & Disclosures:</Typography>
      <Box className={classes.twoColumnContainer}>
        <ChplTextField
          id="svap-notice-url"
          name="svapNoticeUrl"
          label="Standards Version Advancement Process Notice"
          value={formik.values.svapNoticeUrl}
          onChange={handleBasicChange}
          onBlur={formik.handleBlur}
          error={formik.touched.svapNoticeUrl && !!formik.errors.svapNoticeUrl}
          helperText={formik.touched.svapNoticeUrl && formik.errors.svapNoticeUrl}
        />
        <ChplTextField
          id="mandatory-disclosures"
          name="mandatoryDisclosures"
          label="Mandatory Disclosures"
          value={formik.values.mandatoryDisclosures}
          onChange={handleBasicChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mandatoryDisclosures && !!formik.errors.mandatoryDisclosures}
          helperText={formik.touched.mandatoryDisclosures && formik.errors.mandatoryDisclosures}
        />
      </Box>
      { (listing.edition?.name === '2015' || listing.edition === undefined)
        && (
          <>
            <Typography variant="subtitle1">Real World Testing:</Typography>
            <Box className={classes.twoColumnContainer}>
              <Box className={classes.column}>
                <ChplTextField
                  id="rwt-plans-url"
                  name="rwtPlansUrl"
                  label="Plans URL"
                  value={formik.values.rwtPlansUrl}
                  onChange={handleBasicChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtPlansUrl && !!formik.errors.rwtPlansUrl}
                  helperText={formik.touched.rwtPlansUrl && formik.errors.rwtPlansUrl}
                />
                <ChplTextField
                  id="rwt-plans-check-date"
                  name="rwtPlansCheckDate"
                  label="Plans Last ONC-ACB Completeness Check"
                  type="date"
                  value={formik.values.rwtPlansCheckDate}
                  onChange={handleBasicChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtPlansCheckDate && !!formik.errors.rwtPlansCheckDate}
                  helperText={formik.touched.rwtPlansCheckDate && formik.errors.rwtPlansCheckDate}
                />
              </Box>
              <Box className={classes.column}>
                <ChplTextField
                  id="rwt-results-url"
                  name="rwtResultsUrl"
                  label="Results URL"
                  value={formik.values.rwtResultsUrl}
                  onChange={handleBasicChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtResultsUrl && !!formik.errors.rwtResultsUrl}
                  helperText={formik.touched.rwtResultsUrl && formik.errors.rwtResultsUrl}
                />
                <ChplTextField
                  id="rwt-results-check-date"
                  name="rwtResultsCheckDate"
                  label="Results Last ONC-ACB Completeness Check"
                  type="date"
                  value={formik.values.rwtResultsCheckDate}
                  onChange={handleBasicChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rwtResultsCheckDate && !!formik.errors.rwtResultsCheckDate}
                  helperText={formik.touched.rwtResultsCheckDate && formik.errors.rwtResultsCheckDate}
                />
              </Box>
            </Box>
          </>
        )}
    </Box>
  );
}

export default ChplListingInformationEdit;

ChplListingInformationEdit.propTypes = {
};
