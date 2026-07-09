import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { usePostConfirmApiKey } from 'api/api-keys';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridRowGap: '8px',
  },
  centeredGridItem: {
    gridColumn: '2 / 4',
  },
});

function ChplApiKeyConfirm({ hash }) {
  const { mutate } = usePostConfirmApiKey();
  const [apiKey, setApiKey] = useState({});
  const [confirmError, setConfirmError] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    mutate(hash, {
      onSuccess: (result) => {
        setApiKey(result);
      },
      onError: () => {
        setConfirmError(true);
      },
    });
  }, []);

  return (
    <div className={classes.grid}>
      <div className={classes.centeredGridItem}>
        <Card>
          <CardHeader title="API Key Confirmation" />
          <CardContent>
            { confirmError
              ? (
                <>
                  <Typography component="div" data-testid="api-key-error">
                    There was an error confirming your email!
                  </Typography>
                  <Typography variant="body1" component="div">
                    Possible reasons:
                    <ul>
                      <li>This email confirmation request has already been processed. Be sure to check your email for an email with your API key.</li>
                      <li>The confirmation token in the URL is not correct.</li>
                      <li>The confirmation succeeded, but the acknowledgement email was unable to be sent.</li>
                    </ul>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" gutterBottom>
                    Congratulations on sucessfully registering your email for use with CHPL API.  CHPL has sent you an email containing your new API key.
                  </Typography>
                  <Typography variant="body1" gutterBottom data-testid="api-key-display">
                    Your API key is: &nbsp;
                    <strong>{ apiKey.key }</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Your API key must be included in all API calls via either a header with the name &quot;API-Key&quot; or as a URL parameter named &quot;api_key&quot;.
                  </Typography>
                </>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ChplApiKeyConfirm;

ChplApiKeyConfirm.propTypes = {
  hash: string.isRequired,
};
