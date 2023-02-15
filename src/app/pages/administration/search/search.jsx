import React, { useEffect, useState } from 'react';

import ChplSearchView from './search-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCqms, useFetchCriteria } from 'api/data';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  cqms,
  derivedCertificationEditions,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

const staticFilters = [
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions, {
    ...defaultFilter,
    key: 'hasHadComplianceActivity',
    display: 'Compliance',
    getValueEntry: getRadioValueEntry,
    singular: true,
    values: [
      { value: 'true', display: 'Has had Compliance Activity' },
      { value: 'false', display: 'Has not had Compliance Activity' },
    ],
  }, {
    ...defaultFilter,
    key: 'nonConformityOptions',
    display: 'Non-conformities',
    operatorKey: 'nonConformityOptionsOperator',
    values: [
      { value: 'open_nonconformity', display: 'Open Non-conformity' },
      { value: 'closed_nonconformity', display: 'Closed Non-conformity' },
      { value: 'never_nonconformity', display: 'Never had a Non-conformity' },
      { value: 'not_open_nonconformity', display: 'Has no open Non-conformities' },
      { value: 'not_closed_nonconformity', display: 'Has no closed Non-conformities' },
      { value: 'not_never_nonconformity', display: 'Has had a Non-conformity' },
    ],
  }];

function ChplSearchPage() {
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();
  const cqmQuery = useFetchCqms();

  useEffect(() => {
    if (acbQuery.isLoading || !acbQuery.isSuccess) {
      return;
    }
    const values = acbQuery.data.acbs
      .map((acb) => ({
        ...acb,
        value: acb.name,
        display: `${acb.retired ? 'Retired | ' : ''}${acb.name}`,
        default: !acb.retired || ((Date.now() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4)), // approx 1 month
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationBodies')
      .concat({
        ...certificationBodies,
        values,
      }));
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess]);

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    const values = ccQuery.data.criteria
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.certificationEditionId !== 3 ? 'Retired | ' : ''}${cc.removed ? 'Removed | ' : ''}${cc.number}${cc.title.includes('Cures Update') ? ' (Cures Update)' : ''}`,
        longDisplay: `${cc.certificationEditionId !== 3 ? 'Retired | ' : ''}${cc.removed ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  useEffect(() => {
    if (cqmQuery.isLoading || !cqmQuery.isSuccess) {
      return;
    }
    const values = cqmQuery.data
      .map((cqm) => ({
        ...cqm,
        value: cqm.name,
        display: cqm.name.substring(0, 3) === 'CMS' ? `${cqm.name}` : `Retired | NQF-${cqm.name}`,
        longDisplay: `${cqm.name.substring(0, 3) === 'CMS' ? `${cqm.name}` : `Retired | NQF-${cqm.name}`}: ${cqm.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'cqms')
      .concat({
        ...cqms,
        values,
      }));
  }, [cqmQuery.data, cqmQuery.isLoading, cqmQuery.isSuccess]);

  const analytics = {
    category: 'Search',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-searchPage"
    >
      <ChplSearchView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplSearchPage;

ChplSearchPage.propTypes = {
};
