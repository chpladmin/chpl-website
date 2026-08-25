import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { bool, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplUrlChecker from 'components/url-checker/url-checker';
import UrlCheckerContext from 'components/url-checker/url-checker-context';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  demographicsContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  demographicsSectionContainer: {
    marginBottom: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 500px)',
  },
  nameContainer: {
    gridColumn: '1 / 2',
  },
  nameOnlyContainer: {
    gridColumn: '1 / 3',
  },
  titleContainer: {
    gridColumn: '2 / 4',
  },
  developerContainer: {
    gridColumn: '4 / 6',
  },
  developerOnlyContainer: {
    gridColumn: '3 / 6',
  },
  dateContainer: {
    gridColumn: '6 / 7',
  },
  editContainer: {
    gridColumn: '1 / 7',
  },
  editFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    alignItems: 'start',
  },
});

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required')
    .max(500, 'Full Name is too long'),
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

function ChplDemographicsWizardSection2({ isSubmitting = false, dispatch }) {
  const user = useSelector((state) => state.userInfo.user);
  const { developer } = useContext(DeveloperContext);
  const { analytics } = useAnalyticsContext();
  const { url, setUrl } = useContext(UrlCheckerContext);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setUrl(developer.website);
  }, []);

  const getEnhancedEditField = (editProps) => getEditField({
    ...editProps,
    formik,
  });

  const handleDispatch = ({ action, url: submittedUrl }) => {
    switch (action) {
      case 'complete':
        formik.setFieldValue('website', submittedUrl);
        setUrl(submittedUrl);
        break;
      case 'update':
        setUrl('');
        break;
        // no default
    }
  };

  const handleSubmit = () => {
    eventTrack({
      ...analytics,
      event: 'Submit Developer Demographics Change Request',
    });
    dispatch({
      ...formik.values,
    });
  };

  const isSubmitDisabled = () => (!url || url.length === 0 || !formik.isValid || isSubmitting);

  formik = useFormik({
    initialValues: {
      selfDeveloper: !!developer.selfDeveloper,
      fullName: developer.contact?.fullName || '',
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
    validationSchema,
  });

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="md">
        <Box className={classes.demographicsSectionContainer}>
          <Typography gutterBottom component="h2" variant="h3">
            Section 2 &mdash; Demographics entry
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="md" className={classes.demographicsContainer}>
        <Card className={user.title ? classes.nameContainer : classes.nameOnlyContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Name:
              </Typography>
              <Typography variant="body1">{user.fullName}</Typography>
            </div>
          </CardContent>
        </Card>
        { user.title && (
          <Card className={classes.titleContainer}>
            <CardContent>
              <div>
                <Typography gutterBottom variant="subtitle1">
                  Title:
                </Typography>
                <Typography variant="body1">{user.title}</Typography>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className={user.title ? classes.developerContainer : classes.developerOnlyContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Health IT Developer:
              </Typography>
              <Typography variant="body1">{developer.name}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card className={classes.dateContainer}>
          <CardContent>
            <Typography gutterBottom variant="subtitle1">
              Date:
            </Typography>
            <Typography variant="body1">
              <Moment
                date={Date.now()}
                format="DD MMM yyyy"
              />
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.editContainer}>
          <CardContent className={classes.editFields}>
            <FormControlLabel
              control={(
                <Switch
                  id="self-developer"
                  name="selfDeveloper"
                  color="primary"
                  checked={formik.values.selfDeveloper}
                  onChange={formik.handleChange}
                  className={classes.fullWidthGridRow}
                />
              )}
              label="Self-Developer"
            />
            <Divider className={classes.fullWidthGridRow} />
            { getEnhancedEditField({ key: 'fullName', display: 'Full Name', className: classes.fullWidthGridRow }) }
            { getEnhancedEditField({ key: 'email', display: 'Email' }) }
            { getEnhancedEditField({ key: 'phoneNumber', display: 'Phone' }) }
            <Divider className={classes.fullWidthGridRow} />
            { getEnhancedEditField({ key: 'line1', display: 'Address' }) }
            { getEnhancedEditField({ key: 'line2', display: 'Line 2', required: false }) }
            { getEnhancedEditField({ key: 'city', display: 'City' }) }
            { getEnhancedEditField({ key: 'state', display: 'State' }) }
            { getEnhancedEditField({ key: 'zipcode', display: 'Zip' }) }
            { getEnhancedEditField({ key: 'country', display: 'Country' }) }
            <Divider className={classes.fullWidthGridRow} />
            <div className={classes.fullWidthGridRow}>
              <ChplUrlChecker
                dispatch={handleDispatch}
                url={formik.values.website}
              />
            </div>
          </CardContent>
        </Card>
        <div className={classes.fullWidthGridRow}>
          <Button
            fullWidth
            id="submit-cr"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            { isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} /> }
            Submit Demographics Change Request
            <BorderColorIcon
              className={classes.iconSpacing}
            />
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ChplDemographicsWizardSection2;

ChplDemographicsWizardSection2.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
};
