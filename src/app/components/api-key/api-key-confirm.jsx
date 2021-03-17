import React, { useState, useEffect } from 'react';
import {string} from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../themes/theme';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import {getAngularService} from './';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridRowGap: '8px',
  },
  centeredGridItem: {
    gridColumn: '2 / 4',
  },
}));

function ChplApiKeyConfirm (props) {
  const networkService = getAngularService('networkService');
  const [apiKey, setApiKey] = useState({});
  const [confirmError, setConfirmError] = useState(false);

  useEffect(() => {
    networkService.confirmApiKey(props.hash)
      .then((result) => {
        setApiKey(result);
      }, () => {
        setConfirmError(true);
      });
  }, []);

  const classes = useStyles();

  return (
    <ThemeProvider theme={ theme }>
      <div className={ classes.grid }>
        <div className={ classes.centeredGridItem }>
          <Card>
            <CardHeader title="API Email Confirmation"/>
            <CardContent>
              { confirmError ?
                <>
                  <Alert severity="error">There was an error confirming your email!</Alert>
                  <Typography variant="body1" paragraph="true">
                    Possible reasons:
                    <ul>
                      <li>This email confirmation request has already been processed.  Be sure to check you email for an email with your API key.</li>
                      <li>The confirmation token in the URL is not correct.</li>
                    </ul>
                  </Typography>
                </>
                :
                <>
                  <Typography variant="body1" paragraph="true">
                    Congratulations on sucessfully registering your email for use with CHPL API.  CHPL has sent you an email containing your new API key.
                  </Typography>
                  <Typography variant="body1" paragraph="true">
                    Your API key is: &nbsp; <strong>{ apiKey.apiKey }</strong>
                  </Typography>
                  <Typography variant="body1" paragraph="true">
                    Your API key must be included in all API calls via either a header with the name &lsquo;API-Key&lsquo; or as a URL parameter named &lsquo;api_key&lsquo;.
                  </Typography>
                </>
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export { ChplApiKeyConfirm };

ChplApiKeyConfirm.propTypes = {
  hash: string,
};
