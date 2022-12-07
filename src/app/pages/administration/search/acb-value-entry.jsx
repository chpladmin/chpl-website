import React from 'react';

import ChplTabbedValueEntry from './tabbed-value-entry';

const getAcbValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('Retired')}
    {...props}
  />
);

export default getAcbValueEntry;
