import React from 'react';

import ChplTabbedValueEntry from './tabbed-value-entry';

const getCriteriaValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('|')}
    {...props}
  />
);

export default getCriteriaValueEntry;
