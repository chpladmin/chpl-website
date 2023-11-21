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
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
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
    .required('Enter the most accurate date for API Documentation associated with this upload, field required.'),
});

function ChplUploadApiDocumentation() {
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
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
      url: `${API}/files/api_documentation`,
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
        if (response.status === 206) {
          const message = `Partial success: File "${response.config.data.file.name}" was uploaded successfully, however there ${response.data.errorMessages.length !== 1 ? 'were errors' : 'was an error'} in the file.<ul>${response.data.errorMessages.map((m) => (`<li>${m}</li>`)).join()}</ul>${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          enqueueSnackbar(message, {
            variant: 'warning',
          });
        } else {
          const message = `Success: File "${response.config.data.file.name}" was uploaded successfully. ${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          enqueueSnackbar(message, {
            variant: 'success',
          });
        }
        if (response.headers.warning === '299 - "Deprecated upload template"') {
          const message = 'Warning: The version of the upload file you used is still valid, but has been deprecated. It will be removed as a valid format in the future. A newer version of the upload file is available.';
          enqueueSnackbar(message, {
            variant: 'warning',
          });
        }
      })
      .finally(() => {
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
      <CardHeader title="Upload API Documentation" />
      <CardContent>
        <div className={classes.uploadContentContainer}>
          <Typography gutterBottom variant="body1"><strong>No requirements on file type</strong></Typography>
          <ChplTextField
            type="date"
            id="api-documentation-accurate-as-of"
            name="accurateAsOf"
            label="Date for API Documentation with this upload"
            required
            value={formik.values.accurateAsOf}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.accurateAsOf && !!formik.errors.accurateAsOf}
            helperText={formik.touched.accurateAsOf && formik.errors.accurateAsOf}
          />
          <Button
            color="primary"
            variant="outlined"
            component="label"
            endIcon={<CloudUploadOutlinedIcon />}
          >
            Choose file to upload
            <input
              type="file"
              id="upload-api-documentation"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
          </Button>
        </div>
        { file
          && (
            <Box className={classes.fileUploadContainer}>
              <Box className={classes.fileUploadContent}>
                <div>
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
                      onClick={uploadFile}
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
      </CardContent>
    </Card>
  );
}

export default ChplUploadApiDocumentation;

ChplUploadApiDocumentation.propTypes = {
};
