import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@material-ui/core';
import {
  func,
  node,
  number,
  string,
} from 'prop-types';

import { filter as filterPropType } from 'shared/prop-types';

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabbed-filter-panel-${index}`}
      aria-labelledby={`tabbed-filter-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: node.isRequired,
  index: number.isRequired,
  value: number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tabbed-filter-tab-${index}`,
    'aria-controls': `tabbed-filter-panel-${index}`,
  };
}

function ChplTabbedValueEntry(props) {
  const {
    filter,
    handleFilterToggle,
    isActive,
    retiredLabel,
  } = props;
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const getToggle = (value) => {
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
        <ListItemText id={labelId}>
          {filter.getLongValueDisplay(value)}
        </ListItemText>
      </ListItem>
    );
  };

  return (
    <>
      <AppBar position="sticky">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="Filter tabs"
          variant="fullWidth"
        >
          <Tab label="Active" {...a11yProps(0)} />
          <Tab label={retiredLabel} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        { filter.values
          .filter((value) => isActive(value, filter))
          .map(getToggle)}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        { filter.values
          .filter((value) => !isActive(value, filter))
          .map(getToggle)}
      </TabPanel>
    </>
  );
}

export default ChplTabbedValueEntry;

ChplTabbedValueEntry.propTypes = {
  filter: filterPropType.isRequired,
  handleFilterToggle: func.isRequired,
  isActive: func.isRequired,
  retiredLabel: string,
};

ChplTabbedValueEntry.defaultProps = {
  retiredLabel: 'Retired',
};
