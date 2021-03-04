import React, { useState } from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import theme from '../../themes/theme';
import { getAngularService } from './';

function ChplUploadListings () {
  const [file, setFile] = useState(undefined);
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(true);
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');

  const clearFile = () => {
    setFile(undefined);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const onFileChange = event => {
    setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    let item = {
      url: API + '/listings/upload',
      headers: {
        Authorization: 'Bearer ' + authService.getToken(),
        'API-Key': authService.getApiKey(),
      },
      data: {
        file: file,
      },
    };
    Upload.upload(item).then(response => {
      setFile(undefined);
      setUploadSuccess(true);
      setToastOpen(true);
      let message = 'File "' + response.config.data.file.name + '" was uploaded successfully. ' + response.data.length + ' pending product' + (response.data.length > 1 ? 's are' : ' is') + ' ready for confirmation.';
      setToastMessage(message);
    }, error => {
      setFile(undefined);
      setUploadSuccess(false);
      setToastOpen(true);
      let message = 'File "' + file.name + '" was not uploaded successfully.';
      if (error?.data?.errorMessages) {
        message += ' ' + error.data.errorMessages.join(', ');
      }
      setToastMessage(message);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Upload Certified Products (Beta)</h3>
        </div>
        <div className="panel-body">
          CSV files only
          <div className="row">
            <div className={ file ? 'col-sm-3' : 'col-sm-12' }>
              <Button color="primary"
                      variant={ file ? 'outlined' : 'contained' }
                      component="label">
                Choose file to upload
                <input type="file"
                       onChange={ onFileChange }
                       style={{ display: 'none' }}/>
              </Button>
            </div>
            { file &&
              <>
                <div className="col-sm-3">
                  <strong>Filename:</strong> { file.name }
                </div>
                <div className="col-sm-3">
                  <strong>File size:</strong> { file.size }
                </div>
                <div className="col-sm-3">
                  <Button color="primary"
                          variant="contained"
                          onClick={ uploadFile }>
                    <i className="fa fa-cloud-upload"></i> Upload
                  </Button>
                  <Button color="warning"
                          variant="contained"
                          onClick={ clearFile }>
                    <i className="fa fa-trash-o"></i> Remove
                  </Button>
                </div>
              </>
            }
          </div>
        </div>
        <Snackbar open={ toastOpen }
                  onClose={ handleToastClose }
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MuiAlert onClose={ handleToastClose } severity={ uploadSuccess ? 'success' : 'error' }>
            { toastMessage }
          </MuiAlert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export { ChplUploadListings };

ChplUploadListings.propTypes = {};

//ngf-select ngf-accept="'.csv'"
//ng-model="$ctrl.file"
// filter as number

//ng-click="$ctrl.upload()" ng-disabled="!$ctrl.file">

//ng-click="$ctrl.file = undefined">
