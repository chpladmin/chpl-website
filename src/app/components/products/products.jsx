import React, { useContext, useEffect, useState } from 'react';
import { arrayOf, string } from 'prop-types';

import ChplProductsView from './products-view';

import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import {
  certificationStatuses,
} from 'components/filter/filters';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const staticFilters = [
  certificationStatuses,
];

function ChplProducts() {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(developer.products.map((p) => ({
      ...p,
      expanded: false,
    })))
  }, [developer]);

  const analyticsData = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <FilterProvider
        analytics={analyticsData.analytics}
        filters={staticFilters}
        storageKey="storageKey-productsComponent"
      >
        <ChplProductsView
          products={products}
        />
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplProducts;

ChplProducts.propTypes = {
};
