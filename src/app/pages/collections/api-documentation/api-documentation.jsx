import React, { useContext, useEffect, useState } from 'react';

import ChplApiDocumentationCollectionView from './api-documentation-view';

import { useFetchCriteria } from 'api/data';
import {
  FilterProvider, defaultFilter, getDateDisplay, getDateEntry,
} from 'components/filter';
import { FlagContext } from 'shared/contexts';

const staticFilters = [{
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
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'certificationDateStart' : 'certificationDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}];

function ChplApiDocumentationCollectionPage() {
  const { isOn } = useContext(FlagContext);
  const [erdPhase2IsOn, setErdPhase2IsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const ccQuery = useFetchCriteria();

  useEffect(() => {
    setErdPhase2IsOn(isOn('erd-phase-2'));
  }, [isOn]);

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    // .sort((a, b) => (a.name < b.name ? -1 : 1)) pull in sort from OCD-4038
    const values = ccQuery.data.criteria
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        value: cc.id,
        display: `${cc.removed ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        default: erdPhase2IsOn ? [56, 181, 182].includes(cc.id) : [56, 57, 58, 181, 182].includes(cc.id),
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...defaultFilter,
        key: 'certificationCriteriaIds',
        display: 'Certification Criteria',
        operatorKey: 'certificationCriteriaOperator',
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess, erdPhase2IsOn]);

  const analytics = {
    category: 'API Information for 2015 Edition Products',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
    >
      <ChplApiDocumentationCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplApiDocumentationCollectionPage;

ChplApiDocumentationCollectionPage.propTypes = {
};
