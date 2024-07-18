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
import { useSnackbar } from 'notistack';

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

function ChplUploadListings() {
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
  const classes = useStyles();

  const clearFile = () => {
    setFile(undefined);
    ele.value = null;
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setEle(event.target);
  };
  const UploadListing = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'Upload', {
        event_category: 'Administrative',
        event_label: 'Listing Upload',
      })
    }
  }
  const RemoveListing = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'Remove Upload', {
        event_category: 'Administrative',
      })
    }
  }
  const SubmitListing = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'Submit Upload', {
        event_category: 'Administrative',
      })
    }
  }
  const uploadFile = () => {
    const item = {
      url: `${API}/listings/upload`,
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
        'API-Key': authService.getApiKey(),
      },
      data: {
        file,
      },
    };
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
      .catch((error) => {
        let message = `Error: File "${file.name}" was not uploaded successfully.`;
        if (error?.data?.errorMessages) {
          if (error.data.errorMessages[0].startsWith('The header row in the uploaded file does not match')) {
            message += ' The CSV header row does not match any of the headers in the system.';
            // to do: get available templates
          } else {
            message += ` ${error.data.errorMessages.join(', ')}`;
          }
        }
        enqueueSnackbar(message, {
          variant: 'error',
        });
      })
      .finally(() => {
        clearFile();
      });
  };

  return (
    <Card id="upload-certified-products">
      <CardHeader title="Upload Certified Products" />
      <CardContent>
        <div className={classes.uploadContentContainer}>
          <Typography variant="body1">
            <strong> CSV files only</strong>
          </Typography>
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
                id="upload-file-selector"
                onChange={onFileChange}
                onClick={UploadListing}
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
                        onClick={uploadFile}
                        onClickCapture={SubmitListing}
                        endIcon={<DoneIcon />}
                        id="submit-upload-file"
                      >
                        Upload
                      </Button>
                      <Button
                        className={classes.deleteButton}
                        variant="contained"
                        onClick={clearFile}
                        onClickCapture={RemoveListing}
                        endIcon={<DeleteIcon />}
                        id="clear-upload-file"
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

export default ChplUploadListings;

ChplUploadListings.propTypes = {
};
