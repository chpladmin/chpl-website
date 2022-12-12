import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  filterContainer: {
    display: 'flex',
    padding: '16px 32px',
    gap: '8px',
    backgroundColor: '#fafdff',
    borderBottom: '1px solid #bbb',
    flexWrap: 'wrap',
    flexFlow: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
  },
  filterSelectedContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
}));

function ChplFilterChips() {
  const $analytics = getAngularService('$analytics');
  const [filters, setFilters] = useState([]);
  const filterContext = useFilterContext();
  const classes = useStyles();
  const DISPLAY_MAX = 7;

  useEffect(() => {
    setFilters(filterContext.filters
      .sort((a, b) => (a.getFilterDisplay(a) < b.getFilterDisplay(b) ? -1 : 1))
      .map((filter) => ({
        ...filter,
        values: filter.values
          .filter((v) => v.selected)
          .sort((a, b) => filter.sortValues(filter, a, b)),
      }))
      .filter((filter) => filter.values.length > 0));
  }, [filterContext.filters]);

  const removeChip = (f, v) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Remove Chip', { category: filterContext.analytics.category, label: `${f.getFilterDisplay(f)}: ${f.getValueDisplay(v)}` });
    }
    filterContext.dispatch('toggle', f, v);
  };

  const toggleOperator = (f) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Toggle Operator', { category: filterContext.analytics.category, label: `${f.getFilterDisplay(f)}: ${f.operator === 'and' ? 'All' : 'Any'}` });
    }
    filterContext.dispatch('toggleOperator', f);
  };

  const toggleShowAll = (f) => {
    if (filterContext.analytics) {
      $analytics.eventTrack('Toggle Show All', { category: filterContext.analytics.category, label: `${f.getFilterDisplay(f)}: ${f.showAll ? 'All' : 'Some'}` });
    }
    filterContext.dispatch('toggleShowAll', f);
  };

  return (
    <span className={classes.filterContainer} id="filter-chips">
      <Typography variant="subtitle1">Filters Applied</Typography>
      { filters.map((f) => (
        <span
          className={classes.filterSelectedContainer}
          key={f.key}
        >
          <Typography variant="body1">
            <strong>
              {f.getFilterDisplay(f)}
            </strong>
          </Typography>
          { f.operatorKey
            && (
              <FormControlLabel
                control={(
                  <Switch
                    id={`${f.key}-operator-chips-toggle`}
                    color="primary"
                    checked={f.operator === 'and'}
                    onChange={() => toggleOperator(f)}
                  />
                )}
                label={f.operator === 'and' ? 'All' : 'Any'}
              />
            )}
          {f.values
            .filter((v, idx) => f.showAll || idx < DISPLAY_MAX)
            .map((v) => (
              <Chip
                key={v.value}
                label={f.getValueDisplay(v)}
                onDelete={() => removeChip(f, v)}
                color="primary"
                variant="outlined"
                disabled={f.required && f.values.length === 1}
              />
            ))}
          { f.values.length > DISPLAY_MAX
            && (
              <Button
                onClick={() => toggleShowAll(f)}
                color="primary"
                variant="text"
              >
                { f.showAll ? 'Show Fewer' : `Show ${f.values.length - DISPLAY_MAX} More` }
              </Button>
            )}
        </span>
      ))}
    </span>
  );
}

export default ChplFilterChips;

ChplFilterChips.propTypes = {};
