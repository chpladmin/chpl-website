import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';

import ChplOptionalStandardsView from './optional-standards-view';

import { useFetchCriteria, useFetchOptionalStandards } from 'api/standards';
import { FilterProvider } from 'components/filter';
import { certificationCriteriaIds } from 'components/filter/filters';
import ChplSystemMaintenanceLoading from 'components/system-maintenance/system-maintenance-loading';

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

  // The filter search bar's criteria options come from criteriaQuery, so the
  // skeleton waits for them as well as for the list
  const filtersLoading = criteriaQuery.isLoading;

  if (isLoading || filtersLoading) {
    return (
      <ChplSystemMaintenanceLoading
        fieldGroups={[3]}
        filter
        label="Loading optional standards"
      />
    );
  }

  return (
    <FilterProvider
      filters={filters}
      isLoading={filtersLoading}
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
