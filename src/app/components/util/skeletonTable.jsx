import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

function ChplLoadingTable({ rows = 10, className }) {
  // Match your real table's column widths
  const columnWidths = [
    '18%',   // CHPL ID
    '18%',   // Developer
    '18%',   // Product
    '10%',   // Version
    '14%',   // Certification Date
    '7%',    // Status
    '15%',   // Actions
  ];

  return (
    <Box mt={2} mb={2}>
      <TableContainer className={className} component={Paper}>
        <Table>
          <TableBody>
            {[...Array(rows)].map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {/* CHPL ID */}
                <TableCell style={{ width: columnWidths[0] }}>
                  <Skeleton variant="text" width="90%" height={24} />
                </TableCell>
                {/* Developer */}
                <TableCell style={{ width: columnWidths[1] }}>
                  <Skeleton variant="text" width="80%" height={24} />
                </TableCell>
                {/* Product */}
                <TableCell style={{ width: columnWidths[2] }}>
                  <Skeleton variant="text" width="80%" height={24} />
                </TableCell>
                {/* Version */}
                <TableCell style={{ width: columnWidths[3] }}>
                  <Skeleton variant="text" width="40%" height={24} />
                </TableCell>
                {/* Certification Date */}
                <TableCell style={{ width: columnWidths[4] }}>
                  <Skeleton variant="text" width="60%" height={24} />
                </TableCell>
                {/* Status */}
                <TableCell style={{ width: columnWidths[5] }}>
                  <Skeleton variant="circle" width={24} height={24} />
                </TableCell>
                {/* Actions */}
                <TableCell style={{ width: columnWidths[6] }}>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Skeleton variant="rect" width={90} height={32} style={{ borderRadius: 4, marginBottom: 8 }} />
                    <Skeleton variant="rect" width={90} height={32} style={{ borderRadius: 4 }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ChplLoadingTable;