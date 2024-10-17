import React from 'react';
import {
  TablePagination,
} from '@material-ui/core';
import { arrayOf, func, number } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';

function ChplPagination({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions,
  setPage,
  setRowsPerPage,
}) {
  const { analytics } = useAnalyticsContext();

  const handlePageChange = (event, newPage) => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Change Page',
        label: newPage,
      });
    }
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Change Rows Per Page',
        label: event.target.value,
      });
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
};
