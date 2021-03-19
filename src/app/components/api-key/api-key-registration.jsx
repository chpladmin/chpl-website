import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {getAngularService} from './';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../themes/theme';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import isEmail from 'validator/es/lib/isEmail';
import isEmpty from 'validator/es/lib/isEmpty';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
}));

function ChplApiKeyRegistration () {
  const $log = getAngularService('$log');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const [formValues, setFormValues] = useState({email: '', nameOrganization: ''});
  const [errors, setErrors] = useState({email: '', nameOrganization: ''});

  const handleEmailOnChange = (event) => {
    setFormValues({ ...formValues, email: event.target.value });
  };

  const handleEmailOnBlur = () => {
    setErrors({ ...errors, email: getEmailErrorMessage(formValues.email) });
  };

  const handleNameOrganizationOnChange = (event) => {
    setFormValues({ ...formValues, nameOrganization: event.target.value });
  };

  const handleNameOrganizationOnBlur = () => {
    setErrors({ ...errors, nameOrganization: getNameOrOrganizationErrorMessage(formValues.nameOrganization) });
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();
    validateAll();
    if (doErrorsExist()) {
      $log.info('There were errors...');
      return;
    }
    networkService.requestApiKey({ email: formValues.email, name: formValues.nameOrganization })
      .then((response) => {
        if (response.success) {
          toaster.pop({
            type: 'success',
            body: 'To confirm your email address, an email was sent to: ' + formValues.email + '  Please follow the instructions in the email to obtain your API key.',
          });
          setFormValues({ email: '', nameOrganization: '' });
          setErrors({ email: '', nameOrganization: '' });
        }
      }, error => {
        toaster.pop({
          type: 'error',
          body: error.data.errorMessages[0],
        });
      });
  };

  const validateAll = () => {
    const temp = {};
    temp.email = getEmailErrorMessage(formValues.email);
    temp.nameOrganization = getNameOrOrganizationErrorMessage(formValues.nameOrganization);
    setErrors(temp);
    $log.info('ValidateAll...');
  };

  const doErrorsExist = () => {
    return !Object.values(errors).every(error => error.length === 0);
  };

  const getEmailErrorMessage = (email) => {
    if (isEmpty(email, {ignore_whitespace: true})) {
      return 'Email is required';
    } else if (!isEmail(email)) {
      return '\'' + email + '\' is not a poperly formatted email address';
    } else {
      return '';
    }
  };

  const getNameOrOrganizationErrorMessage = (name) => {
    return isEmpty(name, {ignore_whitespace: true}) ? 'Name or Organization is required' : '';
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={ theme }>
      <Card>
        <CardHeader title='Register' />
        <CardContent>
          <div className={ classes.grid }>
            <Typography variant='body1'>
              You must register to use this API.
            </Typography>
            <TextField fullWidth
                        error={ !isEmpty(errors.nameOrganization) }
                        label='Name or Organization'
                        helperText={ errors.nameOrganization }
                        value={ formValues.nameOrganization }
                        onChange={ handleNameOrganizationOnChange }
                        onBlur={ handleNameOrganizationOnBlur }/>
            <TextField fullWidth
                          type='email'
                          error={ !isEmpty(errors.email) }
                          label='Email'
                          helperText={ errors.email }
                          value={ formValues.email }
                          onChange={ handleEmailOnChange }
                          onBlur={ handleEmailOnBlur }/>
          </div>
        </CardContent>
        <CardActions>
          <Button fullWidth color='primary'
                  variant='contained'
                  onClick={ handleRegisterClick }
                  onMouseOver={ validateAll }>
            Register
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export { ChplApiKeyRegistration };

ChplApiKeyRegistration.propTypes = { };
