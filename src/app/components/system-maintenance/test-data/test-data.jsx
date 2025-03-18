import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplTestDataView from './test-data-view';

import { useFetchTestData } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplTestData() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchTestData();
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="testData.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Test Data
      </Button>,
    );
    display('testData.viewall.disabled');
  }, []);

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
      <CardHeader title="Test Data" />
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
