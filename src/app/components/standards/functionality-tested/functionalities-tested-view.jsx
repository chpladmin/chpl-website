import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { isCures, sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { functionalityTested as functionalityTestedPropType } from 'shared/prop-types';

const headers = [
  { property: 'value', text: 'Value', sortable: true },
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'requiredDay', text: 'Required Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Rule' },
  { text: 'Applicable Criteria' },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

function ChplFunctionalitiesTestedView({ dispatch, functionalitiesTested: initialFunctionalitiesTested }) {
  const [functionalitiesTested, setFunctionalitiesTested] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const classes = useStyles();

  useEffect(() => {
    setFunctionalitiesTested(initialFunctionalitiesTested
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number + (isCures(c) ? ' (Cures Update)' : ''))
          .join(', '),
      }))
      .sort(sortComparator('value')));
  }, [initialFunctionalitiesTested]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = functionalitiesTested.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setFunctionalitiesTested(updated);
  };

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <Button
          onClick={() => dispatch({ action: 'edit', payload: {} })}
          id="add-new-functionality-tested"
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Functionalities Tested table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { functionalitiesTested
              .map((item) => (
                <TableRow key={`${item.id}-${item.name}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
                    { item.value }
                    { item.retired && ' (Retired)'}
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
                    { item.criteriaDisplay }
                  </TableCell>
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
