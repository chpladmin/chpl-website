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
import { func, node, number } from 'prop-types';

import { filter as filterPropType } from 'shared/prop-types';

const getCriteriaValueEntry = (props) => <ChplCriteriaValueEntry {...props} />;

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`criteria-panel-${index}`}
      aria-labelledby={`criteria-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ChplCriteriaValueEntry(props) {
  const { filter, handleFilterToggle } = props;
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
          aria-label="Criteria tabs"
          variant="fullWidth"
        >
          <Tab label="Active" {...a11yProps(0)} />
          <Tab label="Removed/Retired" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        { filter.values
          .filter((value) => !filter.getValueDisplay(value).includes('|'))
          .map(getToggle)}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        { filter.values
          .filter((value) => filter.getValueDisplay(value).includes('|'))
          .map(getToggle)}
      </TabPanel>
    </>
  );
}

export default getCriteriaValueEntry;

ChplCriteriaValueEntry.propTypes = {
  filter: filterPropType.isRequired,
  handleFilterToggle: func.isRequired,
};
