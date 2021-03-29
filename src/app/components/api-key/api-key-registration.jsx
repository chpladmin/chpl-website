import React from 'react';
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
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
  longLabelFix: {
    paddingRight: '4px',
    backgroundColor: '#ffffff',
  },
}));

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
  nameOrganization: yup.string()
    .required('Name or Organization is required'),
});

function ChplApiKeyRegistration () {
  //const $log = getAngularService('$log');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');

  const formik = useFormik({
    initialValues: {email: '', nameOrganization: ''},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createRequest(values);
    },
    validateOnChange: false,
    validateOnMount: true,
  });

  const createRequest = (values) => {
    networkService.requestApiKey({ email: values.email, name: values.nameOrganization })
      .then((response) => {
        if (response.success) {
          toaster.pop({
            type: 'success',
            body: 'To confirm your email address, an email was sent to: ' + values.email + '  Please follow the instructions in the email to obtain your API key.',
          });
          formik.resetForm();
        }
      }, (error) => {
        toaster.pop({
          type: 'error',
          body: error.data.errorMessages[0],
        });
      });
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
                       variant="outlined"
                       id='name-organization'
                       name='nameOrganization'
                       label='Name or Organization'
                       value={ formik.values.nameOrganization }
                       onChange={ formik.handleChange }
                       onBlur={ formik.handleBlur }
                       error={ formik.touched.nameOrganization && Boolean(formik.errors.nameOrganization) }
                       helperText={ formik.touched.nameOrganization && formik.errors.nameOrganization }
                       InputLabelProps={{ classes: { root: classes.longLabelFix } }} />
            <TextField fullWidth
                       variant="outlined"
                       id='email'
                       name='email'
                       label='Email'
                       value={ formik.values.email }
                       onChange={ formik.handleChange }
                       onBlur={ formik.handleBlur }
                       error={ formik.touched.email && Boolean(formik.errors.email) }
                       helperText={ formik.touched.email && formik.errors.email } />
          </div>
        </CardContent>
        <CardActions>
          <Button fullWidth color='primary'
                  id='register-button'
                  name='registerButton'
                  variant='contained'
                  disabled={ !formik.isValid }
                  onClick={ formik.handleSubmit }>
            Register
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export { ChplApiKeyRegistration };

ChplApiKeyRegistration.propTypes = { };
