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

  const getAddress = (address, editing) => {
    return (
      <>
        { (address || !editing) &&
          <Grid item xs={ 12 }>
            <Typography variant="subtitle1">
              Address
            </Typography>
            <Divider/>
          </Grid>
        }
        <Grid container item>
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="line1"
                           name="line1"
                           label="Line 1"
                                  value={ formik.values.line1 }
                           error={ formik.touched.line1 && !!formik.errors.line1 }
                           helperText={ formik.touched.line1 && formik.errors.line1 }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Line 1</Typography>
                <Typography variant="body1">{ address?.line1 }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="line2"
                           name="line2"
                           label="Line 2"
                                  value={ formik.values.line2 }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Line 2</Typography>
                <Typography variant="body1">{ address?.line2 }</Typography>
              </Grid>
          }
        </Grid>
        <Grid container item>
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="city"
                           name="city"
                           label="City"
                                  value={ formik.values.city }
                           error={ formik.touched.city && !!formik.errors.city }
                           helperText={ formik.touched.city && formik.errors.city }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">City</Typography>
                <Typography variant="body1">{ address?.city }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="state"
                           name="state"
                           label="State"
                                  value={ formik.values.state }
                           error={ formik.touched.state && !!formik.errors.state }
                           helperText={ formik.touched.state && formik.errors.state }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">State</Typography>
                <Typography variant="body1">{ address?.state }</Typography>
              </Grid>
          }
        </Grid>
        <Grid container item>
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="zipcode"
                           name="zipcode"
                           label="Zip"
                                  value={ formik.values.zipcode }
                           error={ formik.touched.zipcode && !!formik.errors.zipcode }
                           helperText={ formik.touched.zipcode && formik.errors.zipcode }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Zip</Typography>
                <Typography variant="body1">{ address?.zipcode }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="country"
                           name="country"
                           label="Country"
                                  value={ formik.values.country }
                           error={ formik.touched.country && !!formik.errors.country }
                           helperText={ formik.touched.country && formik.errors.country }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Country</Typography>
                <Typography variant="body1">{ address?.country }</Typography>
              </Grid>
          }
        </Grid>
      </>
    );
  };

  const getContact = (contact, editing) => {
    return (
      <>
        { (contact || !editing) &&
          <Grid item xs={ 12 }>
            <Typography variant="subtitle1">
              Contact
            </Typography>
            <Divider/>
          </Grid>
        }
        <Grid container item>
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="fullName"
                           name="fullName"
                           label="Name"
                                  value={ formik.values.fullName }
                           error={ formik.touched.fullName && !!formik.errors.fullName }
                           helperText={ formik.touched.fullName && formik.errors.fullName }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1">{ contact?.fullName }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="title"
                           name="title"
                           label="Title"
                                  value={ formik.values.title }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Title</Typography>
                <Typography variant="body1">{ contact?.title }</Typography>
              </Grid>
          }
        </Grid>
        <Grid container item>
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="email"
                               name="email"
                               label="Email"
                               value={ formik.values.email }
                               error={ formik.touched.email && !!formik.errors.email }
                               helperText={ formik.touched.email && formik.errors.email }
                               onChange={ formik.handleChange }
                               onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1">{ contact?.email }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <ChplTextField id="phoneNumber"
                           name="phoneNumber"
                           label="Phone"
                                  value={ formik.values.phoneNumber }
                           error={ formik.touched.phoneNumber && !!formik.errors.phoneNumber }
                           helperText={ formik.touched.phoneNumber && formik.errors.phoneNumber }
                           onChange={ formik.handleChange }
                           onBlur={ formik.handleBlur } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body1">{ contact?.phoneNumber }</Typography>
              </Grid>
          }
        </Grid>
      </>
    );
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
                    { getAddress(developer.address, developer.developerId === 'new') }
                  </Grid>
                  <Grid item xs={ 12 }>
                    { getContact(developer.contact, developer.developerId === 'new') }
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
