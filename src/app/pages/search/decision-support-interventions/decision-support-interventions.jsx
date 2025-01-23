import React, { useEffect, useState } from 'react';

import ChplDecisionSupportInterventionsSearchView from './decision-support-interventions-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
} from 'components/filter/filters';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';

const staticFilters = [
  certificationDate,
  certificationStatuses, {
    ...defaultFilter,
    key: 'riskManagementSummaryInformationOptions',
    display: 'Risk Management Summary Information',
    operatorKey: 'riskManagementSummaryInformationOperator',
    values: [
      { value: 'has_risk_management_summary_information', display: 'Has Risk Management Summary Information URL', default: true },
      { value: 'no_risk_management_summary_information', display: 'Does not have Risk Management Summary Information URL' },
    ],
  }];

function ChplDecisionSupportInterventionsSearchPage() {
  const [filters, setFilters] = useState(staticFilters);
  const { analytics } = useAnalyticsContext();
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();

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
      .filter((cc) => cc.certificationEditionId === 3 || cc.certificationEditionId === null)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
        default: [56, 181, 182].includes(cc.id),
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - Decision Support Interventions',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <FilterProvider
        analytics={data.analytics}
        filters={filters}
        storageKey="storageKey-decisionSupportInterventionsPage"
      >
        <ChplDecisionSupportInterventionsSearchView />
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplDecisionSupportInterventionsSearchPage;

ChplDecisionSupportInterventionsSearchPage.propTypes = {
};
