import React, { useState } from 'react';
import {getAngularService} from './';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../themes/theme';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import ValidateJS from 'validate.js';

function ChplApiKeyRegistration () {
  //const $log = getAngularService('$log');
  const networkService = getAngularService('networkService');
  const [formValues, setFormValues] = useState({email: '', nameOrganization: ''});
  const [errors, setErrors] = useState({email: '', nameOrganization: ''});
  const [toast, setToast] = useState({ open: false, message: '', severity: '' });

  const handleEmailOnChange = (event) => {
    setErrors({ ...errors, email: getEmailErrorMessage(event.target.value) });
    setFormValues({ ...formValues, email: event.target.value });
  };

  const handleNameOrganizationOnChange = (event) => {
    setErrors({ ...errors, nameOrganization: getNameOrOrganizationErrorMessage(event.target.value) });
    setFormValues({ ...formValues, nameOrganization: event.target.value });
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();

    if (!validateAll()) {
      return;
    }
    networkService.requestApiKey({ email: formValues.email, name: formValues.nameOrganization })
      .then((response) => {
        if (response.success) {
          setToast({
            severity: 'success',
            message: 'To confirm your email address, an email was sent to: ' + formValues.email + '  Please follow the instructions in the email to obtain your API key.',
            open: true,
          });
          setFormValues({ email: '', nameOrganization: '' });
        }
      }, error => {
        setToast({
          severity: 'error',
          message: error.data.errorMessages[0],
          open: true,
        });
      });
  };

  const validateAll = () => {
    const temp = {};
    temp.email = getEmailErrorMessage(formValues.email);
    temp.nameOrganization = getNameOrOrganizationErrorMessage(formValues.nameOrganization);
    setErrors(temp);
    return Object.values(temp).every(error => error.length === 0);
  };

  const getEmailErrorMessage = (email) => {
    return ValidateJS.single(email, {email: true, presence: true});
  };

  const getNameOrOrganizationErrorMessage = (name) => {
    return name.length > 0 ? '' : 'Name or Organization is required';
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  };

  return (
    <ThemeProvider theme={ theme }>
      <Card>
        <CardHeader title='Register' />
        <CardContent>
          <div style={gridStyle}>
            <Typography variant='body1'>
              You must register to use this API.
            </Typography>
            <TextField fullWidth
                        error={ errors.nameOrganization.length > 0 }
                        label='Name or Organization'
                        helperText={ errors.nameOrganization }
                        value={ formValues.nameOrganization }
                        onChange={ handleNameOrganizationOnChange }/>
            <TextField fullWidth
                          type='email'
                          error={ errors.email.length > 0 }
                          label='Email'
                          helperText={ errors.email }
                          value={ formValues.email }
                          onChange={ handleEmailOnChange } />
          </div>
        </CardContent>
        <CardActions>
          <Button fullWidth color='primary' variant='contained' onClick={handleRegisterClick} onMouseOver={ validateAll }>Register</Button>
        </CardActions>
      </Card>
      <Snackbar open={ toast.open }
        //autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}>
        <MuiAlert onClose={ handleToastClose } severity={ toast.severity }>
          { toast.message }
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export { ChplApiKeyRegistration };

ChplApiKeyRegistration.propTypes = {

};
