import React, { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../../themes/theme';
import { developer } from '../../../shared/prop-types/';

import { ChplTextField } from '../../util';

import ChplConfirmDeveloperAddress from './address';
import ChplConfirmDeveloperContact from './contact';

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

const setUpDeveloper = (developer) => {
  if (!developer) {
    return {developerId: 'new'};
  }
  if (!developer.developerId) {
    developer.developerId = 'new';
  }
  return developer;
};

function ChplConfirmDeveloper (props) {
  const [developer, setDeveloper] = useState(setUpDeveloper(props.developer));
  const [developers] = useState(
    [{developerId: 'new', name: '   Create a new Developer'}].concat(props.developers)
      .filter(d => !d.deleted)
      .sort((a, b) => a.name < b.name ? -1 : 1)
  );

  const formik = useFormik({
    initialValues: {
      name: props.developer?.name || '',
      website: props.developer?.website || '',
      selfDeveloper: props.developer?.selfDeveloper || false,
      line1: props.developer?.address?.line1 || '',
      line2: props.developer?.address?.line2 || '',
      city: props.developer?.address?.city || '',
      state: props.developer?.address?.state || '',
      zipcode: props.developer?.address?.zipcode || '',
      country: props.developer?.address?.country || '',
      fullName: props.developer?.contact?.fullName || '',
      title: props.developer?.contact?.title || '',
      email: props.developer?.contact?.email || '',
      phoneNumber: props.developer?.contact?.phoneNumber || '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  const handleSelectOnChange = event => {
    setDeveloper(developers.filter(d => d.developerId === event.target.value)[0]);
  };

  return (
    <ThemeProvider theme={ theme }>
      <Paper>
        <form noValidate>
          <Container>
            <Card>
              <CardHeader title={ developer.developerId === 'new' ? '   Create a new Developer' : developer.name }/>
              <CardContent>
                <Grid container spacing={ 4 }>
                  <Grid item xs={ 12 }>
                    <Typography variant="subtitle1">
                      Developer Information
                    </Typography>
                    <Divider/>
                  </Grid>
                  <Grid container item>
                    { developer.developerId !== 'new'
                      ? <Grid item xs={ 6 }>
                          <Typography variant="subtitle2">Developer Code</Typography>
                          <Typography variant="body1">{ developer.developerCode }</Typography>
                        </Grid>
                      : <Grid item xs={ 6 }>
                          <ChplTextField id="name"
                                     name="name"
                                     label="Developer Name"
                                                      value={ formik.values.name }
                                     error={ formik.touched.name && !!formik.errors.name }
                                     helperText={ formik.touched.name && formik.errors.name }
                                     onChange={ formik.handleChange }
                                     onBlur={ formik.handleBlur } />
                        </Grid>
                    }
                    { developer.developerId !== 'new'
                      ? <Grid item xs={ 6 }>
                          <Typography variant="subtitle2">Self Developer</Typography>
                          <Typography variant="body1">{ developer.selfDeveloper ? 'Yes' : 'No' }</Typography>
                        </Grid>
                      : <Grid item xs={ 6 }>
                          <FormControlLabel
                            label={ 'Self-Developer (' + (formik.values.selfDeveloper ? 'Yes' : 'No') + ')' }
                            control={
                              <Switch id="self-developer"
                                      name="selfDeveloper"
                                      color="primary"
                                      checked={ formik.values.selfDeveloper }
                                      onChange={ formik.handleChange } />
                            } />
                        </Grid>
                    }
                  </Grid>
                  { developer.developerId !== 'new'
                    ? <Grid item xs={ 12 }>
                        <Typography variant="subtitle2">Website</Typography>
                        <Typography variant="body1">{ developer.website }</Typography>
                      </Grid>
                    : <Grid item xs={ 12 }>
                        <ChplTextField id="website"
                                   name="website"
                                   label="Website"
                                                      value={ formik.values.website }
                                   error={ formik.touched.website && !!formik.errors.website }
                                   helperText={ formik.touched.website && formik.errors.website }
                                   onChange={ formik.handleChange }
                                   onBlur={ formik.handleBlur } />
                      </Grid>
                  }
                  <Grid item xs={ 12 }>
                    <ChplConfirmDeveloperAddress
                      address={developer.address}
                      editing={developer.developerId === 'new'}
                      formik={formik}
                    />
                  </Grid>
                  <Grid item xs={ 12 }>
                    <ChplConfirmDeveloperContact
                      contact={developer.contact}
                      editing={developer.developerId === 'new'}
                      formik={formik}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <FormControl>
                  <InputLabel id="selected-developer-label">Developer</InputLabel>
                  <Select
                    labelId="selected-developer-label"
                    id="selected-developer"
                    value={ developer.developerId }
                    onChange={ handleSelectOnChange }
                  >
                    { developers.map(d => {
                      return (
                        <MenuItem key={ d.developerId } value={ d.developerId }>{ d.name }{ d.developerCode && (' (Developer Code: ' + d.developerCode + ')') }</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </CardActions>
            </Card>
          </Container>
        </form>
      </Paper>
    </ThemeProvider>
  );
}

export default ChplConfirmDeveloper;

ChplConfirmDeveloper.propTypes = {
  developer: developer.isRequired,
  developers: arrayOf(developer).isRequired,
  dispatch: func.isRequired,
};
