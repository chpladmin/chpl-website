import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import ChplTabbedValueEntry from './tabbed-value-entry';

import { ChplTextField } from 'components/util';

const classes = {
  singularSelectors: {
    textTransform: 'none',
  },
};

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
    retiredLabel="Removed/Retired"
    isActive={(value, filter) => !filter.getValueDisplay(value).includes('|')}
    {...props}
  />
);

const generateDateEntry = ({ filter, handleFilterUpdate, type }) => filter.values
  .sort((a, b) => (a.value > b.value ? -1 : 1))
  .map((value) => {
    const labelId = `filter-panel-secondary-items-${value.value.replace(/ /g, '_')}`;
    return (
      <React.Fragment key={value.value}>
        <div>
          {filter.getValueDisplay(value)}
        </div>
        <ChplTextField
          id={labelId}
          type={type}
          value={value.selected}
          onChange={(event) => handleFilterUpdate(event, filter, value)}
        />
      </React.Fragment>
    );
  });

const getDateTimeEntry = ({ filter, handleFilterUpdate }) => generateDateEntry({ filter, handleFilterUpdate, type: 'datetime-local' });

const getDateEntry = ({ filter, handleFilterUpdate }) => generateDateEntry({ filter, handleFilterUpdate, type: 'date' });

const getDefaultValueEntry = ({ filter, handleFilterToggle }) => filter.values
  .map((value) => {
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
        <ListItemText id={labelId}>{filter.getLongValueDisplay(value)}</ListItemText>
      </ListItem>
    );
  });

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
          style={classes.singularSelectors}
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

export {
  getAcbValueEntry,
  getCqmValueEntry,
  getCriteriaValueEntry,
  getDefaultValueEntry,
  getDateEntry,
  getDateTimeEntry,
  getRadioValueEntry,
};
