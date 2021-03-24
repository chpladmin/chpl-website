import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import theme from '../../themes/theme';
import { getAngularService } from './';

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

function ChplUploadListings () {
  const [file, setFile] = useState(undefined);
  const API = getAngularService('API');
  const Upload = getAngularService('Upload');
  const authService = getAngularService('authService');
  const toaster = getAngularService('toaster');
  const classes = useStyles();

  const clearFile = () => {
    setFile(undefined);
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
    Upload.upload(item)
      .then(response => {
        let message = 'File "' + response.config.data.file.name + '" was uploaded successfully. ' + response.data.length + ' pending product' + (response.data.length > 1 ? 's are' : ' is') + ' processing.';
        toaster.pop({
          type: 'success',
          title: 'Success',
          body: message,
        });
      })
      .catch(error => {
        let message = 'File "' + file.name + '" was not uploaded successfully.';
        if (error?.data?.errorMessages) {
          message += ' ' + error.data.errorMessages.join(', ');
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
    <ThemeProvider theme={ theme }>
      <Card>
        <CardHeader title="Upload Certified Products (Beta)" />
        <CardContent>
          <div className={ classes.gridStyle }>
            <Typography variant="body1" className={ classes.firstRow }>
              CSV files only
            </Typography>
            <div>
              <Button color="primary"
                      variant={ file ? 'outlined' : 'contained' }
                      component="label">
                Choose file to upload
                <input type="file"
                       id="upload-listings"
                       onChange={ onFileChange }
                       style={{ display: 'none' }} />
              </Button>
            </div>
            { file &&
              <div>
                <strong>Filename:</strong> { file.name }
              </div>
            }
            { file &&
              <div>
                <strong>File size:</strong> { file.size }
              </div>
            }
            { file &&
              <div>
                <Button color="primary"
                        variant="contained"
                        onClick={ uploadFile }>
                  <i className="fa fa-cloud-upload"></i> Upload
                </Button>
                <Button className={ classes.deleteButton }
                        variant="contained"
                        onClick={ clearFile }>
                  <i className="fa fa-trash-o"></i> Remove
                </Button>
              </div>
            }
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export { ChplUploadListings };

ChplUploadListings.propTypes = {};
