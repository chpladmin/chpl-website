import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';

import ChplCertificationCriteriaView from './certification-criteria-view';

import { useFetchCriteria } from 'api/standards';
import { BreadcrumbContext } from 'shared/contexts';

function ChplCertificationCriteria() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchCriteria();
  const [certificationCriteria, setCertificationCriteria] = useState([]);

  useEffect(() => {
    append(
      <Button
        key="certificationCriteria.viewall.disabled"
        depth={1}
        variant="text"
        disabled
      >
        Certification Criteria
      </Button>,
    );
    display('certificationCriteria.viewall.disabled');
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCertificationCriteria(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardHeader title="Certification Criteria" />
      <CardContent>
        <ChplCertificationCriteriaView
          certificationCriteria={certificationCriteria}
        />
      </CardContent>
    </Card>
  );
}

export default ChplCertificationCriteria;

ChplCertificationCriteria.propTypes = {
};
