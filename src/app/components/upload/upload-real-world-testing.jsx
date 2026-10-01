import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Typography,
} from '@mui/material';
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
};

function ChplUploadRealWorldTesting() {
  const axios = useAxios();
  const { enqueueSnackbar } = useSnackbar();
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
    axios.post('real-world-testing/upload', data)
      .then((response) => {
        const message = `File "${file.name}" was uploaded successfully. The file will be processed and an email will be sent to ${response.data.email} when processing is complete.`;
        enqueueSnackbar(message, {
          variant: 'success',
        });
      })
      .catch(() => {
        const message = `File "${file.name}" was not uploaded successfully.`;
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
        <Box sx={styles.uploadContentContainer}>
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
        </Box>
        { file
          && (
            <Box sx={styles.fileUploadContainer}>
              <Box sx={styles.fileUploadContent}>
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
      </CardContent>
    </Card>
  );
}

export default ChplUploadRealWorldTesting;

ChplUploadRealWorldTesting.propTypes = {
};
