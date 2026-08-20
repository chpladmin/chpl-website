import React from 'react';
import {
  Box,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { defaultFilter } from 'components/filter';
import { getStatusIcon } from 'services/listing.service';

const getCertificationStatusValueEntry = ({ filter, handleFilterToggle }) => filter.values.map((value) => {
  const labelId = `filter-panel-secondary-items-${(`${value.value}`).replace(/ /g, '_')}`;
  return (
    <ListItem
      key={value.value}
      button
      onClick={() => handleFilterToggle(value)}
      disabled={filter.required && value.selected && filter.values.filter((a) => a.selected).length === 1}
    >
      <ListItemIcon>
        <Checkbox
          color="primary"
          edge="start"
          checked={value?.selected || false}
          tabIndex={-1}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
      <ListItemText style={{ display: 'flex', flex: 'none', flexDirection: 'row' }} id={labelId}>
        {filter.getLongValueDisplay(value)}
      </ListItemText>
       {getStatusIcon({ name: filter.getLongValueDisplay(value) })}
      </Box>
    </ListItem>
  );
});

const values = [
  { value: 'Active', default: true },
  { value: 'Suspended by ONC', default: true },
  { value: 'Suspended by ONC-ACB', default: true },
  { value: 'Terminated by ONC' },
  { value: 'Withdrawn by Developer Under Surveillance/Review' },
  { value: 'Withdrawn by ONC-ACB' },
  { value: 'Withdrawn by Developer' },
  { value: 'Retired' },
];

const filter = {
  ...defaultFilter,
  key: 'certificationStatuses',
  display: 'Certification Status',
  getValueEntry: getCertificationStatusValueEntry,
  sortValues: (f, a, b) => {
    const aIndex = values.findIndex((v) => v.value === a.value);
    const bIndex = values.findIndex((v) => v.value === b.value);
    return aIndex - bIndex;
  },
  values,
};

export default filter;
