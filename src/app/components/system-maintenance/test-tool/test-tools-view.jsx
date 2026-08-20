import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { ChplSearchResultCard, ChplSortControls, ChplTooltip } from 'components/util';
import { sortComparator } from 'components/util/sortable-headers';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { testTool as testToolPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const sortOptions = [
  { property: 'value', text: 'Value' },
  { property: 'startDay', text: 'Start Date' },
  { property: 'endDay', text: 'End Date' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplTestToolsView({ dispatch, testTools: initialTestTools }) {
  const { hasAnyRole } = useContext(UserContext);
  const [testTools, setTestTools] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setTestTools(initialTestTools
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
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
        <Box className={classes.headerContainer}>
          <Box display="flex" flexDirection="row" gridGap={2} alignItems="center">
            <Typography variant="subtitle2">Search Results</Typography>
            <Typography variant="body2">
              {`(${testTools.length} Result${testTools.length !== 1 ? 's' : ''})`}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gridGap={4}>
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
          </Box>
        </Box>
        <Box style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto', padding: '16px' }}>
          { testTools
            .map((item) => (
              <ChplSearchResultCard
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
