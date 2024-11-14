import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import { useFetchApiKeyActivity } from 'api/activity';
import { useFetchApiKeys, useDeleteKey } from 'api/api-keys';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplApiKeys() {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchApiKeys();
  const { mutate } = useDeleteKey();
  const [apiKeys, setApiKeys] = useState([]);
  const classes = useStyles();
  let analyticsData;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setApiKeys(data.sort((a, b) => (a.lastUsedDate < b.lastUsedDate ? -1 : 1)));
  }, [data, isLoading, isSuccess]);

  const revokeKey = (key) => {
    eventTrack({
      ...analytics,
      event: 'Revoke API Key',
      category: analyticsData.analytics.category,
    });
    mutate({ key }, {
      onSuccess: () => {
        enqueueSnackbar(`API Key ${key.key} has been revoked`, {
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

  analyticsData = {
    analytics: {
      ...analytics,
      category: 'API Keys',
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Container maxWidth="lg">
        <Typography className={classes.titlePadding} variant="h1">API Keys Management</Typography>
        <ChplSystemMaintenanceActivity
          fetch={useFetchApiKeyActivity}
          title="API Keys History"
        />
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>API Key</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell>Warning Sent</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { apiKeys
              .map((key) => (
                <TableRow key={key.key}>
                  <TableCell>{ key.name }</TableCell>
                  <TableCell>{ key.email }</TableCell>
                  <TableCell>{ key.key }</TableCell>
                  <TableCell>{ getDisplayDateFormat(key.lastUsedDate) }</TableCell>
                  <TableCell>{ getDisplayDateFormat(key.deleteWarningSentDate) }</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => revokeKey(key)}
                    >
                      Revoke key
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Container>
    </AnalyticsContext.Provider>
  );
}

export default ChplApiKeys;

ChplApiKeys.propTypes = {
};
