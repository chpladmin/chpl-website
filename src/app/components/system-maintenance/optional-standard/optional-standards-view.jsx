import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { arrayOf, shape } from 'prop-types';
import InfoIcon from '@mui/icons-material/Info';

import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  ChplTooltip,
} from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import { ChplFilterLayout, ChplFilterSearchBar, useFilterContext } from 'components/filter';
import { sortCriteria } from 'services/criteria.service';

const sortOptions = [
  { property: 'displayValue', text: 'Display Value' },
];

function ChplOptionalStandardsView({ optionalStandards: initialOptionalStandards }) {
  const [optionalStandards, setOptionalStandards] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('displayValue');
  const filterContext = useFilterContext();

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
        criteriaDisplay: [...item.criteria]
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
      <ChplFilterLayout>
        <ChplSearchResultControls
          recordCount={optionalStandards.length}
          pageStart={1}
          pageEnd={optionalStandards.length}
          sticky={false}
          wrapActions
          sx={resultsHeaderSx}
        >
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
        </ChplSearchResultControls>
        <Box>
          { optionalStandards
            .map((item) => (
              <ChplSearchResultCard
                sx={resultCardSx}
                key={`${item.id}`}
                cardTitle="Display Value"
                cardTitleValue={item.displayValue}
                fieldGroups={[
                  [
                    {
                      label: 'Description',
                      value: item.description || 'N/A',
                    },
                    {
                      label: 'Citation',
                      value: item.citation || 'N/A',
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
                    },
                  ],
                ]}
              />
            ))}
        </Box>
      </ChplFilterLayout>
    </>
  );
}

export default ChplOptionalStandardsView;

ChplOptionalStandardsView.propTypes = {
  optionalStandards: arrayOf(shape({})).isRequired,
};
