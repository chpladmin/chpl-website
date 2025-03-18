import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplCodeSetsView from './code-sets-view';

import { useFetchCodeSets } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplCodeSets() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchCodeSets();
  const [codeSets, setCodeSets] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="codeSets.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Code Sets
      </Button>,
    );
    display('codeSets.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCodeSets(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="Code Sets" />
      <CardContent>
        <ChplCodeSetsView
          codeSets={codeSets}
        />
      </CardContent>
    </Card>
  );
}

export default ChplCodeSets;

ChplCodeSets.propTypes = {
};
