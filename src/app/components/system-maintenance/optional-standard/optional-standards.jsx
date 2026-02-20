import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import MoreOutlinedIcon from '@material-ui/icons/MoreOutlined';

import ChplOptionalStandardsView from './optional-standards-view';

import { useFetchCriteria, useFetchOptionalStandards } from 'api/standards';
import { FilterProvider } from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';

function ChplOptionalStandards() {
  const { data, isLoading, isSuccess } = useFetchOptionalStandards();
  const criteriaQuery = useFetchCriteria();
  const [filters, setFilters] = useState([]);
  const [optionalStandards, setOptionalStandards] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setOptionalStandards(data);
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
      storageKey="storageKey-optionalStandardsManagement"
    >
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              Optional Standards
              <MoreOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
)}
        />
        <CardContent>
          <ChplOptionalStandardsView
            optionalStandards={optionalStandards}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplOptionalStandards;

ChplOptionalStandards.propTypes = {
};
