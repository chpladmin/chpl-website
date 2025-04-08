import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { testTool as testToolPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'value', text: 'Value', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Applicable Criteria' },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
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
  }, [initialTestTools, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = testTools.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setTestTools(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Typography variant="body2">
        {`(${testTools.length} Result${testTools.length !== 1 ? 's' : ''})`}
      </Typography>
      { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
        <div className={classes.tableResultsHeaderContainer}>
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-test-tool"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        </div>
      )}
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Test Tools table"
        >
          <ChplSortableHeaders
            headers={headers.filter((h) => hasAnyRole(['chpl-admin', 'chpl-onc']) || !h.invisible)}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { testTools
              .map((item) => (
                <TableRow key={`${item.value}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.value }
                    { item.retired && ' (Retired)'}
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-test-tool-${item.value}`}
                        variant="contained"
                        color="secondary"
                        endIcon={<EditOutlinedIcon />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplTestToolsView;

ChplTestToolsView.propTypes = {
  dispatch: func.isRequired,
  testTools: arrayOf(testToolPropType).isRequired,
};
