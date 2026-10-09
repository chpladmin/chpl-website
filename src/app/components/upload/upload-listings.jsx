import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { useSnackbar } from 'notistack';

import { useAxios } from 'api/axios';

const styles = {
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
  snackbarActions: {
    display: 'flex',
    gap: '8px',
    paddingRight: '8px',
    pointerEvents: 'auto',
  },
  snackbarIcon: {
    marginLeft: '4px',
  },
};

function ChplUploadListings() {
  const axios = useAxios();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);

  const clearFile = () => {
    setFile(undefined);
    ele.value = null;
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setEle(event.target);
  };

  const uploadFile = () => {
    const data = new FormData();
    data.append('file', file);
    axios.post('listings/upload', data)
      .then((response) => {
        if (response.status === 206) {
          const message = `Partial success: File "${file.name}" was uploaded successfully, however there ${response.data.errorMessages.length !== 1 ? 'were errors' : 'was an error'} in the file.<ul>${response.data.errorMessages.map((m) => (`<li>${m}</li>`)).join()}</ul>${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          enqueueSnackbar(message, {
            variant: 'warning',
          });
        } else {
          const message = `Success: File "${file.name}" was uploaded successfully. ${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          enqueueSnackbar(message, {
            variant: 'success',
            action: (key) => (
              <Box sx={styles.snackbarActions}>
                <Button
                  color="inherit"
                  variant="contained"
                  onClick={() => {
                    window.location.href = '#/administration/confirm/listings';
                    closeSnackbar(key);
                  }}
                >
                  Confirm Listing
                </Button>
                <Button
                  color="inherit"
                  variant="contained"
                  onClick={() => closeSnackbar(key)}
                >
                  Dismiss
                  {' '}
                  <CloseIcon sx={styles.snackbarIcon} />
                </Button>
              </Box>
            ),
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
        const errorMessages = error?.response?.data?.errorMessages;
        if (errorMessages) {
          if (errorMessages[0].startsWith('The header row in the uploaded file does not match')) {
            message += ' The CSV header row does not match any of the headers in the system.';
            // to do: get available templates
          } else {
            message += ` ${errorMessages.join(', ')}`;
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
        <Box sx={styles.uploadContentContainer}>
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
                style={{ display: 'none' }}
              />
            </Button>
          </div>
          { file
            && (
              <Box sx={styles.fileUploadContainer}>
                <Box sx={styles.fileUploadContent}>
                  <Box sx={styles.fileName}>
                    <strong>Filename:</strong>
                    {' '}
                    { file.name }
                  </Box>
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
                    <Box sx={styles.buttonUploadContainer}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={uploadFile}
                        endIcon={<DoneIcon />}
                        id="submit-upload-file"
                      >
                        Upload
                      </Button>
                      <Button
                        sx={styles.deleteButton}
                        variant="contained"
                        onClick={clearFile}
                        endIcon={<DeleteIcon />}
                        id="clear-upload-file"
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
              </Box>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplUploadListings;

ChplUploadListings.propTypes = {
};
