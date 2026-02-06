import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, shape } from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { sortCriteria } from 'services/criteria.service';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'displayValue', text: 'Display Value' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplOptionalStandardsView({ optionalStandards: initialOptionalStandards }) {
  const [optionalStandards, setOptionalStandards] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('displayValue');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setOptionalStandards(initialOptionalStandards
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.displayValue,
        item.citation,
        item.description,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('displayValue')));
  }, [initialOptionalStandards, filterContext]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setOptionalStandards((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Display Value, Citation, or Description..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">Search Results</Typography>
          <Typography variant="body2">
            {`(${optionalStandards.length} Result${optionalStandards.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gridGap={4}>
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
        </Box>
      </Box>
      <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
        { optionalStandards
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}`}
              title="Display Value"
              titleValue={item.displayValue}
              fieldGroups={[
                [
                  {
                    label: 'Description',
                    value: item.description || 'N/A',
                    xs: 12,
                    sm: 12,
                  },
                  {
                    label: 'Citation',
                    value: item.citation || 'N/A',
                    xs: 6,
                    sm: 6,
                    iconButton: (
                      <ChplTooltip title="Use this value in a upload file">
                        <IconButton color="primary" size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </ChplTooltip>
                    ),
                  },
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 6,
                    sm: 6,
                  },
                ],
              ]}
            />
          ))}
      </Box>
    </>
  );
}

export default ChplOptionalStandardsView;

ChplOptionalStandardsView.propTypes = {
  optionalStandards: arrayOf(shape({})).isRequired,
};
