import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';

import ChplG1g2View from './g1g2-view';

import { useFetchCriteria, useFetchG1g2 } from 'api/standards';
import {
  FilterProvider,
  defaultFilter,
} from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

const staticFilters = [{
  ...defaultFilter,
  key: 'removed',
  display: 'Removed',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'active', display: 'Active', default: true },
    { value: 'removed', display: 'Removed' },
  ],
  filterFn: (item, filter) => filter.values.reduce((acc, v) => (v.selected ? (acc && (v.value === 'active' ? !item.removed : item.removed)) : acc), true),
}];

function ChplG1g2() {
  const { data, isLoading, isSuccess } = useFetchG1g2();
  const criteriaQuery = useFetchCriteria();
  const [filters, setFilters] = useState(staticFilters);
  const [g1g2, setG1g2] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setG1g2(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (criteriaQuery.isLoading || !criteriaQuery.isSuccess) { return; }
    const values = criteriaQuery.data
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
          if (!filter.values.some((v) => v.selected)) { return true; }
          if (filter.operator === 'or') {
            return filter.values.some((v) => (v.selected && item.allowedCriteria.some((cc) => cc.id === v.id)));
          }
          return filter.values.reduce((acc, v) => (v.selected ? acc && item.allowedCriteria.some((cc) => cc.id === v.id) : acc), true);
        },
        values,
      }));
  }, [criteriaQuery.data, criteriaQuery.isLoading, criteriaQuery.isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <FilterProvider
      filters={filters}
      storageKey="storageKey-g1g2Management"
    >
      <Card style={{ overflow: 'visible' }}>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              G1/G2 Measures
              <AssessmentOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
)}
        />
        <CardContent style={{ overflow: 'visible' }}>
          <ChplG1g2View
            g1g2={g1g2}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplG1g2;

ChplG1g2.propTypes = {
};
