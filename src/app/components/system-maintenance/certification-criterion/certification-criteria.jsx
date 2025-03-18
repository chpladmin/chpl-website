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
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { BreadcrumbContext } from 'shared/contexts';

const staticFilters = [{
  ...defaultFilter,
  key: 'startDay',
  display: 'Start Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '2015-10-16' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => ((!!v.selected && !!item.startDay) ? acc && (v.value === 'Before' ? item.startDay <= v.selected : item.startDay >= v.selected) : acc), true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'endDay',
  display: 'End Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => ((!!v.selected && !!item.endDay) ? acc && (v.value === 'Before' ? item.endDay <= v.selected : item.endDay >= v.selected) : acc), true),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}];

function ChplCertificationCriteria() {
  const { append, display } = useContext(BreadcrumbContext);
  const { data, isLoading, isSuccess } = useFetchCriteria({ active: false });
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

  const analytics = {
    category: 'Certification Criteria Management',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={staticFilters}
      storageKey="storageKey-certificationCriteriaManagement"
    >
      <Card>
        <CardHeader title="Certification Criteria" />
        <CardContent>
          <ChplCertificationCriteriaView
            certificationCriteria={certificationCriteria}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplCertificationCriteria;

ChplCertificationCriteria.propTypes = {
};
