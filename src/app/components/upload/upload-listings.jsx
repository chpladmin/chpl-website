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

import theme from '../../themes/theme';
import { getAngularService } from '../../services/angular-react-helper';

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
  firstRow: {
    gridColumn: '1 / -1',
  },
}));

function ChplUploadListings() {
  const [file, setFile] = useState(undefined);
  const [ele, setEle] = useState(undefined);
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const toaster = getAngularService('toaster');
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
        if (response.status === 206) {
          const message = `File "${response.config.data.file.name}" was uploaded successfully, however there ${response.data.errorMessages.length !== 1 ? 'were errors' : 'was an error'} in the file.<ul>${response.data.errorMessages.map((m) => (`<li>${m}</li>`)).join()}</ul>${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          toaster.pop({
            type: 'warning',
            title: 'Partial success',
            body: message,
            bodyOutputType: 'trustedHtml',
          });
        } else {
          const message = `File "${response.config.data.file.name}" was uploaded successfully. ${response.data.successfulListingUploads.length} pending product${response.data.successfulListingUploads.length > 1 ? 's are' : ' is'} processing.`;
          toaster.pop({
            type: 'success',
            title: 'Success',
            body: message,
          });
        }
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
        clearFile();
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Upload Certified Products (Beta)" />
        <CardContent>
          <div className={classes.gridStyle}>
            <Typography variant="body1" className={classes.firstRow}>
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
                  id="upload-listings"
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
                  onClick={uploadFile}
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
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

ChplUploadListings.propTypes = {};

export default ChplUploadListings;
