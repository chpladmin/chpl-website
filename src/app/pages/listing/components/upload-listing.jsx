import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  makeStyles,
} from '@material-ui/core';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import { useSnackbar } from 'notistack';

import { getAngularService } from 'services/angular-react-helper';
import { ListingContext } from 'shared/contexts';

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

function ChplUploadListing() {
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
  const { setListing } = useContext(ListingContext);
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
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        clearFile();
      });
  };

  return (
    <>
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
    </>
  );
}

export default ChplUploadListing;

ChplUploadListing.propTypes = {
};
