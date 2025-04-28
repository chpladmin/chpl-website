import React, { useContext, useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import ChplDevelopersView from './developers-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  decertificationDate,
  quickFilters,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import { AnalyticsContext, UserContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  pageBody: {
    minHeight: 'calc(100vh - 188px)',
  },
});

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
    key: 'attestationsOptions',
    display: 'Attestations',
    operatorKey: 'attestationsOptionsOperator',
    values: [
      { value: 'has_published', display: 'Has published Attestations for the most recent past period' },
      { value: 'has_not_published', display: 'Has not published Attestations for the most recent past period' },
      { value: 'has_submitted', display: 'Has submitted Attestations for the most recent past period' },
      { value: 'has_not_submitted', display: 'Has not submitted Attestations for the most recent past period' },
    ],
  },
];

function ChplDevelopersPage() {
  const classes = useStyles();
  const [filters, setFilters] = useState(staticFilters);
  const ccQuery = useFetchCriteria();
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
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
        developerOperatorKey: 'developerOperatorKey',
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  useEffect(() => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc'])) {
      setFilters((f) => f
        .filter((filter) => filter.key !== 'hasUsers')
        .concat({
          ...defaultFilter,
          key: 'hasUsers',
          display: 'Has Users',
          getValueEntry: getRadioValueEntry,
          singular: true,
          values: [
            { value: 'true', display: 'Yes' },
            { value: 'false', display: 'No' },
          ],
        }));
    }
  }, [hasAnyRole]);

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - Developers',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <Box className={classes.pageBody}>
        <FilterProvider
          analytics={data.analytics}
          filters={filters}
          storageKey="storageKey-developersPage"
        >
          <ChplDevelopersView />
        </FilterProvider>
      </Box>
    </AnalyticsContext.Provider>
  );
}

export default ChplDevelopersPage;

ChplDevelopersPage.propTypes = {
};
