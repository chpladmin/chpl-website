import React, { useContext, useEffect, useState } from 'react';

import ChplHomeView from './home-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCqms } from 'api/data';
import { useFetchCriteria } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  cqms,
  quickFilters,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import { BrowserContext } from 'shared/contexts';

const staticFilters = [
  certificationDate,
  certificationStatuses, {
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

function ChplHomePage() {
  const { getPreviouslyCompared, getPreviouslyViewed } = useContext(BrowserContext);
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();
  const cqmQuery = useFetchCqms();

  let getValueDisplay;
  let getQuery;

  useEffect(() => {
    setFilters((f) => f
      .filter((filter) => filter.key !== 'quickFilters')
      .concat({
        ...quickFilters,
        getQuery,
        getValueDisplay,
        getLongValueDisplay: getValueDisplay,
      }));
  }, [getPreviouslyCompared, getPreviouslyViewed]);

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

  useEffect(() => {
    if (ccQuery.isLoading || !ccQuery.isSuccess) {
      return;
    }
    const values = ccQuery.data
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

  getValueDisplay = (value) => `${value.value} (${value.value.includes('Compared') ? getPreviouslyCompared().length : getPreviouslyViewed().length})`;

  getQuery = (state) => {
    const value = state.values[0]?.value;
    if (value === 'Previously Compared' && getPreviouslyCompared().length > 0) {
      return `listingIds=${getPreviouslyCompared().sort((a, b) => (a < b ? -1 : 1)).join(',')}`;
    }
    if (value === 'Previously Viewed' && getPreviouslyViewed().length > 0) {
      return `listingIds=${getPreviouslyViewed().sort((a, b) => (a < b ? -1 : 1)).join(',')}`;
    }
    return null;
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-searchPage"
    >
      <ChplHomeView />
    </FilterProvider>
  );
}

export default ChplHomePage;

ChplHomePage.propTypes = {
};
