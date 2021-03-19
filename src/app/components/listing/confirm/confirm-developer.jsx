import React, { useState } from 'react';
import { arrayOf } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
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
  TextField,
  Typography,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { developer } from '../../../shared/prop-types/';

function ChplConfirmDeveloper (props) {
  const [developer, setDeveloper] = useState(props.developer || {developerId: undefined});
  const [developers] = useState(
    props.developers
      .filter(d => !d.deleted)
      .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  );
  const [errors, setErrors] = useState({
    name: '',
    website: '',
    line1: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [formValues, setFormValues] = useState({
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
  });

  const handleSelectOnChange = event => {
    setDeveloper(developers.filter(d => d.developerId === event.target.value)[0]);
  };

  const handleSwitchOnChange = event => {
    setFormValues({ ...formValues, [event.target.name]: event.target.checked });
  };

  const handleTextOnChange = event => {
    setErrors({ ...errors, [event.target.name]: !event.target.value && 'Value is required' });
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
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
                <TextField id="line1"
                           name="line1"
                           label="Line 1"
                           variant="outlined"
                           error={ !!errors.line1 }
                           helperText={ errors.line1 }
                           value={ formValues.line1 }
                           onChange={ handleTextOnChange } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Line 1</Typography>
                <Typography variant="body1">{ address?.line1 }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <TextField id="line2"
                           name="line2"
                           label="Line 2"
                           variant="outlined"
                           value={ formValues.line2 }
                           onChange={ handleTextOnChange } />
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
                <TextField id="city"
                           name="city"
                           label="City"
                           variant="outlined"
                           error={ !!errors.city }
                           helperText={ errors.city }
                           value={ formValues.city }
                           onChange={ handleTextOnChange } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">City</Typography>
                <Typography variant="body1">{ address?.city }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <TextField id="state"
                           name="state"
                           label="State"
                           variant="outlined"
                           error={ !!errors.state }
                           helperText={ errors.state }
                           value={ formValues.state }
                           onChange={ handleTextOnChange } />
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
                <TextField id="zipcode"
                           name="zipcode"
                           label="Zip"
                           variant="outlined"
                           error={ !!errors.zipcode }
                           helperText={ errors.zipcode }
                           value={ formValues.zipcode }
                           onChange={ handleTextOnChange } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Zip</Typography>
                <Typography variant="body1">{ address?.zipcode }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <TextField id="country"
                           name="country"
                           label="Country"
                           variant="outlined"
                           error={ !!errors.country }
                           helperText={ errors.country }
                           value={ formValues.country }
                           onChange={ handleTextOnChange } />
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
                <TextField id="fullName"
                           name="fullName"
                           label="Name"
                           variant="outlined"
                           error={ !!errors.fullName }
                           helperText={ errors.fullName }
                           value={ formValues.fullName }
                           onChange={ handleTextOnChange } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1">{ contact?.fullName }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <TextField id="title"
                           name="title"
                           label="Title"
                           variant="outlined"
                           value={ formValues.title }
                           onChange={ handleTextOnChange } />
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
                <TextField id="email"
                           name="email"
                           label="Email"
                           variant="outlined"
                           error={ !!errors.email }
                           helperText={ errors.email }
                           value={ formValues.email }
                           onChange={ handleTextOnChange } />
              </Grid>
            : <Grid item xs={ 6 }>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1">{ contact?.email }</Typography>
              </Grid>
          }
          { editing
            ? <Grid item xs={ 6 }>
                <TextField id="phoneNumber"
                           name="phoneNumber"
                           label="Phone"
                           variant="outlined"
                           error={ !!errors.phoneNumber }
                           helperText={ errors.phoneNumber }
                           value={ formValues.phoneNumber }
                           onChange={ handleTextOnChange } />
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
              <CardHeader title={ developer.name }/>
              <CardContent>
                <Grid container spacing={ 4 }>
                  <Grid item xs={ 12 }>
                    <Typography variant="subtitle1">
                      Developer Information
                    </Typography>
                    <Divider/>
                  </Grid>
                  <Grid container item>
                    { developer.developerId
                      ? <Grid item xs={ 6 }>
                          <Typography variant="subtitle2">Developer Code</Typography>
                          <Typography variant="body1">{ developer.developerCode }</Typography>
                        </Grid>
                      : <Grid item xs={ 6 }>
                          <TextField id="name"
                                     name="name"
                                     label="Developer Name"
                                     variant="outlined"
                                     error={ !!errors.name }
                                     helperText={ errors.name }
                                     value={ formValues.name }
                                     onChange={ handleTextOnChange } />
                        </Grid>
                    }
                    { developer.developerId
                      ? <Grid item xs={ 6 }>
                          <Typography variant="subtitle2">Self Developer</Typography>
                          <Typography variant="body1">{ developer.selfDeveloper ? 'Yes' : 'No' }</Typography>
                        </Grid>
                      : <Grid item xs={ 6 }>
                          <FormControlLabel
                            label={ 'Self-Developer (' + (formValues.selfDeveloper ? 'Yes' : 'No') + ')' }
                            control={
                              <Switch id="self-developer"
                                      name="selfDeveloper"
                                      color="primary"
                                      checked={ formValues.selfDeveloper }
                                      onChange={ handleSwitchOnChange } />
                            } />
                        </Grid>
                    }
                  </Grid>
                  { developer.developerId
                    ? <Grid item xs={ 12 }>
                        <Typography variant="subtitle2">Website</Typography>
                        <Typography variant="body1">{ developer.website }</Typography>
                      </Grid>
                    : <Grid item xs={ 12 }>
                        <TextField id="website"
                                   name="website"
                                   label="Website"
                                   variant="outlined"
                                   error={ !!errors.website }
                                   helperText={ errors.website }
                                   value={ formValues.website }
                                   onChange={ handleTextOnChange } />
                      </Grid>
                  }
                  <Grid item xs={ 12 }>
                    { getAddress(developer.address, !developer.developerId) }
                  </Grid>
                  <Grid item xs={ 12 }>
                    { getContact(developer.contact, !developer.developerId) }
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <FormControl>
                  <InputLabel id="selected-developer-label">Developer</InputLabel>
                  <Select
                    labelId="selected-developer-label"
                    id="selected-developer"
                    variant="outlined"
                    value={ developer.developerId }
                    onChange={ handleSelectOnChange }
                  >
                    { developers.map(d => {
                      return (
                        <MenuItem key={ d.developerId } value={ d.developerId }>{ d.name }</MenuItem>
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

export { ChplConfirmDeveloper };

ChplConfirmDeveloper.propTypes = {
  developer: developer,
  developers: arrayOf(developer),
};
