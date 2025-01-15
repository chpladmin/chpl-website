import React, { useContext, useEffect, useState } from 'react';
import { func } from 'prop-types';

import ChplProductsView from './products-view';

import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import { certificationStatuses } from 'components/filter/filters';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const staticFilters = [
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
  },
];

function ChplProducts({ dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);

  const analyticsData = {
    analytics: {
      ...analytics,
    },
  };

  return (
    <FilterProvider
      analytics={analyticsData.analytics}
      filters={staticFilters}
      storageKey="storageKey-productsComponent"
    >
      <ChplProductsView
        products={developer.products}
        dispatch={dispatch}
      />
    </FilterProvider>
  );
}

export default ChplProducts;

ChplProducts.propTypes = {
  dispatch: func.isRequired,
};
