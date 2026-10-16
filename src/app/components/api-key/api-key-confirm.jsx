import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Typography,
} from '@mui/material';
import { string } from 'prop-types';

import { usePostConfirmApiKey } from 'api/api-keys';
import { ChplSkeletonCard } from 'components/util';
import { utilStyles } from 'themes';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridRowGap: '8px',
  },
  centeredGridItem: {
    gridColumn: '2 / 4',
  },
};

// Same layout as ChplApiKeyConfirm: the API Key Confirmation card in the middle
// two of four columns, with the lines of the confirmation and the key
const loadingStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridRowGap: '8px',
  },
  centeredGridItem: {
    gridColumn: '2 / 4',
  },
  header: {
    padding: '16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  },
};

const lineWidths = ['100%', '70%', '45%', '100%', '85%'];

function ChplApiKeyConfirmLoading() {
  return (
    <Box sx={loadingStyles.grid} role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Confirming your API key</Box>
      <Box sx={loadingStyles.centeredGridItem} aria-hidden="true">
        <ChplSkeletonCard>
          <Box sx={loadingStyles.header}>
            <Skeleton variant="text" width="45%" height={32} />
          </Box>
          <Box sx={loadingStyles.content}>
            { lineWidths.map((width, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={idx} variant="text" width={width} height={24} />
            ))}
          </Box>
        </ChplSkeletonCard>
      </Box>
    </Box>
  );
}

function ChplApiKeyConfirm({ hash }) {
  const { mutate } = usePostConfirmApiKey();
  const [apiKey, setApiKey] = useState({});
  const [confirmError, setConfirmError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(true);

  useEffect(() => {
    mutate(hash, {
      onSuccess: (result) => {
        setApiKey(result);
        setIsConfirming(false);
      },
      onError: () => {
        setConfirmError(true);
        setIsConfirming(false);
      },
    });
  }, []);

  // Without this, "Your API key is:" shows with no key until the request answers
  if (isConfirming) {
    return <ChplApiKeyConfirmLoading />;
  }

  return (
    <Box sx={styles.grid}>
      <Box sx={styles.centeredGridItem}>
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
      </Box>
    </Box>
  );
}

export default ChplApiKeyConfirm;

ChplApiKeyConfirm.propTypes = {
  hash: string.isRequired,
};
