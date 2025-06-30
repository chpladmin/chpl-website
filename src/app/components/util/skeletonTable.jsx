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

function ChplLoadingTable({ rows = 10, columns = 7, height = 32, className }) {
  return (
    <Box mt={2} mb={2}>
      <TableContainer className={className} component={Paper}>
        <Table>
          <TableBody>
            {[...Array(rows)].map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {[...Array(columns)].map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton variant="rect" width="100%" height={height} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ChplLoadingTable;