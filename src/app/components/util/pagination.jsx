import React from 'react';
import {
  TablePagination,
} from '@material-ui/core';
import { arrayOf, func, number, shape, string } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';

function ChplPagination(props) {
  const $analytics = getAngularService('$analytics');
  const {
    count,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    setPage,
    setRowsPerPage,
    analytics,
  } = props;

  const handlePageChange = (event, newPage) => {
    if (analytics) {
      $analytics.eventTrack('Change Page', { category: analytics.category, label: newPage });
    }
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    if (analytics) {
      $analytics.eventTrack('Change Rows Per Page', { category: analytics.category, label: event.target.value });
    }
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
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
  analytics: shape({
    category: string.isRequired,
  }),
};

ChplPagination.defaultProps = {
  analytics: false,
};
