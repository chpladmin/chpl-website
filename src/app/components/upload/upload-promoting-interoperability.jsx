import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../themes/theme';
import { getAngularService } from '../../services/angular-react-helper';
import { ChplTextField } from '../util';

const useStyles = makeStyles(() => ({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  gridStyle: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridRowGap: '8px',
    gridColumnGap: '8px',
  },
  fullRow: {
    gridColumn: '1 / -1',
  },
}));

const validationSchema = yup.object({
  accurateAsOf: yup.date()
    .required('Accurate as of date is required'),
});

function ChplUploadPromotingInteroperability() {
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const $state = getAngularService('$state');
  const toaster = getAngularService('toaster');
  const classes = useStyles();
  let formik;

  const clearFile = () => {
    setFile(undefined);
    ele.value = null;
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setEle(event.target);
  };

  const uploadFile = () => {
    const item = {
      url: `${API}/promoting-interoperability/upload`,
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
        'API-Key': authService.getApiKey(),
      },
      data: {
        file,
      },
    };
    if (typeof formik.values.accurateAsOf === 'object') {
      item.url += `?accurate_as_of=${formik.values.accurateAsOf.getTime()}`;
    } else {
      item.url += `?accurate_as_of=${new Date(formik.values.accurateAsOf).getTime()}`;
    }
    Upload.upload(item)
      .then((response) => {
        const message = `File "${response.config.data.file.name}" was uploaded successfully. The file will be processed and an email will be sent to ${response.data.job.jobDataMap.user.email} when processing is complete`;
        toaster.pop({
          type: 'success',
          title: 'Success',
          body: message,
        });
        $state.go('administration.jobs.scheduled');
      })
      .catch((error) => {
        let message = `File "${file.name}" was not uploaded successfully.`;
        if (error?.data?.errorMessages) {
          message += ` ${error.data.errorMessages.join(', ')}`;
        }
        toaster.pop({
          type: 'error',
          title: 'Error',
          body: message,
        });
      })
      .finally(() => {
        formik.resetForm();
        clearFile();
      });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      accurateAsOf: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      uploadFile();
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Upload Promoting Interoperability Users" subtitle="CSV files only" />
        <CardContent>
          <div className={classes.gridStyle}>
            <Typography variant="body1" className={classes.fullRow}>
              CSV files only
            </Typography>
            <div>
              <Button
                color="primary"
                variant={file ? 'outlined' : 'contained'}
                component="label"
              >
                Choose file to upload
                <input
                  type="file"
                  id="upload-promoting-interoperability"
                  onChange={onFileChange}
                  style={{ display: 'none' }}
                />
              </Button>
            </div>
            { file
              && (
              <div>
                <strong>Filename:</strong>
                {' '}
                { file.name }
              </div>
              )}
            { file
              && (
              <div>
                <strong>File size:</strong>
                {' '}
                { file.size }
              </div>
              )}
            { file
              && (
              <div>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={formik.handleSubmit}
                >
                  <i className="fa fa-cloud-upload" />
                  {' '}
                  Upload
                </Button>
                <Button
                  className={classes.deleteButton}
                  variant="contained"
                  onClick={clearFile}
                >
                  <i className="fa fa-trash-o" />
                  {' '}
                  Remove
                </Button>
              </div>
              )}
            <div className={classes.fullRow}>
              <ChplTextField
                type="date"
                id="accurate-as-of"
                name="accurateAsOf"
                label="Enter the Accurate As of date for Promoting Interoperability Users associated with this upload"
                required
                value={formik.values.accurateAsOf}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.accurateAsOf && !!formik.errors.accurateAsOf}
                helperText={formik.touched.accurateAsOf && formik.errors.accurateAsOf}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ChplUploadPromotingInteroperability;

ChplUploadPromotingInteroperability.propTypes = {};
