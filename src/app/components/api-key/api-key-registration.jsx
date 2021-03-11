import React, { useState } from 'react';
//import {arrayOf, bool, number, shape, string} from 'prop-types';
//import { getAngularService } from './';
import {ThemeProvider} from '@material-ui/core/styles';
//import theme from '../../themes/theme';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';

function ChplApiKeyRegistration () {
  const [formValues, setFormValues] = useState({email: '', nameOrganization: ''});
  const [errors, setErrors] = useState({email: '', nameOrganization: ''});
  const handleEmailOnChange = (event) => {
    setFormValues({ ...formValues, email: event.target.value });
  };

  const handleNameOrganizationOnChange = (event) => {
    setFormValues({ ...formValues, nameOrganization: event.target.value });
  };

  const handleSubmit = (event) => {
    alert('HandleSubmit');
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    alert('Perforn network call');
  };

  const validateForm = () => {
    const temp = {};
    temp.email = formValues.email.length > 0 ? '' : 'Email is required';
    temp.nameOrganization = formValues.nameOrganization.length > 0 ? '' : 'Name or Organization is reuired';
    setErrors(...temp);
    return temp.every(error => error.length === 0);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
  };

  return (
    <ThemeProvider>
      <form onSubmit={ handleSubmit }>
        <Card>
          <CardHeader title='Register' />
          <CardContent>
            <div style={gridStyle}>
              <div>
                You must register to use this API.
              </div>
              <div>
                <TextField fullWidth
                           error={ errors.nameOrganization.length > 0 }
                           label='Name or Organization'
                           helperText={ errors.nameOrganization }
                           value={ formValues.nameOrganization }
                           onChange={ handleNameOrganizationOnChange }/>
              </div>
              <div>
                <TextField fullWidth
                           error={ errors.email.length > 0 }
                           label='Email'
                           helperText={ errors.email }
                           value={ formValues.email }
                           onChange={ handleEmailOnChange } />
              </div>
            </div>
          </CardContent>
          <CardActions>
            <Button fullWidth type='submit' color='primary' variant='contained'>Register</Button>
          </CardActions>
        </Card>
      </form>
    </ThemeProvider>
  );
}

export { ChplApiKeyRegistration };

ChplApiKeyRegistration.propTypes = {

};
