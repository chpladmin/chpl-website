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
import { certificationCriteriaIds } from 'components/filter/filters';
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
  const [filters, setFilters] = useState(staticFilters);

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
    const values = data
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.status === 'RETIRED' ? 'Retired | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.status === 'RETIRED' ? 'Retired | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        filterFn: (item, filter) => {
          console.log('criteriaids filterFn', item, filter);
          return filter.values.reduce((acc, v) => (v.selected ? acc && v.id === item.id : acc), true);
        },
        values,
      }));
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
      filters={filters}
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
