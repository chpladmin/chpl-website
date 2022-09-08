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

const headers = [
  { property: 'citation', text: 'Regulatory Text Citation', sortable: true },
  { property: 'standard', text: 'Approved Standard Version', sortable: true },
  { property: 'criteria', text: 'Applicable Criteria' },
  { property: 'replaced', text: 'Replaced', sortable: true },
  { property: 'actions', text: 'Action', invisible: true },
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
  const [orderBy, setOrderBy] = useState('citation');
  const classes = useStyles();

  useEffect(() => {
    setSvaps(props.svaps
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('criteria')));
  }, []);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = svaps.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setJobTypes(updated);
  };

  return (
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
              <TableRow key={`${item.citation}-${item.standard}`}>
                <TableCell className={classes.firstColumn}>
                  { item.citation }
                </TableCell>
                <TableCell>
                  { item.standard }
                </TableCell>
                <TableCell>
                  { item.replaced ? 'Yes' : 'No' }
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => dispatch('edit', item)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ChplSvapsView;

ChplSvapsView.propTypes = {
  dispatch: func.isRequired,
  svaps: arrayOf(object).isRequired,
};
