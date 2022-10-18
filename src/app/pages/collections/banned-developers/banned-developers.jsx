import React from 'react';

import ChplBannedDevelopersCollectionView from './banned-developers-view';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { UserWrapper } from 'components/login';

function ChplBannedDevelopersCollectionPage() {
  const analytics = {
    category: 'Banned Developers',
  };
  const filters = [{
    ...defaultFilter,
    key: 'decertificationDate',
    display: 'Decertification Date',
    values: [
      { value: 'Before', default: '' },
      { value: 'After', default: '' },
    ],
    getQuery: (value) => value.values
      .sort((a, b) => (a.value < b.value ? -1 : 1))
      .map((v) => `${v.value === 'After' ? 'decertificationDateStart' : 'decertificationDateEnd'}=${v.selected}`)
      .join('&'),
    getValueDisplay: getDateDisplay,
    getValueEntry: getDateEntry,
  }, {
    ...defaultFilter,
    key: 'certificationBodies',
    display: 'ONC-ACB',
    values: [
      { value: 'CCHIT', display: 'CCHIT (Retired)' },
      { value: 'Drummond Group', default: true },
      { value: 'ICSA Labs', default: true },
      { value: 'Leidos', default: true },
      { value: 'SLI Compliance', default: true },
      { value: 'Surescripts LLC', display: 'Surescripts LLC (Retired)' },
      { value: 'UL LLC', display: 'UL LLC (Retired)' },
    ],
  }];

  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <FilterProvider
            analytics={analytics}
            filters={filters}
            storageKey="storageKey-bannedDevelopersPage"
          >
            <ChplBannedDevelopersCollectionView
              analytics={analytics}
            />
          </FilterProvider>
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplBannedDevelopersCollectionPage;

ChplBannedDevelopersCollectionPage.propTypes = {
};
