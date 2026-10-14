import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { bool, number, string } from 'prop-types';

import ChplSkeletonCard from './chpl-skeleton-card';

// Column layout of the listing search results, used when no column count is given
const listingColumnWidths = [
  '18%', // CHPL ID
  '18%', // Developer
  '18%', // Product
  '10%', // Version
  '14%', // Certification Date
  '7%', // Status
  '15%', // Actions
];

const cellWidths = ['80%', '60%', '70%', '50%'];

// The rows are only shapes, without cell borders; the table's Paper becomes a ChplSkeletonCard
const styles = {
  table: {
    '& .MuiTableCell-root': {
      borderBottom: 'none',
    },
  },
};

function ChplLoadingTable({
  className,
  columns,
  framed = true,
  rows = 10,
  showControls = true,
}) {
  const renderListingRow = () => (
    <>
      {/* CHPL ID */}
      <TableCell style={{ width: listingColumnWidths[0] }}>
        <Skeleton variant="text" width="90%" height={24} />
      </TableCell>
      {/* Developer */}
      <TableCell style={{ width: listingColumnWidths[1] }}>
        <Skeleton variant="text" width="80%" height={24} />
      </TableCell>
      {/* Product */}
      <TableCell style={{ width: listingColumnWidths[2] }}>
        <Skeleton variant="text" width="80%" height={24} />
      </TableCell>
      {/* Version */}
      <TableCell style={{ width: listingColumnWidths[3] }}>
        <Skeleton variant="text" width="40%" height={24} />
      </TableCell>
      {/* Certification Date */}
      <TableCell style={{ width: listingColumnWidths[4] }}>
        <Skeleton variant="text" width="60%" height={24} />
      </TableCell>
      {/* Status */}
      <TableCell style={{ width: listingColumnWidths[5] }}>
        <Skeleton variant="circular" width={24} height={24} />
      </TableCell>
      {/* Actions */}
      <TableCell style={{ width: listingColumnWidths[6] }}>
        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
          <Skeleton variant="rectangular" width={90} height={32} style={{ borderRadius: 4, marginBottom: 8 }} />
          <Skeleton variant="rectangular" width={90} height={32} style={{ borderRadius: 4 }} />
        </Box>
      </TableCell>
    </>
  );

  const renderGenericRow = (rowIdx) => [...Array(columns)].map((_col, colIdx) => (
    // eslint-disable-next-line react/no-array-index-key
    <TableCell key={colIdx}>
      <Skeleton variant="text" width={cellWidths[(rowIdx + colIdx) % cellWidths.length]} height={24} />
    </TableCell>
  ));

  const headerWidths = columns ? [...Array(columns)].map(() => undefined) : listingColumnWidths;

  return (
    <Box my={showControls ? 2 : 0}>
      { showControls
        && (
          <Box my={2} mx={8} display="flex" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="text" width="20%" height={24} />
          </Box>
        )}
      <TableContainer className={className} component={framed ? ChplSkeletonCard : undefined}>
        <Table sx={styles.table}>
          <TableHead>
            <TableRow>
              { headerWidths.map((width, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableCell key={idx} style={{ width }}><Skeleton /></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(rows)].map((_, rowIdx) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={rowIdx}>
                { columns ? renderGenericRow(rowIdx) : renderListingRow() }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ChplLoadingTable;

ChplLoadingTable.propTypes = {
  className: string,
  columns: number,
  framed: bool,
  rows: number,
  showControls: bool,
};
