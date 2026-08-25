import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { arrayOf, bool, string } from 'prop-types';
import { useSelector } from 'react-redux';

import ChplComplaintsView from './complaints-view';

import { useFetchAcbs } from 'api/acbs';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import {
  certificationBodies,
} from 'components/filter/filters';
import { AnalyticsContext, useAnalyticsContext, UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 283px)',
  },
});

const staticFilters = [{
  ...defaultFilter,
  key: 'closedDate',
  display: 'Closed Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'closedDateStart' : 'closedDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'complainantContacted',
  display: 'Complainant Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'complaintTypes',
  display: 'Complaint Type(s)',
  values: [
    { value: 'Criteria' },
    { value: 'Condition' },
    { value: 'Other' },
    { value: 'Not Related to Certification Program Requirements' },
  ],
}, {
  ...defaultFilter,
  key: 'complainantTypes',
  display: 'Complainant Type',
  values: [
    { value: 'Anonymous' },
    { value: 'Developer' },
    { value: 'Government Entity' },
    { value: 'Other' },
    { value: 'Patient' },
    { value: 'Provider' },
    { value: 'Third Party Organization' },
  ],
}, {
  ...defaultFilter,
  key: 'currentStatuses',
  display: 'Status',
  values: [
    { value: 'Closed' },
    { value: 'Open' },
  ],
}, {
  ...defaultFilter,
  key: 'developerContacted',
  display: 'Developer Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'informedOnc',
  display: 'Informed ONC',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'receivedDate',
  display: 'Received Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'receivedDateStart' : 'receivedDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'oncAtlContacted',
  display: 'ONC-ATL Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}];

function ChplComplaints({
  bonusQuery: initialBonusQuery,
  canAdd,
  disallowedFilters: initialDisallowedFilters,
  canEdit = true,
}) {
  const user = useSelector((state) => state.userInfo.user);
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [bonusQuery, setBonusQuery] = useState('');
  const [disallowedFilters, setDisallowedFilters] = useState([]);
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const classes = useStyles();

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
    setBonusQuery(initialBonusQuery);
  }, [initialBonusQuery]);

  useEffect(() => {
    setDisallowedFilters(initialDisallowedFilters);
  }, [initialDisallowedFilters]);

  useEffect(() => {
    if (!hasAnyRole(['chpl-onc-acb'])) { return; }
    setBonusQuery((bq) => [...(new Set(bq
      .split('&')
      .concat(`certificationBodies=${user.organizations[0].name}`)
      .filter((a) => (a))))]
      .sort((a, b) => (a < b ? -1 : 1))
      .join('&'));
    setDisallowedFilters((df) => [...(new Set(df.concat('certificationBodies')))]);
  }, [hasAnyRole, user]);

  useEffect(() => {
    setFilters((f) => f.filter((filter) => !disallowedFilters.includes(filter.key)));
  }, [disallowedFilters]);

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - Complaints',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <FilterProvider
        analytics={data.analytics}
        filters={filters}
        storageKey="storageKey-complaintsComponent"
      >
        <div className={classes.fixFooterSpacing}>
          <ChplComplaintsView
            bonusQuery={bonusQuery}
            canAdd={canAdd}
            canEdit={canEdit}
          />
        </div>
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplComplaints;

ChplComplaints.propTypes = {
  bonusQuery: string.isRequired,
  canAdd: bool.isRequired,
  disallowedFilters: arrayOf(string).isRequired,
  canEdit: bool,
};
