import React from 'react';

import ChplTabbedValueEntry from './tabbed-value-entry';

const getCqmValueEntry = (props) => (
  <ChplTabbedValueEntry
    isActive={(value, filter) => filter.getValueDisplay(value).includes('CMS')}
    {...props}
  />
);

export default getCqmValueEntry;
