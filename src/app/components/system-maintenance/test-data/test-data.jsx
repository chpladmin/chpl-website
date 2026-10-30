import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';

import ChplTestDataView from './test-data-view';

import { useFetchTestData } from 'api/standards';
import ChplSystemMaintenanceLoading from 'components/system-maintenance/system-maintenance-loading';

function ChplTestData() {
  const { data, isLoading, isSuccess } = useFetchTestData();
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTestData(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <ChplSystemMaintenanceLoading
        controls={0}
        fieldGroups={[1]}
        label="Loading test data"
      />
    );
  }

  return (
    <Card>
      <CardHeader
        style={{ paddingLeft: '16px' }}
        title={(
          <>
            Test Data
            <DataUsageOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
          </>
)}
      />
      <CardContent>
        <ChplTestDataView
          testData={testData}
        />
      </CardContent>
    </Card>
  );
}

export default ChplTestData;

ChplTestData.propTypes = {
};
