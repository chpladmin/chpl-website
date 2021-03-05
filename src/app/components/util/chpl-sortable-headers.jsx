import React from 'react';
import PropTypes from 'prop-types';
import {arrayOf, bool, func, shape, string} from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function ChplSortableHeaders (props) {
  const {order, orderBy, onRequestSort} = props;
  const classes = useStyles();

  const createSortHandler = (property) => (event) => {
    onTableSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.headers.map((headCell) => (
          headCell.sortable
            ? <TableCell key={ headCell.property }
                         align={'left'}
                         sortDirection={ orderBy === headCell.property ? order : false }>
                <TableSortLabel className={ classes.header }
                                active={ orderBy === headCell.property }
                                direction={ orderBy === headCell.property ? order : 'asc' }
                                onClick={ createSortHandler(headCell.property) } >
                    { headCell.text }
                    {orderBy === headCell.property
                      ? (
                        <span className={classes.visuallyHidden}>
                          { order === 'desc' ? 'sorted descending' : 'sorted ascending' }
                        </span>
                      ) : null}
                </TableSortLabel>
              </TableCell>
            : <TableCell align="left" key={headCell.property}>{headCell.text}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export {ChplSortableHeaders};

ChplSortableHeaders.propTypes = {
  onTableSort: func,
  order: PropTypes.oneOf(['asc', 'desc', '']),
  orderBy: string,
  headers: arrayOf(shape({
    property: string,
    text: string,
    sortable: bool,
  })),
};
