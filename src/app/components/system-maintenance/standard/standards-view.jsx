import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
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

import { useFetchStandardsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplUpdateIndicator } from 'components/util';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { standard as standardPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'value', text: 'Value', sortable: true },
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'requiredDay', text: 'Required Date', sortable: true },
  { property: 'extensionEndDay', text: 'Extension End Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Rule' },
  { text: 'Applicable Criteria' },
  { text: 'Group' },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplStandardsView({ dispatch, standards: initialStandards }) {
  const [standards, setStandards] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setStandards(initialStandards
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
        item.regulatoryTextCitation,
                     item.rule?.name,
                     item.groupName,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [initialStandards, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = standards.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setStandards(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Group..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mx={8} my={2}>
        <Box display="flex" flexDirection="row" gridGap={1}>
          <Typography variant="subtitle2">Search Results:</Typography>
          <Typography variant="body2">
            {`(${standards.length} Result${standards.length !== 1 ? 's' : ''})`}
          </Typography>
        </Box>
        <div className={classes.tableResultsHeaderContainer}>
          <ChplSystemMaintenanceActivity
            fetch={useFetchStandardsActivity}
            title="Standards"
          />
          { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
            <Button
              onClick={() => dispatch({ action: 'edit', payload: {} })}
              id="add-new-standard"
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
            >
              Add
            </Button>
          )}
        </div>
      </Box>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Standards table"
        >
          <ChplSortableHeaders
            headers={headers.filter((h) => hasAnyRole(['chpl-admin', 'chpl-onc']) || !h.invisible)}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { standards
              .map((item) => (
                <TableRow key={`${item.id}-${item.value}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.value }
                    { item.retired && ' (Expired)'}
                    <ChplUpdateIndicator
                      requiredDay={item.requiredDay}
                      endDay={item.endDay}
                      additionalInformation={item.additionalInformation}
                    />
                  </TableCell>
                  <TableCell>
                    { item.regulatoryTextCitation }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.requiredDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.extensionEndDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.rule?.name ?? '' }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  <TableCell>
                    { item.groupName ?? '' }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-standard-${item.value}`}
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

export default ChplStandardsView;

ChplStandardsView.propTypes = {
  dispatch: func.isRequired,
  standards: arrayOf(standardPropType).isRequired,
};
