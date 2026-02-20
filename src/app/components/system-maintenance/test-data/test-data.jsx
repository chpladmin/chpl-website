import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import DataUsageOutlinedIcon from '@material-ui/icons/DataUsageOutlined';

import ChplTestDataView from './test-data-view';

import { useFetchTestData } from 'api/standards';

function ChplTestData() {
  const { data, isLoading, isSuccess } = useFetchTestData();
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTestData(data);
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
