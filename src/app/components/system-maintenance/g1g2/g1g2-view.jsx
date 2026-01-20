import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, object } from 'prop-types';

import { ChplSearchResultCard, ChplSortControls } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { sortCriteria } from 'services/criteria.service';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'abbreviation', text: 'Abbreviation' },
  { property: 'domainDisplay', text: 'Domain' },
  { property: 'name', text: 'Name' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplG1g2View(props) {
  const [g1g2, setG1g2] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('abbreviation');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setG1g2(props.g1g2
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.abbreviation,
        item.domain.name,
        item.requiredTest,
        item.name,
      ]))
      .map((item) => ({
        ...item,
        domainDisplay: item.domain.name,
        criteriaDisplay: item.allowedCriteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('abbreviation')));
  }, [props.g1g2, filterContext.filters, filterContext.searchTerm]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = g1g2.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setG1g2(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Abbreviation, Domain, Required Test, or Name..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box className={classes.headerContainer}>
        <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
          <Typography variant="subtitle2">Search Results</Typography>
          <Typography variant="body2">
            {`(${g1g2.length} Result${g1g2.length !== 1 ? 's' : ''})`}
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
        { g1g2
          .map((item) => (
            <ChplSearchResultCard
              key={`${item.id}`}
              title="Abbreviation"
              titleValue={item.abbreviation}
              fieldGroups={[
                [
                  {
                    label: 'Domain',
                    value: item.domainDisplay || 'N/A',
                    xs: 6,
                    sm: 3,
                  },
                  {
                    label: 'Required Test',
                    value: `${item.removed ? 'Removed | ' : ''}${item.requiredTest || 'N/A'}`,
                    xs: 6,
                    sm: 3,
                  },
                ],
                [
                  {
                    label: 'Name',
                    value: item.name || 'N/A',
                    xs: 12,
                    sm: 6,
                  },
                ],
                [
                  {
                    label: 'Applicable Criteria',
                    value: item.criteriaDisplay || 'N/A',
                    xs: 12,
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

export default ChplG1g2View;

ChplG1g2View.propTypes = {
  g1g2: arrayOf(object).isRequired,
};
