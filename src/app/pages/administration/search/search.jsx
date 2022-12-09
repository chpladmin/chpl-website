import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import ChplSearchView from './search-view';

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

const getRadioValueEntry = ({ filter, handleFilterUpdate }) => {
  let radioValue = filter.values.find((v) => v.selected)?.value || '';
  const entries = filter.values
    .map((value) => {
      const labelId = `filter-panel-secondary-items-${(`${value.value}`).replace(/ /g, '_')}`;
      return (
        <FormControlLabel
          value={value.value}
          control={<Radio />}
          label={filter.getLongValueDisplay(value)}
          id={labelId}
          key={labelId}
        />
      );
    });

  const handleChange = (event) => {
    const value = filter.values.find((v) => v.value === event.target.value);
    radioValue = event.target.value;
    handleFilterUpdate({ target: { value: true } }, filter, value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label={filter.getFilterDisplay(filter)}
        name="secondaryFilter"
        value={radioValue}
        onChange={handleChange}
      >
        { entries }
      </RadioGroup>
    </FormControl>
  );
};

const staticFilters = [
  certificationBodies,
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
  const ccQuery = useFetchCriteria();
  const cqmQuery = useFetchCqms();

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
