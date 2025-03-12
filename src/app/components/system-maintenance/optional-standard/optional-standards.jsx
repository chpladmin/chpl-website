import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplOptionalStandardsView from './optional-standards-view';

import { useFetchOptionalStandards } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplOptionalStandards() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchOptionalStandards();
  const [optionalStandards, setOptionalStandards] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="optionalStandards.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Optional Standards
      </Button>,
    );
    display('optionalStandards.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setOptionalStandards(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="Optional Standards" />
      <CardContent>
        <ChplOptionalStandardsView
          optionalStandards={optionalStandards}
        />
      </CardContent>
    </Card>
  );
}

export default ChplOptionalStandards;

ChplOptionalStandards.propTypes = {
};
