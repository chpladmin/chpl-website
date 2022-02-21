import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplConfirmDeveloperAddress from './address';
import ChplConfirmDeveloperContact from './contact';

import { ChplTextField } from 'components/util';
import { developer as developerProp } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  buttonCard: {
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#f5f9fd',
    whiteSpace: 'pre-wrap',
  },
  buttonCardFocused: {
    boxShadow: '0px 0px 16px 4px #337ab750',
    fontWeight: '600',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    whiteSpace: 'pre-wrap',
  },
  developerConfirm: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '32px',
    alignItems: 'start',
  },
  developerSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'self-start',
    textAlign: 'center',
    gap: '32px',
  },
  developerInfo: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr 1fr',
  },
  extraLargeIcons: {
    marginBottom: '8px',
    fontSize: '2em',
  },
  formContainer: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
  },
  formSubContainer: {
    display: 'grid',
    gap: '16px',
    flexDirection: 'row',
    gridTemplateColumns: '1fr',
  },
  orContainer: {
    display: 'flex',
    gap: '4px',
    flexDirection: 'column',
    paddingTop: '32px',
  },
  rejectButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  selectedDeveloper: {
    fontWeight: '100',
    paddingTop: '8px',
  },
  verticalDivider: {
    height: '25%',
  },
}));

const validationSchema = yup.object({
  name: yup.string()
    .required('Developer Name is required'),
  website: yup.string()
    .required('Website is required')
    .url('Enter a valid website'),
  line1: yup.string()
    .required('Line 1 is required'),
  city: yup.string()
    .required('City is required'),
  state: yup.string()
    .required('State is required'),
  zipcode: yup.string()
    .required('Zip is required'),
  country: yup.string()
    .required('Country is required'),
  fullName: yup.string()
    .required('Name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
  phoneNumber: yup.string()
    .required('Phone is required'),
});

function ChplConfirmDeveloper(props) {
  /* eslint-disable react/destructuring-assignment */
  const developer = {
    ...props.developer,
  };
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const developers = props.developers
    .filter((d) => !d.deleted)
    .sort((a, b) => (a.name < b.name ? -1 : 1));
  const [isCreating, setIsCreating] = useState(!props.developer.developerId);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    const foundDeveloper = props.developers.find((d) => d.developerId === props.developer.developerId);
    if (foundDeveloper) {
      setSelectedDeveloper(foundDeveloper);
    }
  }, [props.developer, props.developers]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleCreationToggle = (creating) => {
    if (isCreating !== creating) {
      if (isCreating) {
        if (selectedDeveloper) {
          props.dispatch('select', selectedDeveloper);
        }
      } else {
        formik.handleSubmit();
      }
      setIsCreating(creating);
    }
  };

  const handleChange = (...args) => {
    formik.handleChange(...args);
    formik.handleSubmit();
  };

  const handleSelectOnChange = (event) => {
    props.dispatch('select', event.target.value);
    setSelectedDeveloper(event.target.value);
  };

  const classes = useStyles();

  const submit = () => {
    props.dispatch('edit', {
      name: formik.values.name,
      website: formik.values.website,
      selfDeveloper: formik.values.selfDeveloper,
      address: {
        line1: formik.values.line1,
        line2: formik.values.line2,
        city: formik.values.city,
        state: formik.values.state,
        zipcode: formik.values.zipcode,
        country: formik.values.country,
      },
      contact: {
        fullName: formik.values.fullName,
        title: formik.values.title,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
      },
    });
  };

  formik = useFormik({
    initialValues: {
      name: developer?.name || '',
      website: developer?.website || '',
      selfDeveloper: developer?.selfDeveloper || false,
      line1: developer?.address?.line1 || '',
      line2: developer?.address?.line2 || '',
      city: developer?.address?.city || '',
      state: developer?.address?.state || '',
      zipcode: developer?.address?.zipcode || '',
      country: developer?.address?.country || '',
      fullName: developer?.contact?.fullName || '',
      title: developer?.contact?.title || '',
      email: developer?.contact?.email || '',
      phoneNumber: developer?.contact?.phoneNumber || '',
    },
    onSubmit: () => {
      submit();
    },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div className={classes.developerConfirm}>
          <div className={classes.developerSubContainer}>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              className={`${classes.buttonCard} ${!isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(false)}
            >
              <span className={classes.buttonContent}>
                <CheckCircleIcon color="primary" className={classes.extraLargeIcons} />
                { selectedDeveloper
                  ? (
                    <>
                      {`Use "${selectedDeveloper.name}"`}
                    </>
                  ) : (
                    <>
                      Choose A Developer To Use
                    </>
                  )}
              </span>
            </Button>
            <div className={classes.orContainer}>
              <Divider />
              <Typography>OR</Typography>
              <Divider />
            </div>
            <Button
              variant="outlined"
              color="default"
              fullWidth
              className={`${classes.buttonCard} ${isCreating ? classes.buttonCardFocused : ''}`}
              onClick={() => handleCreationToggle(true)}
            >
              <span className={classes.buttonContent}>
                <AddCircleIcon color="primary" className={classes.extraLargeIcons} />
                Create a developer
              </span>
            </Button>
          </div>
          <Divider />
          { isCreating
            ? (
              <Card>
                <CardHeader title="Create A New Developer" />
                <CardContent>
                  <div className={classes.formContainer}>
                    <div className={classes.formSubContainer}>
                      <div className={classes.developerInfo}>
                        <ChplTextField
                          id="name"
                          name="name"
                          label="Developer Name"
                          value={formik.values.name}
                          error={formik.touched.name && !!formik.errors.name}
                          helperText={formik.touched.name && formik.errors.name}
                          onChange={handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <FormControlLabel
                          label={`Self-Developer (${formik.values.selfDeveloper ? 'Yes' : 'No'})`}
                          control={(
                            <Switch
                              id="self-developer"
                              name="selfDeveloper"
                              color="primary"
                              checked={formik.values.selfDeveloper}
                              onChange={handleChange}
                            />
                         )}
                        />
                      </div>
                      <ChplTextField
                        id="website"
                        name="website"
                        label="Website"
                        value={formik.values.website}
                        error={formik.touched.website && !!formik.errors.website}
                        helperText={formik.touched.website && formik.errors.website}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className={classes.formSubContainer}>
                      <ChplConfirmDeveloperAddress
                        address={developer.address}
                        editing
                        formik={formik}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className={classes.formSubContainer}>
                      <ChplConfirmDeveloperContact
                        contact={developer.contact}
                        editing
                        formik={formik}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader title="Existing Developers" />
                <CardContent>
                  <ChplTextField
                    select
                    id="selected-developer"
                    name="selectedDeveloper"
                    label="Select a Developer"
                    required
                    value={selectedDeveloper}
                    onChange={handleSelectOnChange}
                  >
                    {developers.map((item) => (
                      <MenuItem value={item} key={item.developerId}>
                        {item.name}
                        {item.developerCode && (` (Developer Code: ${item.developerCode})`)}
                      </MenuItem>
                    ))}
                  </ChplTextField>
                </CardContent>
              </Card>
            )}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default ChplConfirmDeveloper;

ChplConfirmDeveloper.propTypes = {
  developer: developerProp.isRequired,
  developers: arrayOf(developerProp).isRequired,
  dispatch: func.isRequired,
};
