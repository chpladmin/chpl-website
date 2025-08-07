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

import { useFetchFunctionalitiesTestedActivity } from 'api/activity';
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
import { functionalityTested as functionalityTestedPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'value', text: 'Value', sortable: true },
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'requiredDay', text: 'Required Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Rule' },
  { text: 'Practice Type' },
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

function ChplFunctionalitiesTestedView({ dispatch, functionalitiesTested: initialFunctionalitiesTested }) {
  const { hasAnyRole } = useContext(UserContext);
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setFunctionalitiesTested(initialFunctionalitiesTested
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.value,
        item.regulatoryTextCitation,
                               item.rule?.name,
                               item.practiceType?.name,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [initialFunctionalitiesTested, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = functionalitiesTested.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setFunctionalitiesTested(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Value, Citation, Rule, or Practice Type..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Typography variant="body2">
        {`(${functionalitiesTested.length} Result${functionalitiesTested.length !== 1 ? 's' : ''})`}
      </Typography>
      <div className={classes.tableResultsHeaderContainer}>
        <ChplSystemMaintenanceActivity
          fetch={useFetchFunctionalitiesTestedActivity}
          title="Functionalities Tested"
        />
        { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <Button
            onClick={() => dispatch({ action: 'edit', payload: {} })}
            id="add-new-functionality-tested"
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
          aria-label="Functionalities Tested table"
        >
          <ChplSortableHeaders
            headers={headers.filter((h) => hasAnyRole(['chpl-admin', 'chpl-onc']) || !h.invisible)}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { functionalitiesTested
              .map((item) => (
                <TableRow key={`${item.id}-${item.value}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.value }
                    { item.retired && ' (Retired)'}
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
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.rule?.name ?? '' }
                  </TableCell>
                  <TableCell>
                    { item.practiceType?.name ?? '' }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                  { hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                    <TableCell align="right">
                      <Button
                        onClick={() => dispatch({ action: 'edit', payload: item })}
                        id={`edit-functionality-tested-${item.value}`}
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

export default ChplFunctionalitiesTestedView;

ChplFunctionalitiesTestedView.propTypes = {
  dispatch: func.isRequired,
  functionalitiesTested: arrayOf(functionalityTestedPropType).isRequired,
};
