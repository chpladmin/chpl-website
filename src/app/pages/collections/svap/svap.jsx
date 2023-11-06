import React, { useContext, useEffect, useState } from 'react';

import ChplSvapCollectionView from './svap-view';

import { useFetchAcbs } from 'api/acbs';
import { useFetchCriteria } from 'api/data';
import { useFetchSvaps } from 'api/standards';
import { FilterProvider, defaultFilter } from 'components/filter';
import {
  certificationBodies,
  certificationCriteriaIds,
  certificationDate,
  certificationStatuses,
  derivedCertificationEditions,
} from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import ChplTabbedValueEntry from 'components/filter/filters/tabbed-value-entry';
import { FlagContext } from 'shared/contexts';

const staticFilters = [
  certificationDate,
  certificationStatuses, {
    ...derivedCertificationEditions,
    required: true,
    values: [
      { value: '2015', default: true },
    ],
  }, {
    ...defaultFilter,
    key: 'hasAnySvap',
    display: 'Has any SVAP',
    getValueEntry: getRadioValueEntry,
    singular: true,
    values: [
      { value: 'true', display: 'Has SVAP Information', default: true },
      { value: 'false', display: 'Does not have SVAP Information' },
    ],
  }, {
    ...defaultFilter,
    key: 'hasSvapNoticeUrl',
    display: 'SVAP Notice',
    getValueEntry: getRadioValueEntry,
    singular: true,
    values: [
      { value: 'true', display: 'Has SVAP Notice URL' },
      { value: 'false', display: 'Does not have SVAP Notice URL' },
    ],
  }];

const getSvapValueEntry = (props) => (
  <ChplTabbedValueEntry
    retiredLabel="Replaced"
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('|')}
    {...props}
  />
);

function ChplSvapCollectionPage() {
  const { isOn } = useContext(FlagContext);
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const acbQuery = useFetchAcbs();
  const ccQuery = useFetchCriteria();
  const svapQuery = useFetchSvaps();

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
  }, [isOn]);

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
    const values = ccQuery.data.criteria
      .filter((cc) => cc.certificationEditionId === 3)
      .map((cc) => ({
        ...cc,
        value: cc.id,
        display: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}`,
        longDisplay: `${cc.status === 'REMOVED' ? 'Removed | ' : ''}${cc.number}: ${cc.title}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'certificationCriteriaIds')
      .concat({
        ...certificationCriteriaIds,
        values,
      }));
  }, [ccQuery.data, ccQuery.isLoading, ccQuery.isSuccess]);

  useEffect(() => {
    if (svapQuery.isLoading || !svapQuery.isSuccess) {
      return;
    }
    const values = svapQuery.data
      .map((svap) => ({
        ...svap,
        value: svap.svapId,
        display: `${svap.replaced ? 'Replaced | ' : ''}${svap.regulatoryTextCitation}`,
        longDisplay: `${svap.replaced ? 'Replaced | ' : ''}${svap.regulatoryTextCitation}: ${svap.approvedStandardVersion}`,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'svapIds')
      .concat({
        ...defaultFilter,
        key: 'svapIds',
        display: 'SVAP',
        operatorKey: 'svapOperator',
        sortValues: (_, a, b) => (a.regulatoryTextCitation < b.regulatoryTextCitation ? -1 : 1),
        getValueEntry: getSvapValueEntry,
        values,
      }));
  }, [svapQuery.data, svapQuery.isLoading, svapQuery.isSuccess]);

  useEffect(() => {
    setFilters((f) => f
      .filter((filter) => filter.key !== 'derivedCertificationEditions' || !editionlessIsOn));
  }, [editionlessIsOn]);

  const analytics = {
    category: 'SVAP Information',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-svapPage"
    >
      <ChplSvapCollectionView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplSvapCollectionPage;

ChplSvapCollectionPage.propTypes = {
};
