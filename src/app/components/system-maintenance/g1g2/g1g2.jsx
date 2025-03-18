import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplG1g2View from './g1g2-view';

import { useFetchG1g2 } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplG1g2() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchG1g2();
  const [g1g2, setG1g2] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="g1g2.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        G1/G2 Measures
      </Button>,
    );
    display('g1g2.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setG1g2(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="G1/G2 Measures" />
      <CardContent>
        <ChplG1g2View
          g1g2={g1g2}
        />
      </CardContent>
    </Card>
  );
}

export default ChplG1g2;

ChplG1g2.propTypes = {
};
