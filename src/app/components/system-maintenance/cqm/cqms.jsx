import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import SpeedOutlinedIcon from '@material-ui/icons/SpeedOutlined';

import ChplCqmsView from './cqms-view';

import { useFetchCqms } from 'api/standards';

function ChplCqms() {
  const { data, isLoading, isSuccess } = useFetchCqms();
  const [cqms, setCqms] = useState([]);

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
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            CQMs
            <SpeedOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
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
