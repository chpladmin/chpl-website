import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, IconButton,
} from '@mui/material';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { testTool as testToolPropType } from 'shared/prop-types';
import { palette } from 'themes';

const sortOptions = [
  { property: 'value', text: 'Value' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'endDay', text: 'End Date' },
];

function ChplTestToolsView({ dispatch, testTools: initialTestTools }) {
  const { hasAnyRole } = useContext(UserContext);
  const [testTools, setTestTools] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();

  useEffect(() => {
    setTestTools(initialTestTools
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: [...item.criteria]
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [initialTestTools, filterContext]);

  const handleSort = (property, orderDirection) => {
    const descending = orderDirection === 'desc';
    setTestTools((prev) => [...prev].sort(sortComparator(property, descending)));
    setOrderBy(property);
    setOrder(orderDirection);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value..."
      />
      <ChplFilterLayout>
        <ChplSearchResultControls
          recordCount={testTools.length}
          pageStart={1}
          pageEnd={testTools.length}
          fadeBackground={palette.white}
          wrapActions
          showEmptyState
          sx={resultsHeaderSx}
        >
          <ChplSortControls
            sortOptions={sortOptions}
            orderBy={orderBy}
            order={order}
            onSort={handleSort}
          />
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-test-tool"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          )}
        </ChplSearchResultControls>
        <Box>
          { testTools
            .map((item) => (
              <ChplSearchResultCard
                sx={resultCardSx}
                key={`${item.value}`}
                cardTitle="Value"
                cardTitleValue={`${item.value}${item.retired ? ' (Retired)' : ''}`}
                titleIconButton={(
                  <ChplTooltip title="Use this value in a upload file">
                    <IconButton color="primary" size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </ChplTooltip>
            )}
                fieldGroups={[
                  [
                    {
                      label: 'Start Date',
                      value: getDisplayDateFormat(item.startDay),
                    },
                    {
                      label: 'End Date',
                      value: getDisplayDateFormat(item.endDay),
                    },
                    {
                      label: 'Applicable Criteria',
                      value: item.criteriaDisplay || 'N/A',
                    },
                  ],
                ]}
                actions={
              hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                <Button
                  onClick={() => dispatch({ action: 'edit', payload: item })}
                  id={`edit-test-tool-${item.value}`}
                  variant="contained"
                  color="secondary"
                  size="small"
                  endIcon={<EditOutlinedIcon />}
                >
                  Edit
                </Button>
              )
            }
              />
            ))}
        </Box>
      </ChplFilterLayout>
    </>
  );
}

export default ChplTestToolsView;

ChplTestToolsView.propTypes = {
  dispatch: func.isRequired,
  testTools: arrayOf(testToolPropType).isRequired,
};
