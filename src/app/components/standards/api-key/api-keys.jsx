import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplApiKeysView from './api-keys-view';

import { useFetchApiKeys, useDeleteKey } from 'api/api-keys';
import { eventTrack } from 'services/analytics.service';
import { BreadcrumbContext, useAnalyticsContext } from 'shared/contexts';

function ChplApiKeys() {
  const { analytics } = useAnalyticsContext();
  const { append, display } = useContext(BreadcrumbContext);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchApiKeys();
  const { mutate } = useDeleteKey();
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="apiKeys.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        API Keys
      </Button>,
    );
    display('apiKeys.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setApiKeys(data.sort((a, b) => (a.lastUsedDate < b.lastUsedDate ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  const handleDispatch = ({ action, payload }) => {
    if (action !== 'revoke') { return; }
    eventTrack({
      ...analytics,
      event: 'Revoke API Key',
    });
    mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar(`API Key ${payload.key} has been revoked`, {
          variant: 'success',
        });
      },
      onError: (error) => {
        const message = error.response.data.error;
        enqueueSnackbar(message, {
          variant: 'error',
        });
      },
    });
  };

  if (isLoading || !isSuccess || apiKeys.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardHeader title="API Keys" />
      <CardContent>
        <ChplApiKeysView
          apiKeys={apiKeys}
          dispatch={handleDispatch}
        />
      </CardContent>
    </Card>
  );
}

export default ChplApiKeys;

ChplApiKeys.propTypes = {
};
