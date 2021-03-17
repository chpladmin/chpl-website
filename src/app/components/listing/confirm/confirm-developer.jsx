import React, { useState } from 'react';
import { arrayOf } from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

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
    state: '',
    country: '',
    zipcode: '',
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
    country: props.developer?.address?.country || '',
    state: props.developer?.address?.state || '',
    zipcode: props.developer?.address?.zipcode || '',
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

  const getAddress = address => {
    return (
      <>
        { address &&
          <>
            Line 1: { address.line1 } <br />
            { address.line2 && ('Line 2: ' + address.line2 + <br />) }
            City: { address.city } <br />
            State: { address.state } <br />
            Zip: { address.zipcode } <br />
            Country: { address.country } <br />
          </>
        }
      </>
    );
  };

  const getContact = contact => {
    return (
      <>
        { contact &&
          <>
            Name: { contact.fullName } <br />
            { contact.title && ('Title: ' + contact.title + <br />) }
            Phone: { contact.phoneNumber } <br />
            Email: { contact.email } <br />
          </>
        }
      </>
    );
  };

  return (
    <ThemeProvider theme={ theme }>
      <Paper>
        { developer.developerId
          ? <>
              Developer Name: { developer.name } <br />
              Developer Code: { developer.developerCode } <br />
              Self-Developer: { developer.selfDeveloper ? 'Yes' : 'No' } <br />
              Address <br />
              { getAddress(developer.address) } <br />
              Contact <br />
              { getContact(developer.contact) } <br />
              Website: { developer.website}
            </>
          : <form noValidate>
              <TextField id="name"
                         name="name"
                         label="Developer Name"
                         error={ !!errors.name }
                         helperText={ errors.name }
                         value={ formValues.name }
                         onChange={ handleTextOnChange } />
              <TextField id="website"
                         name="website"
                         label="Website"
                         error={ !!errors.website }
                         helperText={ errors.website }
                         value={ formValues.website }
                         onChange={ handleTextOnChange } />
              <FormControlLabel
                label={ 'Self-Developer (' + (formValues.selfDeveloper ? 'Yes' : 'No') + ')' }
                control={
                  <Switch id="self-developer"
                          name="selfDeveloper"
                          color="primary"
                          checked={ formValues.selfDeveloper }
                          onChange={ handleSwitchOnChange } />
                } />
              <TextField id="line1"
                         name="line1"
                         label="Line 1"
                         error={ !!errors.line1 }
                         helperText={ errors.line1 }
                         value={ formValues.line1 }
                         onChange={ handleTextOnChange } />
              <TextField id="line2"
                         name="line2"
                         label="Line 2"
                         value={ formValues.line2 }
                         onChange={ handleTextOnChange } />
              <TextField id="city"
                         name="city"
                         label="City"
                         error={ !!errors.city }
                         helperText={ errors.city }
                         value={ formValues.city }
                         onChange={ handleTextOnChange } />
              <TextField id="state"
                         name="state"
                         label="State"
                         error={ !!errors.state }
                         helperText={ errors.state }
                         value={ formValues.state }
                         onChange={ handleTextOnChange } />
              <TextField id="zipcode"
                         name="zipcode"
                         label="Zip"
                         error={ !!errors.zipcode }
                         helperText={ errors.zipcode }
                         value={ formValues.zipcode }
                         onChange={ handleTextOnChange } />
              <TextField id="country"
                         name="country"
                         label="Country"
                         error={ !!errors.country }
                         helperText={ errors.country }
                         value={ formValues.country }
                         onChange={ handleTextOnChange } />
              <TextField id="fullName"
                         name="fullName"
                         label="Full Name"
                         error={ !!errors.fullName }
                         helperText={ errors.fullName }
                         value={ formValues.fullName }
                         onChange={ handleTextOnChange } />
              <TextField id="title"
                         name="title"
                         label="Title"
                         value={ formValues.title }
                         onChange={ handleTextOnChange } />
              <TextField id="email"
                         name="email"
                         label="Email"
                         error={ !!errors.email }
                         helperText={ errors.email }
                         value={ formValues.email }
                         onChange={ handleTextOnChange } />
              <TextField id="phoneNumber"
                         name="phoneNumber"
                         label="Phone Number"
                         error={ !!errors.phoneNumber }
                         helperText={ errors.phoneNumber }
                         value={ formValues.phoneNumber }
                         onChange={ handleTextOnChange } />
            </form>
        }
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
                <MenuItem key={ d.developerId } value={ d.developerId }>{ d.name }</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Paper>
    </ThemeProvider>
  );
}

export { ChplConfirmDeveloper };

ChplConfirmDeveloper.propTypes = {
  developer: developer,
  developers: arrayOf(developer),
};
