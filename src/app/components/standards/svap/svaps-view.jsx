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
import { svap as svapPropType } from 'shared/prop-types';

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
  tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  }, [props.svaps]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = svaps.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setSvaps(updated);
  };

  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <Button
          onClick={() => dispatch({ action: 'edit', payload: {} })}
          id="add-new-svap"
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>
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
                      onClick={() => dispatch({ action: 'edit', payload: item })}
                      id={`edit-svap-${item.regulatoryTextCitation}-${item.approvedStandardVersion}`}
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

export default ChplSvapsView;

ChplSvapsView.propTypes = {
  dispatch: func.isRequired,
  svaps: arrayOf(svapPropType).isRequired,
};
