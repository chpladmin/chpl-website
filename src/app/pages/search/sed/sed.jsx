import React, { useContext, useEffect, useState } from 'react';

import ChplSedSearchView from './sed-view';

import { useFetchAcbs } from 'api/acbs';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  certificationDate,
  certificationStatuses,
} from 'components/filter/filters';
import { UserContext } from 'shared/contexts';

const staticFilters = [
  certificationDate,
  certificationStatuses,
];

function ChplSedSearchPage() {
  const [filters, setFilters] = useState(staticFilters);
  const { user } = useContext(UserContext);
  const acbQuery = useFetchAcbs();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) {
      return;
    }
    const values = acbQuery.data.acbs
      .map((acb) => ({
        ...acb,
        value: acb.name,
        display: `${acb.retired ? 'Retired | ' : ''}${acb.name}`,
        default: !acb.retired || ((Date.now() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4)), // approx 4 months
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationBodies')
      .concat({
        ...certificationBodies,
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  const analytics = {
    category: 'CHPL Search - SED Information',
    group: user?.role,
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-sedPage"
    >
      <ChplSedSearchView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplSedSearchPage;

ChplSedSearchPage.propTypes = {
};
