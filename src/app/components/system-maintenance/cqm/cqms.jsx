import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';

import ChplCqmsView from './cqms-view';

import { useFetchCqms } from 'api/standards';
import ChplSystemMaintenanceLoading from 'components/system-maintenance/system-maintenance-loading';

function ChplCqms() {
  const { data, isLoading, isSuccess } = useFetchCqms();
  const [cqms, setCqms] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCqms(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <ChplSystemMaintenanceLoading
        fieldGroups={[2, [{ flex: '1 1 100%', lines: 2 }]]}
        label="Loading CQMs"
      />
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
