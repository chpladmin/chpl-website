import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplConformanceMethodsView from './conformance-methods-view';

import { useFetchConformanceMethods } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplConformanceMethods() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchConformanceMethods();
  const [conformanceMethods, setConformanceMethods] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="conformanceMethods.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Conformance Methods
      </Button>,
    );
    display('conformanceMethods.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setConformanceMethods(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="Conformance Methods" />
      <CardContent>
        <ChplConformanceMethodsView
          conformanceMethods={conformanceMethods}
        />
      </CardContent>
    </Card>
  );
}

export default ChplConformanceMethods;

ChplConformanceMethods.propTypes = {
};
