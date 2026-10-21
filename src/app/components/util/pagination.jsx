import React from 'react';
import { TablePagination } from '@mui/material';
import {
  arrayOf,
  func,
  number,
} from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';

const styles = {
  pagination: {
    '& .MuiTablePagination-toolbar': {
      px: 2,
      pt: 2,
      width: '100%',
      maxHeight: '32px',
      '& p': {
        margin: 0,
      },
    },
  },
};

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
    const nextRowsPerPage = parseInt(event.target.value, 10);
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Change Rows Per Page',
        label: nextRowsPerPage,
      });
    }
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  return (
    <TablePagination
      component="div"
      sx={styles.pagination}
      labelRowsPerPage="Results per page:"
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
