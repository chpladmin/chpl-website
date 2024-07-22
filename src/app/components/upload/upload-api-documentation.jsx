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

const UploadFile = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'Upload', {
      event_category: 'Administrative',
      event_label: 'Api Documentation',
    })
  }
}
const RemoveFile = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'Remove Upload', {
      event_category: 'Administrative',
      event_label: 'Api Documentation',
    })
  }
}
const SubmitFile = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'Submit Upload', {
      event_category: 'Administrative',
      event_label: 'Api Documentation',
    })
  }
}

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
      item.url += `?file_update_date=${formik.values.accurateAsOf.getTime()}`;
    } else {
      item.url += `?file_update_date=${new Date(formik.values.accurateAsOf).getTime()}`;
    }
    Upload.upload(item)
      .then((response) => {
        const message = `File "${response.config.data.file.name}" was uploaded successfully.`;
        enqueueSnackbar(message, {
          variant: 'success',
        });
      })
      .catch((error) => {
        const message = `File "${error.config.data.file.name}" was not uploaded successfully.`;
        enqueueSnackbar(message, {
          variant: 'error',
        });
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
    <Card id="upload-api-documentation">
      <CardHeader title="Upload API Documentation Information" />
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
            onClickCapture={UploadFile}
          >
            Choose file to upload
            <input
              type="file"
              id="upload-file-selector"
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
                      onClick={UploadFile}
                      onClickCapture={SubmitFile}
                      endIcon={<DoneIcon />}
                      id="submit-upload-file"
                    >
                      Upload
                    </Button>
                    <Button
                      className={classes.deleteButton}
                      variant="contained"
                      onClick={clearFile}
                      onClickCapture={RemoveFile}
                      endIcon={<DeleteIcon />}
                      id="clear-upload-file"
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
