import React from 'react';
import Moment from 'react-moment';

import ChplApiDocumentationCollectionView from './api-documentation-view';

import ApiWrapper from 'api/api-wrapper';
import { FilterProvider, defaultFilter, getDateEntry } from 'components/filter';
import { UserWrapper } from 'components/login';

function ChplApiDocumentationCollectionPage() {
  const analytics = {
    category: 'API Information for 2015 Edition Products',
  };
  const filters = [{
    ...defaultFilter,
    key: 'derivedCertificationEditions',
    display: 'Certification Edition',
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
    ...defaultFilter,
    key: 'certificationStatuses',
    display: 'Certification Status',
    values: [
      { value: 'Active', default: true },
      { value: 'Suspended by ONC', default: true },
      { value: 'Suspended by ONC-ACB', default: true },
      { value: 'Terminated by ONC' },
      { value: 'Withdrawn by Developer Under Surveillance/Review' },
      { value: 'Withdrawn by ONC-ACB' },
      { value: 'Withdrawn by Developer' },
      { value: 'Retired' },
    ],
  }, {
    ...defaultFilter,
    key: 'certificationDate',
    display: 'Certification Date',
    values: [
      { value: 'Before', data: { date: Date.now() }, default: true },
      { value: 'After', data: { date: (new Date('2020-06-01')).getTime() }, default: true },
    ],
    getQuery: (value) => value.values
      .sort((a, b) => (a.value < b.value ? -1 : 1))
      .map((v) => `${v.value === 'After' ? 'certificationDateStart' : 'certificationDateEnd'}=${new Date(v.data.date).toISOString().slice(0, 10)}`)
      .join('&'),
    getValueDisplay: (value) => (
      <>
        {value.value}
        { value.data.date && (
          <>
            {': '}
            <Moment fromNow>{value.data.date}</Moment>
          </>
        )}
      </>
    ),
    getValueEntry: getDateEntry,
  }];

  return (
    <UserWrapper>
      <ApiWrapper>
        <FilterProvider
          analytics={analytics}
          filters={filters}
        >
          <ChplApiDocumentationCollectionView
            analytics={analytics}
          />
        </FilterProvider>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplApiDocumentationCollectionPage;

ChplApiDocumentationCollectionPage.propTypes = {
};
