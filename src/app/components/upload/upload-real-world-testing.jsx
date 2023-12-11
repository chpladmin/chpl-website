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

function ChplUploadRealWorldTesting() {
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

  const uploadFile = () => {
    const item = {
      url: `${API}/real-world-testing/upload`,
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
        const message = `File "${response.config.data.file.name}" was uploaded successfully. The file will be processed and an email will be sent to ${response.data.email} when processing is complete.`;
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

  return (
    <Card id="upload-real-world-testing">
      <CardHeader title="Upload Real World Testing" />
      <CardContent>
        <div className={classes.uploadContentContainer}>
          <Typography gutterBottom variant="body1"><strong>CVS files only</strong></Typography>
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
                      id="submit-upload-file"
                    >
                      Upload
                    </Button>
                    <Button
                      className={classes.deleteButton}
                      variant="contained"
                      onClick={clearFile}
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

export default ChplUploadRealWorldTesting;

ChplUploadRealWorldTesting.propTypes = {
};
