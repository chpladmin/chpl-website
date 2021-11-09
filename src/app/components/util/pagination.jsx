import React from 'react';
import {
  TablePagination,
} from '@material-ui/core';
import { arrayOf, func, number } from 'prop-types';

function ChplPagination(props) {
  const {
    count,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    setPage,
    setRowsPerPage,
  } = props;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}

export default ChplPagination;

ChplPagination.propTypes = {
  count: number.isRequired,
  page: number.isRequired,
  rowsPerPage: number.isRequired,
  rowsPerPageOptions: arrayOf(number).isRequired,
  setPage: func.isRequired,
  setRowsPerPage: func.isRequired,
};
