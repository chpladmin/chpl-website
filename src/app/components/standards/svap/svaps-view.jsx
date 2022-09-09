import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, object } from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import EventIcon from '@material-ui/icons/Event';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { isCures, sortCriteria } from 'services/criteria.service';

const headers = [
  { property: 'regulatoryTextCitation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'approvedStandardVersion', text: 'Approved Standard Version', sortable: true },
  { text: 'Applicable Criteria' },
  { property: 'replaced', text: 'Replaced', sortable: true },
  { text: 'Action', invisible: true },
];

const useStyles = makeStyles({
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
});

function ChplSvapsView(props) {
  const { dispatch } = props;
  const [svaps, setSvaps] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('regulatoryTextCitation');
  const classes = useStyles();

  useEffect(() => {
    setSvaps(props.svaps
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number + (isCures(c) ? ' (Cures Update)' : ''))
          .join(', '),
      }))
      .sort(sortComparator('regulatoryTextCitation')));
  }, [props.svaps]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = svaps.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setSvaps(updated);
  };

  return (
    <>
      <Button
        onClick={() => dispatch({action: 'edit', payload: {}})}
      >
        Add
      </Button>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="SVAP table"
        >
          <ChplSortableHeaders
            headers={headers}
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
                  <TableCell align="right">
                    <Button
                      onClick={() => dispatch({action: 'edit', payload: item})}
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

export default ChplSvapsView;

ChplSvapsView.propTypes = {
  dispatch: func.isRequired,
  svaps: arrayOf(object).isRequired,
};
