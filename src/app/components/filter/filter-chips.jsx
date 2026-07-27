import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getStatusIcon } from 'services/listing.service';
import { palette } from 'themes';

const useStyles = makeStyles({
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    width: '100%',
  },
  filterSelectedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  filterChipsContainer: {
    display: 'flex',
    gap: '16px',
    alignContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  chip: {
    border: `1px solid ${palette.primary}`,
    backgroundColor: palette.white,
    maxWidth: '100%',
  },
  chipDeleteIcon: {
    order: -2,
    marginLeft: '5px',
    marginRight: '-4px',
  },
  chipLabel: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: '4px',
  },
  card: {
    width: '100%',
    maxHeight: '50vh',
    overflowY: 'auto',
  },
});

const truncate = (str, n, useWordBoundary) => {
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n - 1);
  return `${useWordBoundary ? subString.slice(0, subString.lastIndexOf(' ')) : subString}...`;
};

const maxLengthForChip = 40;

function ChplFilterChips() {
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
      eventTrack({
        ...filterContext.analytics,
        event: 'Remove Filter Chip',
        label: f.getValueDisplay(v),
        aggregationName: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggle', f, v);
  };

  const toggleOperator = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Any/All Filter to ${f.operator === 'and' ? 'Any' : 'All'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleOperator', f);
  };

  const toggleDevelopersListingsCriteriaOption = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Set Active/All Listing Filter to ${f.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleDevelopersListingsCriteriaOption', f);
  };

  const toggleShowAll = (f) => {
    if (filterContext.analytics) {
      eventTrack({
        ...filterContext.analytics,
        event: `Toggle Show All to ${f.showAll ? 'Some' : 'All'}`,
        label: f.getFilterDisplay(f),
      });
    }
    filterContext.dispatch('toggleShowAll', f);
  };

  if (filters.length === 0) { return null; }

  const getChipLabel = (f, labelText, iconName) => {
    if (f.key !== 'certificationStatuses') { return labelText; }
    return (
      <span className={classes.chipLabel}>
        { labelText }
        { getStatusIcon({ name: iconName }) }
      </span>
    );
  };

  return (
    <span className={classes.filterContainer} id="filter-chips">
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="subtitle2">Filters Applied:</Typography>
          <div className={classes.filterChipsContainer}>
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
                { f.developersListingsCriteriaOptionKey
                && (
                  <FormControlLabel
                    control={(
                      <Switch
                        id={`${f.key}-developers-listings-criteria-option-chips-toggle`}
                        color="primary"
                        checked={f.developersListingsCriteriaOption === 'all'}
                        onChange={() => toggleDevelopersListingsCriteriaOption(f)}
                      />
                    )}
                    label={f.developersListingsCriteriaOption === 'active' ? 'Active Listings' : 'All Listings'}
                  />
                )}
                {f.values
                  .filter((v, idx) => f.showAll || idx < DISPLAY_MAX)
                  .map((v) => (
                    <React.Fragment key={v.value}>
                      { f.getValueDisplay(v).length > maxLengthForChip
                        ? (
                          <ChplTooltip
                            title={f.getLongValueDisplay(v)}
                          >
                            <Chip
                              label={getChipLabel(f, truncate(f.getValueDisplay(v), maxLengthForChip, true), f.getValueDisplay(v))}
                              onDelete={() => removeChip(f, v)}
                              variant="outlined"
                              disabled={f.required && f.values.length === 1}
                              classes={{ root: classes.chip, deleteIcon: classes.chipDeleteIcon }}
                            />
                          </ChplTooltip>
                        ) : (
                          <Chip
                            label={getChipLabel(f, f.getValueDisplay(v), f.getValueDisplay(v))}
                            onDelete={() => removeChip(f, v)}
                            variant="outlined"
                            disabled={f.required && f.values.length === 1}
                            classes={{ root: classes.chip, deleteIcon: classes.chipDeleteIcon }}
                          />
                        )}
                    </React.Fragment>
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
          </div>
        </CardContent>
      </Card>
    </span>
  );
}

export default ChplFilterChips;

ChplFilterChips.propTypes = {};
