import React from 'react';
import {
  TablePagination,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  number,
} from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

// Sticky bottom offset in pixels for different breakpoints
const desktopStickyBottom = {
  md: 80,
  lg: 72,
  xl: 64,
};

const useStyles = makeStyles({
  pagination: {
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      bottom: desktopStickyBottom.md,
    },
    [theme.breakpoints.up('lg')]: {
      bottom: desktopStickyBottom.lg,
    },
    [theme.breakpoints.up('xl')]: {
      bottom: desktopStickyBottom.xl,
    },
  },
});

function ChplPagination({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions,
  sticky = true,
  setPage,
  setRowsPerPage,
}) {
  const { analytics } = useAnalyticsContext();
  const classes = useStyles();

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
      className={sticky ? classes.pagination : undefined}
      component="div"
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
  sticky: bool,
  setPage: func.isRequired,
  setRowsPerPage: func.isRequired,
};
