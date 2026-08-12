import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ChplListingsView from './listings-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCqms, useFetchCriteria, useFetchStandards } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  cqms,
  quickFilters,
  standards,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { useLocalStorage } from 'services/storage.service';

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

function ChplListingsPage() {
  const previouslyCompared = useSelector((state) => state.browserInfo.previouslyCompared);
  const previouslyViewed = useSelector((state) => state.browserInfo.previouslyViewed);
  const { analytics } = useAnalyticsContext();
  const [filters, setFilters] = useState(staticFilters);
  const [favorites] = useLocalStorage('favorites', []);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();
  const cqmQuery = useFetchCqms();
  const standardsQuery = useFetchStandards();

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
  }, [previouslyCompared, previouslyViewed, favorites]);

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
        value: cqm.cmsId ? cqm.cmsId : cqm.nqfNumber,
        display: cqm.cmsId ? cqm.cmsId : `Retired | NQF-${cqm.nqfNumber}`,
        longDisplay: `${cqm.cmsId ? cqm.cmsId : `Retired | NQF-${cqm.nqfNumber}`}: ${cqm.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'cqms')
      .concat({
        ...cqms,
        values,
      }));
  }, [cqmQuery.data, cqmQuery.isLoading, cqmQuery.isSuccess]);

  useEffect(() => {
    if (standardsQuery.isLoading || !standardsQuery.isSuccess) {
      return;
    }
    const values = standardsQuery.data
      .map((standard) => ({
        ...standard,
        value: standard.id,
        display: standard.regulatoryTextCitation + (standard.retired ? ' (Expired)' : ''),
        longDisplay: `${standard.regulatoryTextCitation}: ${standard.value}${standard.retired ? ' (Expired)' : ''}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'standards')
      .concat({
        ...standards,
        values,
      }));
  }, [standardsQuery.data, standardsQuery.isLoading, standardsQuery.isSuccess]);

  getValueDisplay = (value) => {
    switch (value.value) {
      case 'Previously Compared':
        return `${value.value} (${previouslyCompared.length})`;
      case 'Previously Viewed':
        return `${value.value} (${previouslyViewed.length})`;
      case 'Favorites':
        return `${value.value} (${favorites.length})`;
      default:
        return value.value;
    }
  };

  getQuery = (state) => {
    const value = state.values[0]?.value;
    if (value === 'Previously Compared' && previouslyCompared.length > 0) {
      return `listingIds=${previouslyCompared.sort((a, b) => (a < b ? -1 : 1)).join(',')}`;
    }
    if (value === 'Previously Viewed' && previouslyViewed.length > 0) {
      return `listingIds=${previouslyViewed.sort((a, b) => (a < b ? -1 : 1)).join(',')}`;
    }
    if (value === 'Favorites' && favorites.length > 0) {
      return `listingIds=${favorites.map((fav) => fav.id).sort((a, b) => (a < b ? -1 : 1)).join(',')}`;
    }
    return null;
  };

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - Search',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <FilterProvider
        analytics={data.analytics}
        filters={filters}
        storageKey="storageKey-listingsPage"
      >
        <ChplListingsView />
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplListingsPage;

ChplListingsPage.propTypes = {
};
