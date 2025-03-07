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
  getDateTimeEntry,
} from 'components/filter';
import { BreadcrumbContext } from 'shared/contexts';

const staticFilters = [{
  ...defaultFilter,
  key: 'startDay',
  display: 'Start Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  filterFn: (item, filter) => {
    return filter.values.reduce((v, acc) => {
      if (v.value === 'Before') {
        return acc && item.startDay <= v.selected;
      } else if (v.value === 'After') {
        return acc && item.startDay >= v.selected;
      }
      return acc && true;
    }, true);
  },
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}, {
  ...defaultFilter,
  key: 'endDate',
  display: 'End Day',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'creationDateTimeStart' : 'creationDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
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

  return (
    <FilterProvider
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
