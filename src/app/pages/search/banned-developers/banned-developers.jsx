import React, { useEffect, useState } from 'react';

import ChplBannedDevelopersSearchView from './banned-developers-view';

import { useFetchAcbs } from 'api/acbs';
import { FilterProvider } from 'components/filter';
import {
  certificationBodies,
  decertificationDate,
} from 'components/filter/filters';

const staticFilters = [
  decertificationDate,
];

function ChplBannedDevelopersSearchPage() {
  const [filters, setFilters] = useState(staticFilters);
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
        key: 'acbsForAllListings',
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  const analytics = {
    category: 'Banned Developers',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-bannedDevelopersPage"
    >
      <ChplBannedDevelopersSearchView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplBannedDevelopersSearchPage;

ChplBannedDevelopersSearchPage.propTypes = {
};
