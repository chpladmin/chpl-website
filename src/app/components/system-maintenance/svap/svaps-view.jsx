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

import { useFetchSvapsActivity } from 'api/activity';
import ChplSystemMaintenanceActivity from 'components/activity/system-maintenance-activity';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { UserContext } from 'shared/contexts';
import { svap as svapPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'approvedStandardVersion', text: 'Approved Standard Version', sortable: true },
  { text: 'Applicable Criteria' },
  { property: 'replaced', text: 'Replaced', sortable: true },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  ...utilStyles,
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplSvapsView({ dispatch, svaps: initialSvaps }) {
  const [svaps, setSvaps] = useState([]);
  const { hasAnyRole } = useContext(UserContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('regulatoryTextCitation');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setSvaps(initialSvaps
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.regulatoryTextCitation,
        item.approvedStandardVersion,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number)
          .join(', '),
      }))
      .sort(sortComparator('regulatoryTextCitation')));
  }, [initialSvaps, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = svaps.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setSvaps(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Citation or Version..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Typography variant="body2">
        {`(${svaps.length} Result${svaps.length !== 1 ? 's' : ''})`}
      </Typography>
      <div className={classes.tableResultsHeaderContainer}>
        <ChplSystemMaintenanceActivity
          fetch={useFetchSvapsActivity}
          title="SVAP"
        />
        { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-svap"
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        )}
      </div>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="SVAP table"
        >
          <ChplSortableHeaders
            headers={headers.filter((h) => hasAnyRole(['chpl-admin', 'chpl-onc']) || !h.invisible)}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { svaps
              .map((item) => (
                <TableRow key={`${item.regulatoryTextCitation}-${item.approvedStandardVersion}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.regulatoryTextCitation }
                  </TableCell>
                  <TableCell>
                    { item.approvedStandardVersion }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  <TableCell>
                    { item.replaced ? 'Yes' : 'No' }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-svap-${item.regulatoryTextCitation}-${item.approvedStandardVersion}`}
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

export default ChplSvapsView;

ChplSvapsView.propTypes = {
  dispatch: func.isRequired,
  svaps: arrayOf(svapPropType).isRequired,
};
