import React, { useEffect, useState } from 'react';

import ChplDevelopersView from './developers-view';

import { useFetchAcbs } from 'api/acbs';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  decertificationDate,
  quickFilters,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

const staticFilters = [
  decertificationDate, {
    ...quickFilters,
    values: [],
  }, {
    ...defaultFilter,
    key: 'statuses',
    display: 'Developer Status',
    values: [
      { value: 'Suspended by ONC' },
      { value: 'Under certification ban by ONC' },
    ],
  }, {
    ...defaultFilter,
    key: 'activeListingsOptions',
    display: 'Active Listings',
    operatorKey: 'activeListingsOptionsOperator',
    values: [
      { value: 'has_any_active', display: 'Has Any Active', default: true },
      { value: 'has_no_active', display: 'Has No Active' },
      { value: 'had_any_active_during_most_recent_past_attestation_period', display: 'Had Any Active During Most Recent Past Attestation Period' },
    ],
  }, {
    ...defaultFilter,
    key: 'hasPublishedAttestationsForMostRecentPastPeriod',
    display: 'Attestations Published',
    getValueEntry: getRadioValueEntry,
    singular: true,
    values: [
      { value: 'true', display: 'Has published Attestations for the most recent past period' },
      { value: 'false', display: 'Has not published Attestations for the most recent past period' },
    ],
  }, {
    ...defaultFilter,
    key: 'hasSubmittedAttestationsForMostRecentPastPeriod',
    display: 'Attestations Submitted',
    getValueEntry: getRadioValueEntry,
    singular: true,
    values: [
      { value: 'true', display: 'Has submitted Attestations for the most recent past period' },
      { value: 'false', display: 'Has not submitted Attestations for the most recent past period' },
    ],
  },
];

function ChplDevelopersPage() {
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
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'acbsForActiveListings')
      .concat({
        ...certificationBodies,
        key: 'acbsForActiveListings',
        display: 'Has active Listings with ONC-ACB',
        values,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'acbsForAllListings')
      .concat({
        ...certificationBodies,
        key: 'acbsForAllListings',
        display: 'Has any Listings with ONC-ACB',
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  const analytics = {
    category: 'Developers',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-developersPage"
    >
      <ChplDevelopersView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplDevelopersPage;

ChplDevelopersPage.propTypes = {
};
