import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplCqmsView from './cqms-view';

import { useFetchCqms } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplCqms() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchCqms({ active: false });
  const [cqms, setCqms] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="cqms.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        CQMs
      </Button>,
    );
    display('cqms.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCqms(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="CQMs" />
      <CardContent>
        <ChplCqmsView
          cqms={cqms}
        />
      </CardContent>
    </Card>
  );
}

export default ChplCqms;

ChplCqms.propTypes = {
};
