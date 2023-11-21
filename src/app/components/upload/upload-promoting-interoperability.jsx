import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import DoneIcon from '@material-ui/icons/Done';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';

const useStyles = makeStyles({
  buttonUploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
  deleteButton: {
    border: '1px solid #c44f65',
    backgroundColor: '#FFFFFF',
    color: '#c44f65',
    '&:hover': {
      border: '1px solid #853544',
      color: '#853544',
    },
  },
  fileName: {
    wordBreak: 'break-word',
  },
  uploadContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
  },
  fileUploadContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: '1px solid #EEEEEE',
    marginTop: '16px',
    paddingTop: '16px',
  },
});

const validationSchema = yup.object({
  accurateAsOf: yup.date()
    .required('Enter the most accurate date for Promoting Interoperability Users associated with this upload, field required.'),
});

function ChplUploadPromotingInteroperability() {
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const { enqueueSnackbar } = useSnackbar();
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
        enqueueSnackbar(message, {
          variant: 'success',
        });
      })
      .catch((error) => {
        let message = `File "${file.name}" was not uploaded successfully.`;
        if (error?.data?.errorMessages) {
          message += ` ${error.data.errorMessages.join(', ')}`;
        }
        enqueueSnackbar(message, {
          variant: 'error',
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
    <Card>
      <CardHeader title="Upload Promoting Interoperability Users" />
      <CardContent>
        <div className={classes.uploadContentContainer}>
          <Typography gutterBottom variant="body1">
            <strong>CSV files only</strong>
          </Typography>
          <ChplTextField
            type="date"
            id="promoting-interoperability-accurate-as-of"
            name="accurateAsOf"
            label="Date for Promoting Interoperability Users with this upload"
            required
            value={formik.values.accurateAsOf}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.accurateAsOf && !!formik.errors.accurateAsOf}
            helperText={formik.touched.accurateAsOf && formik.errors.accurateAsOf}
          />
          <div>
            <Button
              color="primary"
              variant="outlined"
              component="label"
              endIcon={<CloudUploadOutlinedIcon />}
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
              <Box className={classes.fileUploadContainer}>
                <Box className={classes.fileUploadContent}>
                  <div className={classes.fileName}>
                    <strong>Filename:</strong>
                    {' '}
                    { file.name }
                  </div>
                  { file
                    && (
                      <div>
                        <strong>File size:</strong>
                        {' '}
                        { file.size }
                      </div>
                    )}
                </Box>
                { file
                  && (
                    <div className={classes.buttonUploadContainer}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={formik.handleSubmit}
                        endIcon={<DoneIcon />}
                      >
                        Upload
                      </Button>
                      <Button
                        className={classes.deleteButton}
                        variant="contained"
                        onClick={clearFile}
                        endIcon={<DeleteIcon />}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
              </Box>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ChplUploadPromotingInteroperability;

ChplUploadPromotingInteroperability.propTypes = {};
