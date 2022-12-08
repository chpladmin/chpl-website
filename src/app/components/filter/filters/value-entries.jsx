import React from 'react';

import ChplTabbedValueEntry from './tabbed-value-entry';

const getAcbValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('Retired')}
    {...props}
  />
);

const getCqmValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => filter.getValueDisplay(value).includes('CMS')}
    {...props}
  />
);

const getCriteriaValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('|')}
    {...props}
  />
);

export {
  getAcbValueEntry,
  getCqmValueEntry,
  getCriteriaValueEntry,
};
